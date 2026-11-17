/**
 * Notion API Client for PrintHub Africa
 * Zero external dependencies — uses native fetch built into Node.js 18+ and Astro.
 */

export interface NotionProduct {
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

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function fetchProductsFromNotion(): Promise<NotionProduct[] | null> {
  const token = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
  let databaseId = process.env.NOTION_DATABASE_ID || import.meta.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return null;
  }

  // Clean database ID (strip dashes or full URL if pasted)
  databaseId = databaseId.replace(/^.*\/([a-f0-9]{32}).*$/i, "$1").replace(/-/g, "");

  try {
    const results: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const body: any = { page_size: 100 };
      if (startCursor) body.start_cursor = startCursor;

      const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Notion API Warning] Failed to query database (${res.status}): ${errText}`);
        return null;
      }

      const data = await res.json();
      results.push(...(data.results || []));
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    const products: NotionProduct[] = [];

    for (const page of results) {
      const p = page.properties || {};

      // Name (Title property)
      const titleProp = Object.values(p).find((val: any) => val.type === "title") as any;
      const name = titleProp?.title?.[0]?.plain_text?.trim() || "";
      if (!name) continue; // skip blank rows

      // Slug
      const rawSlug = p.Slug?.rich_text?.[0]?.plain_text?.trim();
      const slug = rawSlug || slugify(name);

      // Category
      const cat = p.Category?.select?.name || p.Category?.rich_text?.[0]?.plain_text || "Home & decor";

      // Price
      let price = "KES 0";
      if (p.Price?.type === "number" && p.Price.number != null) {
        price = `KES ${p.Price.number.toLocaleString()}`;
      } else if (p.Price?.rich_text?.[0]?.plain_text) {
        price = p.Price.rich_text[0].plain_text.trim();
      }

      // Note (subtitle)
      const note = p.Note?.rich_text?.[0]?.plain_text?.trim() || "";

      // Material
      const material = p.Material?.rich_text?.[0]?.plain_text?.trim() || p.Material?.select?.name || "PLA";

      // Finish
      const finish = p.Finish?.rich_text?.[0]?.plain_text?.trim() || "Smooth";

      // Occasions / Tags
      let tags: string[] = [];
      if (p.Occasions?.type === "multi_select") {
        tags = p.Occasions.multi_select.map((s: any) => s.name.toLowerCase());
      } else if (p.Occasions?.rich_text?.[0]?.plain_text) {
        tags = p.Occasions.rich_text[0].plain_text.split(",").map((s: string) => s.trim().toLowerCase());
      }

      // Description / Blurb
      const blurb = p.Description?.rich_text?.map((t: any) => t.plain_text).join("") || "";

      // Uses
      let uses: string[] = [];
      if (p.Uses?.type === "multi_select") {
        uses = p.Uses.multi_select.map((s: any) => s.name);
      } else if (p.Uses?.rich_text?.[0]?.plain_text) {
        uses = p.Uses.rich_text[0].plain_text.split(",").map((s: string) => s.trim());
      }

      // Care
      const care = p.Care?.rich_text?.map((t: any) => t.plain_text).join("") || "";

      // Photos from Notion Files & media column
      const photos: string[] = [];
      if (p.Photos?.type === "files") {
        for (const f of p.Photos.files) {
          const url = f.file?.url || f.external?.url;
          if (url) photos.push(url);
        }
      }

      products.push({
        slug,
        name,
        cat,
        price,
        note,
        material,
        finish,
        tags,
        blurb,
        uses,
        care,
        photos: photos.length ? photos : undefined,
      });
    }

    return products.length ? products : null;
  } catch (err) {
    console.error("[Notion Error]", err);
    return null;
  }
}
