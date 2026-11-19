#!/usr/bin/env node
/**
 * Submit updated URLs to IndexNow (Bing / Yandex).
 * Run after every deploy: node scripts/indexnow.mjs
 * Requires: dist/sitemap.xml (run pnpm build first)
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const KEY = "b7e3f2a1d4c8e5f9b2a7d3c6e1f8a4b9";
const HOST = "printhub.africa";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read the built sitemap
let sitemapXml;
try {
  sitemapXml = readFileSync(join(root, "dist", "sitemap.xml"), "utf8");
} catch {
  console.error("dist/sitemap.xml not found — run pnpm build first");
  process.exit(1);
}

// Extract all <loc> URLs
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Found ${urls.length} URLs in sitemap`);

// IndexNow allows max 10,000 URLs per request; chunk to 500 to be safe
const CHUNK = 500;
for (let i = 0; i < urls.length; i += CHUNK) {
  const chunk = urls.slice(i, i + CHUNK);
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: chunk,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  console.log(`Batch ${Math.floor(i / CHUNK) + 1}: HTTP ${res.status}`);
  if (!res.ok) {
    const text = await res.text();
    console.error("Error body:", text);
  }
}
console.log("Done.");
