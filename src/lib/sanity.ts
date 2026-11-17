/**
 * Sanity Client for PrintHub Africa (Project: m7x6icn3)
 * Zero external dependencies — uses native fetch and Sanity's global CDN API.
 */

export interface SanityProduct {
  slug: string;
  name: string;
  cat: string;
  price: string;
  note: string;
  material: string;
  finish: string;
  tags: string[];
  blurb: string;
  uses: string[];
  care: string;
  photos?: string[];
}

export interface SanityFaq {
  group: string;
  q: string;
  a: string;
}

export interface SanitySettings {
  name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  hours?: string[];
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

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID || "m7x6icn3";
const SANITY_DATASET = process.env.SANITY_DATASET || import.meta.env.SANITY_DATASET || "production";
const SANITY_API_VERSION = "2023-08-01";

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

export async function fetchProductsFromSanity(): Promise<SanityProduct[] | null> {
  const query = encodeURIComponent(`*[_type == "product"]{
    _id,
    name,
    "slug": slug.current,
    category,
    price,
    note,
    material,
    finish,
    occasions,
    blurb,
    uses,
    care,
    photos
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      ...(process.env.SANITY_API_TOKEN ? { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } : {}),
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
        note: item.note || "",
        material: item.material || "PLA",
        finish: item.finish || "Smooth",
        tags: Array.isArray(item.occasions) ? item.occasions : [],
        blurb: item.blurb || "",
        uses: Array.isArray(item.uses) ? item.uses : [],
        care: item.care || "",
        photos: photos.length ? photos : undefined,
      };
    });
  } catch (err) {
    console.error("[Sanity Query Error]", err);
    return null;
  }
}

export async function fetchFaqsFromSanity(): Promise<SanityFaq[] | null> {
  const query = encodeURIComponent(`*[_type == "faq"] | order(order asc){
    group,
    "q": question,
    "a": answer
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const { result } = await res.json();
    return Array.isArray(result) && result.length ? result : null;
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
    hours
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
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
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const { result } = await res.json();
    return result || null;
  } catch (err) {
    return null;
  }
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
    ctaBody
  }`);

  const endpoint = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  try {
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const { result } = await res.json();
    return result || null;
  } catch (err) {
    return null;
  }
}
