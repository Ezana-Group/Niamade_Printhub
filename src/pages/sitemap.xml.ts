import type { APIRoute } from "astro";
import { products, site, occasions } from "../data/site";
import { guides } from "../data/guides";

// Static pages (no lastmod — no real date)
const staticPages = [
  "/",
  "/shop/",
  "/for-business/",
  "/custom/",
  "/help/",
  "/about/",
  "/contact/",
  "/bookings/",
  "/terms/",
  "/privacy/",
  "/guides/",
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(
  loc: string,
  lastmod?: string,
  images?: { loc: string; title?: string }[]
): string {
  const imgXml =
    images
      ?.map(
        (img) =>
          `    <image:image>\n      <image:loc>${img.loc}</image:loc>${
            img.title
              ? `\n      <image:title>${esc(img.title)}</image:title>`
              : ""
          }\n    </image:image>`
      )
      .join("\n") ?? "";
  return `  <url>\n    <loc>${loc}</loc>${
    lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
  }${imgXml ? "\n" + imgXml : ""}\n  </url>`;
}

export const GET: APIRoute = () => {
  const entries: string[] = [];

  // Static pages
  for (const path of staticPages) {
    entries.push(urlEntry(`${site.url}${path}`));
  }

  // Occasion pages (only those with matching products)
  for (const o of occasions) {
    const hasProducts = products.some(
      (p) =>
        (p as any).occasions?.includes(o.id) ||
        (p as any).cat === o.id ||
        (p as any).tags?.includes(o.id)
    );
    if (hasProducts) {
      entries.push(urlEntry(`${site.url}/shop/for/${o.slug}/`));
    }
  }

  // Product pages with optional image entries
  for (const p of products) {
    const lastmod = (p as any)._updatedAt
      ? (p as any)._updatedAt.split("T")[0]
      : undefined;
    const photo = (p as any).photo;
    const images = photo
      ? [{ loc: new URL(photo, site.url).href, title: p.name }]
      : undefined;
    entries.push(urlEntry(`${site.url}/shop/${p.slug}/`, lastmod, images));
  }

  // Guide pages
  for (const g of guides) {
    const lastmod = g.updatedAt ? g.updatedAt.split("T")[0] : undefined;
    entries.push(urlEntry(`${site.url}/guides/${g.slug}/`, lastmod));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
