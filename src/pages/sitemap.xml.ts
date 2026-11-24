import type { APIRoute } from "astro";
import { products, site, occasions } from "../data/site";
import { guides } from "../data/guides";
import { services } from "../data/services";

// Master static pages registry with explicit Google SEO priority and crawl frequencies
const staticPages: Array<{
  path: string;
  priority: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";
}> = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services/", priority: "0.9", changefreq: "weekly" },
  { path: "/shop/", priority: "0.9", changefreq: "daily" },
  { path: "/quoteforge/", priority: "0.9", changefreq: "weekly" },
  { path: "/quoteforge/docs/", priority: "0.8", changefreq: "weekly" },
  { path: "/custom/", priority: "0.8", changefreq: "weekly" },
  { path: "/for-business/", priority: "0.8", changefreq: "weekly" },
  { path: "/bookings/", priority: "0.8", changefreq: "weekly" },
  { path: "/guides/", priority: "0.7", changefreq: "weekly" },
  { path: "/about/", priority: "0.6", changefreq: "monthly" },
  { path: "/help/", priority: "0.6", changefreq: "monthly" },
  { path: "/contact/", priority: "0.6", changefreq: "monthly" },
  { path: "/terms/", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy/", priority: "0.3", changefreq: "yearly" },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(
  loc: string,
  lastmod?: string,
  images?: { loc: string; title?: string }[],
  priority: string = "0.7",
  changefreq: string = "weekly"
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

  return `  <url>
    <loc>${loc}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>${
    lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
  }${imgXml ? "\n" + imgXml : ""}
  </url>`;
}

export const GET: APIRoute = () => {
  const entries: string[] = [];
  const today = new Date().toISOString().split("T")[0];

  // 1. Static Core Pages (with today's build stamp)
  for (const page of staticPages) {
    entries.push(
      urlEntry(`${site.url}${page.path}`, today, undefined, page.priority, page.changefreq)
    );
  }

  // 2. Service Landing Pages (High Commercial Priority)
  for (const s of services) {
    entries.push(
      urlEntry(`${site.url}/services/${s.slug}/`, today, undefined, "0.9", "weekly")
    );
  }

  // 3. Occasion Landing Pages (only those with active catalog items)
  for (const o of occasions) {
    const hasProducts = products.some(
      (p) =>
        (p as any).occasions?.includes(o.id) ||
        (p as any).cat === o.id ||
        (p as any).tags?.includes(o.id)
    );
    if (hasProducts) {
      entries.push(
        urlEntry(`${site.url}/shop/for/${o.slug}/`, today, undefined, "0.8", "weekly")
      );
    }
  }

  // 4. Product Pages with Google Image Sitemap metadata
  for (const p of products) {
    const lastmod = (p as any)._updatedAt
      ? (p as any)._updatedAt.split("T")[0]
      : today;
    const photo = (p as any).photo;
    const images = photo
      ? [{ loc: new URL(photo, site.url).href, title: p.name }]
      : undefined;
    entries.push(
      urlEntry(`${site.url}/shop/${p.slug}/`, lastmod, images, "0.8", "weekly")
    );
  }

  // 5. Engineering & Buying Guides
  for (const g of guides) {
    const lastmod = g.updatedAt ? g.updatedAt.split("T")[0] : today;
    entries.push(
      urlEntry(`${site.url}/guides/${g.slug}/`, lastmod, undefined, "0.7", "monthly")
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
