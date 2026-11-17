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

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID || "m7x6icn3";
const SANITY_DATASET = process.env.SANITY_DATASET || import.meta.env.SANITY_DATASET || "production";
const SANITY_API_VERSION = "2023-08-01";

/**
 * Converts Sanity image asset references to fast global CDN URLs.
 * Example ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg"
 * CDN URL: "https://cdn.sanity.io/images/m7x6icn3/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg"
 */
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
      // Optional Sanity API read token if dataset is private
      ...(process.env.SANITY_API_TOKEN ? { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } : {}),
    });

    if (!res.ok) {
      console.warn(`[Sanity Warning] Query returned status ${res.status}`);
      return null;
    }

    const { result } = await res.json();
    if (!result || !Array.isArray(result) || result.length === 0) {
      return null;
    }

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
