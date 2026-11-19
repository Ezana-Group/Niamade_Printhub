# PrintHub Africa — Implementation Report

> Parts A · B · C · D of the `antigravity-prompt.md` specification

---

## Build status

**`pnpm run build` → 42 pages built, 0 errors.**
**`pnpm run validate-schema` → All JSON-LD valid (42 pages, 1 schema block each)**
**`pnpm run crawl-check` → No crawl errors (42 pages checked)**

Sanity fetch fails at build time with `ENOTFOUND` — expected in sandboxed environments with no network; the site falls back to local JSON data files gracefully.

---

## Part A — Motion system

### New files
| File | Purpose |
|------|---------|
| `scripts/spring-generator.mjs` | Generates CSS `linear()` easing from real harmonic oscillator step response |
| `src/lib/spring.js` | Pure JS spring physics: `rubberband()`, `project()`, `releaseVelocity()`, `evaluateSpring()` |
| `tests/spring.test.mjs` | 5 unit tests — all pass: `node --test tests/spring.test.mjs` |
| `src/lib/sheet.js` | Full DOM wiring for Apple-grade bottom sheet (mobile) + spatial dialog (desktop) |

### Modified files
| File | Changes |
|------|---------|
| `src/styles/global.css` | Spring tokens, scroll-driven animations, `prefers-reduced-motion` suppression, press/lift/hover, hero depth, reading progress bar, pinned How-it-works, word brightening |
| `src/components/CheckoutModal.astro` | Grab handle, Paystack key via `data-` attr, imports `initCheckoutSheet`, focus restore |
| `src/components/ProductArt.astro` | Added `reveal` and `delay` props |
| `src/pages/index.astro` | H1 → `rise-lcp`, hero column depth classes, occasion card links → slug URLs, float badge → `motion-safe:animate-float` |
| `src/layouts/Layout.astro` | `lang="en-KE"`, font preloads, single merged `@graph` JSON-LD, Bing verification meta, description clipping |

---

## Part B — Technical SEO & AI-discoverability

### New files
| File | Purpose |
|------|---------|
| `src/lib/schema.ts` | Shared schema library with `buildSchemaGraph()`, `productSchemaNode()`, `breadcrumbNode()` |
| `src/pages/shop/for/[slug].astro` | 7 occasion landing pages |
| `src/pages/llms.txt.ts` | Generates `/llms.txt` — business summary, all pages, products, FAQs |
| `src/pages/sitemap.xml.ts` | Rebuilt with occasion/guide pages, image entries, real `lastmod` |
| `public/robots.txt` | AI search bots, training crawlers allowed by default |
| `public/_headers` | Security headers, immutable cache for `/_astro/*` |
| `public/b7e3f2a1d4c8e5f9b2a7d3c6e1f8a4b9.txt` | IndexNow key file |
| `scripts/indexnow.mjs` | Post-deploy URL submission to IndexNow |

---

## Part C — Content, internal linking, image hygiene

### New files
| File | Purpose |
|------|---------|
| `src/data/guides.ts` | 3 engineering guides (PLA/PETG/TPU, file prep, measuring broken parts) |
| `src/pages/guides/index.astro` | Guides listing |
| `src/pages/guides/[slug].astro` | Article pages with Article + BreadcrumbList schema |

### Modified
- `src/components/Footer.astro` — occasion links → slug URLs; Guides nav link added
- `src/data/art.ts` — SVG text `<text>` → `<path>` outlines on name-keychain

---

## Part D — Off-site plan

- `docs/SEO-PLAYBOOK.md` — created ✅

---

## Security cleanup

| Action | Detail |
|--------|--------|
| Hard-coded Sanity token removed | `src/lib/sanity.ts:95` — now `""` fallback |
| `functions/api/cms-token.js` deleted | Nothing referenced it |
| CSV backups moved | `public/printhub-products-*.csv` → `backups/` |

---

## Verification scripts

```bash
pnpm run validate-schema  # JSON-LD: 1 block per page, valid JSON, no duplicate @id
pnpm run crawl-check      # img alt/width/height, 1×H1, no heading skips, canonical
pnpm run indexnow         # Submit sitemap URLs to IndexNow after deploy
```

---

## "Needs the owner" checklist

| # | Item | Action |
|---|------|--------|
| 1 | **Rotate Sanity API token** | Old token was in git history. Generate new in manage.sanity.io → set as `SANITY_API_TOKEN` in Cloudflare Pages env vars. |
| 2 | **Bing Webmaster Tools** | Verify site → paste verification code as `BING_SITE_VERIFICATION` env var in Cloudflare Pages. |
| 3 | **Fix TikTok handle** | Code has `@printhub_africa`; live account may be `@printhub.africa`. Confirm and update `src/data/site.ts`. |
| 4 | **GTM + gtag double-loading** | Layout loads both. If GTM fires GA4 config tag already, remove the direct `gtag('config',...)` call to avoid double-counting. |
| 5 | **Run `pnpm run indexnow`** | After each deploy on a machine with internet access. |
| 6 | **Submit sitemap to Google Search Console** | search.google.com/search-console → Sitemaps → `https://printhub.africa/sitemap.xml` |
| 7 | **Submit sitemap to Bing Webmaster Tools** | After Bing verification. |
| 8 | **Verify IndexNow key** | Visit `https://printhub.africa/b7e3f2a1d4c8e5f9b2a7d3c6e1f8a4b9.txt` after deploy — should return the key. |

---

*Generated: 2026-11-19 · PrintHub Africa — Eldoret, Kenya*
