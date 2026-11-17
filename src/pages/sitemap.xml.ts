import type { APIRoute } from "astro";
import { products, site } from "../data/site";

const pages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/shop", priority: "0.9", changefreq: "weekly" },
  { path: "/for-business", priority: "0.9", changefreq: "monthly" },
  { path: "/custom", priority: "0.9", changefreq: "monthly" },
  { path: "/help", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/terms", priority: "0.4", changefreq: "yearly" },
  { path: "/privacy", priority: "0.4", changefreq: "yearly" },
  ...products.map((p) => ({ path: `/shop/${p.slug}`, priority: "0.8", changefreq: "weekly" })),
];

const today = new Date().toISOString().split("T")[0];

export const GET: APIRoute = () => {
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${site.url}${p.path === "/" ? "/" : p.path + "/"}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } }
  );
};
