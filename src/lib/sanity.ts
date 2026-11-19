/**
 * Sanity Client for PrintHub Africa (Project: m7x6icn3)
 * Zero external dependencies — uses native fetch and Sanity's global CDN API.
 */

export interface SanityProduct {
  slug: string;
  name: string;
  cat: string;
  price: string;
  originalPrice?: string;
  discountBadge?: string;
  onSale?: boolean;
  isCollab?: boolean;
  creatorName?: string;
  creatorUrl?: string;
  externalPurchaseUrl?: string;
  purchaseAction?: "whatsapp" | "external" | "both";
  note: string;
  material: string;
  finish: string;
  tags: string[];
  blurb: string;
  uses: string[];
  care: string;
  sizes?: string[];
  colours?: string[];
  customizationPrompt?: string;
  waMessage?: string;
  photos?: string[];
}

export interface SanityFaq {
  group: string;
  q: string;
  a: string;
}

export interface SanityWhatsAppMessages {
  general?: string;
  customFile?: string;
  customIdea?: string;
  business?: string;
  help?: string;
}

export interface SanitySocials {
  instagram?: string;
  threads?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  googleBusiness?: string;
}

export interface SanitySettings {
  name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  hours?: string[];
  whatsappMessages?: SanityWhatsAppMessages;
  socials?: SanitySocials;
  paystackPublicKey?: string;
  enableCheckout?: boolean;
}

export interface SanityLegalPage {
  title: string;
  slug: string;
  subtitle?: string;
  lastUpdated?: string;
  noticeBanner?: string;
  sections?: Array<{ title: string; content: string }>;
  seoDescription?: string;
}

export interface SanityPageContent {
  page: string;
  heroHeading?: string;
  heroSubtext?: string;
  niamadeHubBlurb?: string;
  brandBlurb?: string;
  values?: Array<{ title: string; description: string; tone: string }>;
  steps?: Array<{ step: string; title: string; description: string }>;
  ctaHeading?: string;
  ctaBody?: string;
}

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || import.meta.env?.SANITY_PROJECT_ID || "m7x6icn3";
const SANITY_DATASET = process.env.SANITY_DATASET || import.meta.env?.SANITY_DATASET || "production";
const SANITY_API_VERSION = "2023-08-01";
// IMPORTANT: Set SANITY_API_TOKEN as an environment variable (Cloudflare Pages secret).
// The old token has been removed — rotate it in your Sanity project immediately.
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || import.meta.env?.SANITY_API_TOKEN || "";

const authHeaders: Record<string, string> = SANITY_API_TOKEN ? { Authorization: `Bearer ${SANITY_API_TOKEN}` } : {};

function urlForImage(source: any): string | null {
  if (!source) return null;
  if (typeof source === "string") return source;

  const ref = source.asset?._ref || source._ref;
  if (!ref || typeof ref !== "string") return null;

  const match = ref.match(/^image-([a-zA-Z0-9]+)-([0-9]+x[0-9]+)-([a-z0-9]+)$/);
  if (!match) return null;

  const [, id, dimensions, format] = match;
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
}

export function blocksToHtml(blocks: any): string {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";

  return blocks.map((block: any) => {
    if (block._type !== "block" || !Array.isArray(block.children)) return "";

    let html = block.children.map((child: any) => {
      let text = child.text || "";
      text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (Array.isArray(child.marks)) {
        for (const mark of child.marks) {
          if (mark === "strong") text = `<strong>${text}</strong>`;
          else if (mark === "em") text = `<em>${text}</em>`;
          else if (mark === "underline") text = `<u>${text}</u>`;
          else if (block.markDefs) {
            const def = block.markDefs.find((d: any) => d._key === mark);
            if (def && def.href) {
              text = `<a href="${def.href}" target="_blank" rel="noopener" class="text-brand underline">${text}</a>`;
            }
          }
        }
      }
      return text;
    }).join("");

    if (block.listItem === "bullet") return `<li>${html}</li>`;
    if (block.listItem === "number") return `<li>${html}</li>`;
    if (block.style === "h3") return `<h3 class="font-display text-2xl mt-4 mb-2">${html}</h3>`;
    if (block.style === "h4") return `<h4 class="font-display text-xl mt-3 mb-1 font-semibold">${html}</h4>`;
    if (block.style === "blockquote") return `<blockquote class="border-l-4 border-brand pl-4 italic my-3 text-mute">${html}</blockquote>`;
    return `<p class="leading-relaxed">${html}</p>`;
  }).join("\n");
}

export function blocksToPlainText(blocks: any): string {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b._type === "block" && Array.isArray(b.children))
    .map((b: any) => b.children.map((c: any) => c.text || "").join(""))
    .join(" ")
    .trim();
}

export async function fetchProductsFromSanity(): Promise<SanityProduct[] | null> {
  const query = encodeURIComponent(`*[_type == "product" && !(_id in path("drafts.**"))]{
    _id,
    name,
    "slug": slug.current,
    "category": coalesce(category->title, category, "Home & decor"),
    price,
    originalPrice,
    discountBadge,
    onSale,
    isCollab,
    creatorName,
    creatorUrl,
    externalPurchaseUrl,
    purchaseAction,
    note,
    material,
    finish,
    occasions,
    blurb,
    uses,
    care,
    sizes,
    colours,
    customizationPrompt,
    waMessage,
    photos
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: "application/json", ...authHeaders },
    });

    if (!res.ok) return null;

    const { result } = await res.json();
    if (!result || !Array.isArray(result) || result.length === 0) return null;

    return result.map((item: any) => {
      const photos: string[] = [];
      if (Array.isArray(item.photos)) {
        for (const p of item.photos) {
          const u = urlForImage(p);
          if (u) photos.push(u);
        }
      }

      return {
        slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-"),
        name: item.name,
        cat: item.category || "Home & decor",
        price: item.price || "KES 0",
        originalPrice: item.originalPrice || undefined,
        discountBadge: item.discountBadge || (item.originalPrice ? "Sale" : undefined),
        onSale: Boolean(item.onSale || item.originalPrice),
        isCollab: Boolean(item.isCollab),
        creatorName: item.creatorName || undefined,
        creatorUrl: item.creatorUrl || undefined,
        externalPurchaseUrl: item.externalPurchaseUrl || undefined,
        purchaseAction: item.purchaseAction || (item.externalPurchaseUrl ? "external" : "whatsapp"),
        note: item.note || "",
        material: item.material || "PLA",
        finish: item.finish || "Smooth",
        tags: Array.isArray(item.occasions) ? item.occasions : [],
        blurb: typeof item.blurb === "string" ? item.blurb : (blocksToHtml(item.blurb) || blocksToPlainText(item.blurb) || ""),
        uses: Array.isArray(item.uses) ? item.uses : [],
        care: typeof item.care === "string" ? item.care : (blocksToHtml(item.care) || blocksToPlainText(item.care) || ""),
        sizes: Array.isArray(item.sizes) ? item.sizes : undefined,
        colours: Array.isArray(item.colours) ? item.colours : undefined,
        customizationPrompt: item.customizationPrompt || undefined,
        waMessage: item.waMessage || undefined,
        photos: photos.length ? photos : undefined,
      };
    });
  } catch (err) {
    console.error("[Sanity Query Error]", err);
    return null;
  }
}

export async function fetchFaqsFromSanity(): Promise<SanityFaq[] | null> {
  const query = encodeURIComponent(`*[_type == "faq" && !(_id in path("drafts.**"))] | order(order asc){
    group,
    "q": question,
    "a": answer
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json", ...authHeaders } });
    if (!res.ok) return null;
    const { result } = await res.json();
    if (!Array.isArray(result) || !result.length) return null;

    const seen = new Set<string>();
    const faqs: SanityFaq[] = [];
    for (const f of result) {
      if (!f.q || seen.has(f.q)) continue;
      seen.add(f.q);
      faqs.push({
        group: f.group,
        q: f.q,
        a: typeof f.a === "string" ? f.a : (blocksToHtml(f.a) || blocksToPlainText(f.a) || ""),
      });
    }
    return faqs;
  } catch (err) {
    return null;
  }
}

export async function fetchSettingsFromSanity(): Promise<SanitySettings | null> {
  const query = encodeURIComponent(`*[_type == "siteSettings"][0]{
    name,
    phone,
    whatsapp,
    email,
    city,
    hours,
    whatsappMessages,
    socials,
    paystackPublicKey,
    enableCheckout
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json", ...authHeaders } });
    if (!res.ok) return null;
    const { result } = await res.json();
    return result || null;
  } catch (err) {
    return null;
  }
}

export async function fetchLegalPageFromSanity(slug: string): Promise<SanityLegalPage | null> {
  const query = encodeURIComponent(`*[_type == "legalPage" && slug.current == "${slug}"][0]{
    title,
    "slug": slug.current,
    subtitle,
    lastUpdated,
    noticeBanner,
    sections,
    seoDescription
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json", ...authHeaders } });
    if (!res.ok) return null;
    const { result } = await res.json();
    if (!result) return null;

    const sections = Array.isArray(result.sections)
      ? result.sections.map((s: any) => ({
          title: s.title || "",
          content: typeof s.content === "string" ? s.content : (blocksToHtml(s.content) || blocksToPlainText(s.content) || ""),
        }))
      : [];

    return {
      ...result,
      sections,
    };
  } catch (err) {
    return null;
  }
}

export interface SanityMaterial {
  name: string;
  fullName?: string;
  heatResistance?: string;
  finish?: string;
  durability?: string;
  bestFor?: string;
  sampleImage?: string;
  tone?: string;
  order?: number;
}

export interface SanityService {
  title: string;
  type: 'printing' | 'design';
  description: string;
  sampleImage?: string;
  order?: number;
}

export interface SanityOccasion {
  label: string;
  tagId: string;
  blurb?: string;
  featuredImage?: string;
  tone?: string;
  order?: number;
}

export async function fetchPageContentFromSanity(page: string): Promise<SanityPageContent | null> {
  const query = encodeURIComponent(`*[_type == "pageContent" && page == "${page}"][0]{
    page,
    heroHeading,
    heroSubtext,
    niamadeHubBlurb,
    brandBlurb,
    values,
    steps,
    ctaHeading,
    ctaBody,
    heroImage
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json", ...authHeaders } });
    if (!res.ok) return null;
    const { result } = await res.json();
    if (!result) return null;
    return {
      ...result,
      heroImage: urlForImage(result.heroImage) || undefined,
    };
  } catch (err) {
    return null;
  }
}

export async function fetchMaterialsFromSanity(): Promise<SanityMaterial[] | null> {
  const query = encodeURIComponent(`*[_type == "material"] | order(order asc){
    name,
    fullName,
    heatResistance,
    finish,
    durability,
    bestFor,
    tone,
    order,
    sampleImage
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json", ...authHeaders } });
    if (!res.ok) return null;
    const { result } = await res.json();
    if (!Array.isArray(result) || !result.length) return null;
    return result.map((m: any) => ({
      ...m,
      sampleImage: urlForImage(m.sampleImage) || undefined,
    }));
  } catch (err) {
    return null;
  }
}

export async function fetchServicesFromSanity(type?: 'printing' | 'design'): Promise<SanityService[] | null> {
  const filter = type ? ` && type == "${type}"` : '';
  const query = encodeURIComponent(`*[_type == "service"${filter}] | order(order asc){
    title,
    type,
    description,
    order,
    sampleImage
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json", ...authHeaders } });
    if (!res.ok) return null;
    const { result } = await res.json();
    if (!Array.isArray(result) || !result.length) return null;
    return result.map((s: any) => ({
      ...s,
      sampleImage: urlForImage(s.sampleImage) || undefined,
    }));
  } catch (err) {
    return null;
  }
}

export async function fetchOccasionsFromSanity(): Promise<SanityOccasion[] | null> {
  const query = encodeURIComponent(`*[_type == "occasion"] | order(order asc){
    label,
    tagId,
    blurb,
    tone,
    order,
    featuredImage
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json", ...authHeaders } });
    if (!res.ok) return null;
    const { result } = await res.json();
    if (!Array.isArray(result) || !result.length) return null;
    return result.map((o: any) => ({
      ...o,
      featuredImage: urlForImage(o.featuredImage) || undefined,
    }));
  } catch (err) {
    return null;
  }
}
