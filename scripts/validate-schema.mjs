#!/usr/bin/env node
/**
 * Validates JSON-LD in every built HTML file.
 * - Exactly ONE <script type="application/ld+json"> per page
 * - JSON must parse successfully
 * - No duplicate @id values across the graph
 *
 * Run: node scripts/validate-schema.mjs
 * Or:  pnpm run validate-schema
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

let errors = 0;

try {
  statSync(DIST);
} catch {
  console.error("dist/ not found — run pnpm build first");
  process.exit(1);
}

const files = walk(DIST);
console.log(`Checking ${files.length} HTML files for JSON-LD…\n`);

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const matches = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const rel = file.replace(DIST, "");

  if (matches.length === 0) {
    // Pages like 404 may legitimately have no schema — warn, don't fail
    console.warn(`  WARN  ${rel}: no JSON-LD found`);
    continue;
  }

  if (matches.length > 1) {
    console.error(`  FAIL  ${rel}: ${matches.length} JSON-LD blocks found (expected 1)`);
    errors++;
    continue;
  }

  let parsed;
  try {
    parsed = JSON.parse(matches[0][1]);
  } catch (e) {
    console.error(`  FAIL  ${rel}: JSON parse error — ${e.message}`);
    errors++;
    continue;
  }

  // Collect all @id values in the graph
  const ids = [];
  const graph = parsed["@graph"] ?? [parsed];
  for (const node of graph) {
    if (node["@id"]) ids.push(node["@id"]);
  }

  const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dups.length) {
    console.error(`  FAIL  ${rel}: duplicate @id(s): ${dups.join(", ")}`);
    errors++;
    continue;
  }

  console.log(`  OK    ${rel} (${graph.length} node${graph.length !== 1 ? "s" : ""})`);
}

console.log(`\n${errors === 0 ? "✓ All JSON-LD valid" : `✗ ${errors} error(s) found`}`);
process.exit(errors > 0 ? 1 : 0);
