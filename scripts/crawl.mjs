#!/usr/bin/env node
/**
 * Crawl audit: checks every built HTML page in dist/ for common SEO/quality issues.
 * - Missing alt on <img>
 * - Missing width or height on <img>
 * - More than one <h1> per page
 * - Heading level skips (e.g. H1 → H3 without H2)
 * - Missing <link rel="canonical">
 *
 * Run: node scripts/crawl.mjs
 * Or:  pnpm run crawl-check
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const DIST = new URL("../dist", import.meta.url).pathname;

function walk(dir) {
  const results = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) results.push(...walk(full));
    else if (name.endsWith(".html")) results.push(full);
  }
  return results;
}

try {
  statSync(DIST);
} catch {
  console.error("dist/ not found — run pnpm build first");
  process.exit(1);
}

const files = walk(DIST);
console.log(`Crawling ${files.length} HTML files…\n`);

let errors = 0;

// Very small inline regex-based parser (no DOM, no deps)
function findAll(html, re) {
  return [...html.matchAll(re)];
}

// Skip pages that are noindex (crawlers skip them, so we're lenient)
const NOINDEX_RE = /content="[^"]*noindex/i;
// Skip admin/api paths
const SKIP_PATH_RE = /\/(admin|api|clean-cache)\//;

for (const file of files) {
  const rel = file.replace(DIST, "");
  if (SKIP_PATH_RE.test(rel)) continue;

  const html = readFileSync(file, "utf8");
  const isNoindex = NOINDEX_RE.test(html);
  const pageErrors = [];

  // 1. Canonical
  if (!/<link rel="canonical"/i.test(html)) {
    pageErrors.push("missing <link rel=canonical>");
  }

  // 2. Images — alt, width, height
  const imgs = findAll(html, /<img\s([^>]+)>/gi);
  for (const [, attrs] of imgs) {
    // Skip inline SVG images and tracking pixels (1x1)
    if (/width="1"/i.test(attrs) && /height="1"/i.test(attrs)) continue;
    if (!/alt=/i.test(attrs) && !/aria-hidden="true"/i.test(attrs)) {
      pageErrors.push(`<img> missing alt: …${attrs.slice(0, 60)}…`);
    }
    if (!/width=/i.test(attrs)) pageErrors.push(`<img> missing width: …${attrs.slice(0, 60)}…`);
    if (!/height=/i.test(attrs)) pageErrors.push(`<img> missing height: …${attrs.slice(0, 60)}…`);
  }

  // 3. H1 count
  const h1s = findAll(html, /<h1[\s>]/gi);
  if (h1s.length === 0) {
    // Pages like 404 may have no H1 — warn only
    if (!isNoindex) pageErrors.push("no <h1> found");
  } else if (h1s.length > 1) {
    pageErrors.push(`${h1s.length} <h1> elements (expected 1)`);
  }

  // 4. Heading order — detect skips
  const headingMatches = findAll(html, /<h([1-6])[\s>]/gi);
  const levels = headingMatches.map(([, n]) => parseInt(n, 10));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      pageErrors.push(
        `heading skip: H${levels[i - 1]} → H${levels[i]} (missing H${levels[i - 1] + 1})`
      );
    }
  }

  // Report
  if (pageErrors.length) {
    const prefix = isNoindex ? "  WARN " : "  FAIL ";
    for (const msg of pageErrors) {
      console[isNoindex ? "warn" : "error"](`${prefix} ${rel}: ${msg}`);
      if (!isNoindex) errors++;
    }
  } else {
    console.log(`  OK    ${rel}`);
  }
}

console.log(`\n${errors === 0 ? "✓ No crawl errors" : `✗ ${errors} error(s) found`}`);
process.exit(errors > 0 ? 1 : 0);
