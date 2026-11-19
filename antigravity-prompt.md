# Task: Apple-grade motion + full SEO / AI-search implementation for printhub.africa

You are working in an existing **Astro 4 + Tailwind** static site (PrintHub Africa, a made-to-order 3D printing studio in Eldoret, Kenya). It deploys to **Cloudflare Pages** (`public/_headers`), content comes from **Sanity** with a local fallback in `src/data/site.ts` and `src/content/`.

Do four things, in this order:

1. Build a cohesive motion system across every page, following Apple's design principles (Part A), including Apple-style **scroll-driven sections** (A7).
2. Implement the technical SEO and AI-discoverability work (Part B).
3. Add helpful content, internal linking and image/heading hygiene (Part C).
4. Produce the off-site, local, review and measurement plan as a checklist for the owner (Part D). This part is mostly not code: write it as `docs/SEO-PLAYBOOK.md` and do not fabricate anything.

Work in small commits. Run `astro build` after each part and fix every error before moving on. Before changing anything, check whether a requirement below is already implemented; if it is, verify it and move on rather than duplicating it.

## Ground rules

- Animate only `transform`, `opacity`, `filter` and `clip-path`. Never animate layout properties (width, height, top, left, margin).
- Keep the site fast. Do not add an animation library unless a feature below cannot be done without one. Prefer CSS and the Web Animations API. Any JS must be small, bundled by Astro, and fail safe: if it does not load, the page still works.
- All content must remain in the static HTML. Do not hide content behind JS. Reveal animations may start content at `opacity: 0` only when the `.js` class is present, and must have a failsafe that shows everything after about 2.5s.
- Never animate the H1, hero subhead or primary CTAs in from `opacity: 0` (it delays LCP). A small `translateY` is fine.
- Never hard-code secrets. API tokens come from environment variables only.
- Do not invent business facts (lead times, prices, addresses, reviews, ratings). If something needs real data, leave a clearly marked TODO and list it in your final report.
- Match the existing visual language (warm cream/sand palette, rounded cards, Fraunces + Figtree). Motion should feel like part of the brand, not a layer on top.

---

# Part A: Motion system (Apple design principles)

## A1. Principles to apply (and what they mean in code)

1. **Response.** Feedback on pointer-down, not on release. Press states appear in about 80ms. Remove any artificial delays on the input path.
2. **Direct manipulation.** When something is dragged it tracks the pointer 1:1 and respects the grab offset. Use Pointer Events with `setPointerCapture`.
3. **Interruptibility.** Nothing locks input during a transition. A user can grab or reverse an element mid-animation. Re-target from the current value and current velocity, never from the logical end value.
4. **Behaviour over animation.** Use springs, not fixed-duration scripts, for anything the user touches. Define springs by **damping ratio + response**, not duration.
5. **Velocity handoff and momentum projection.** On release, hand the gesture's velocity to the spring and choose the destination from where the flick is going: `projected = current + (v / 1000) * 0.998 / (1 - 0.998)`.
6. **Rubber-banding.** At edges, resist progressively instead of hard-stopping: `rubberband(o, d, c = 0.55) = (o * d * c) / (d + c * |o|)`.
7. **Spatial consistency.** Things leave along the path they arrived on and grow from the element that triggered them (`transform-origin` at the trigger).
8. **Materials.** Translucent chrome uses `backdrop-filter` blur plus saturation and a bright top edge. Never stack one light translucent surface on another. Surfaces "materialize": scale, blur and opacity animate together.
9. **Restraint.** Every animation must earn its place. Decorative loops are capped at a few cycles. No full-viewport moving backgrounds.
10. **Typography.** Tracking and leading change with size: tighter for large headings, near 0 for body. Use `font-optical-sizing: auto`.

## A2. Spring tokens

Define these once as CSS custom properties on `:root` in `src/styles/global.css`, using CSS `linear()` easing generated from the real spring equations, with a `cubic-bezier(0.23, 1, 0.32, 1)` fallback inside `@supports not (transition-timing-function: linear(0, 1))`.

| Token | Damping | Response | Use |
|---|---|---|---|
| `--spring-smooth` | 1.0 | 0.40 s | default UI: hover lift, cards, menus, reveals |
| `--spring-snappy` | 1.0 | 0.28 s | buttons, chips, toggles, press release |
| `--spring-bounce` | 0.8 | 0.30 s | only when the gesture carried momentum (flick, drag release, hero tilt settling) |

Also define a matching `--spring-*-d` duration variable (the settle time, about 540 / 380 / 380 ms) and a shared `--t-colors` list for colour transitions. Generate the `linear()` points with a small script (about 48 points, critically damped: `1 - e^(-wt)(1 + wt)`; under-damped: standard damped-oscillator step response) and commit the generator under `scripts/` so the values can be regenerated.

Default to damping 1.0. Use bounce only where momentum exists.

## A3. Components and behaviours to build

Apply across **all** pages (home, shop, product, occasion pages, custom, for-business, help, about, contact, terms, privacy, 404, order-confirmed).

1. **Press feedback.** `.btn`, `.chip`, `.press` cards: `:active { transform: scale(0.97) }` (cards 0.985) with an 80ms transition, releasing on `--spring-snappy`.
2. **Hover and lift.** Cards lift on `--spring-smooth`. Hover effects must only apply under `@media (hover: hover)`.
3. **Scroll reveals.** One shared IntersectionObserver. Items fade and rise 16px on `--spring-smooth` (read the easing and duration from the CSS variables so there is one source of truth). Stagger by 50ms, capped at 5 steps. Use the Web Animations API.
4. **"Printed" product art reveal.** When a product illustration enters view, it builds from the bottom up like a 3D print (`clip-path: inset(100% 0 0 0)` to `inset(0)`, about 900ms, `--ease-out`). Also run it on hero art with the hero's entrance delay.
5. **Hero entrance.** Decorative elements fade and rise. H1, subhead and CTAs use a transform-only entrance (no opacity change).
6. **Hero cards.** Tilted cards settle flat on `--spring-bounce` on hover or touch.
7. **Mobile menu.** Materializes from its button (`transform-origin: top right`): `scale(0.96) translateY(-8px) blur(6px)` to rest. Open on `--spring-smooth`, close in about 140ms. The icon morphs (hamburger to cross) on `--spring-snappy`.
8. **FAQ accordions (`<details>`).** The plus icon rotates on `--spring-snappy`. Content height animation is optional; if added, use `interpolate-size` or `grid-template-rows` and never animate `height` in px.
9. **Checkout sheet (`CheckoutModal.astro`).**
   - Mobile (under 640px): bottom sheet, draggable by its header, with a visible grab handle.
   - 1:1 finger tracking with a 10px direction hysteresis; ignore horizontal drags.
   - Rubber-band when dragged upward past the top.
   - On release, compute velocity from the last 100ms of samples, project the resting point with the 0.998 decay formula, and close if it lands past 50% of the sheet height.
   - Spring to the destination with the release velocity (damping 0.8 when returning open, 1.0 when closing).
   - Interruptible: grabbing the sheet mid-animation stops the spring and continues from the live value. Re-opening during a close re-targets from the current position.
   - Scrim opacity is tied to sheet position 1:1.
   - Desktop: the dialog materializes from the button that opened it (origin computed from the trigger's rect) and exits back the same way.
   - Restore focus to the trigger on close. Escape and scrim-click still close it.
   - Keep the sheet logic in two small modules (`src/lib/spring.js` for pure maths, `src/lib/sheet.js` for the DOM wiring) so the maths can be unit-tested in Node.
10. **Page transitions.** Cross-document View Transitions: `@view-transition { navigation: auto }`, a 160ms fade out and 260ms fade in on `root`, and `view-transition-name` on the sticky header so it stays put. Progressive enhancement only.
11. **Header material.** `backdrop-filter: blur(20px) saturate(160%)`, a subtle bright top edge, and a scroll-edge fade instead of a hard 1px divider where practical.
12. **Loops.** Floating badge, pulsing "open" dot and shimmer: cap iteration counts (about 3, 5 and 2). No infinite animations.
13. **Do not break** existing behaviour: Paystack flow, WhatsApp links, shop filtering and sorting, open/closed badge.

## A4. Accessibility and preferences (non-negotiable)

- `prefers-reduced-motion: reduce`: disable every transform-based entrance, spring, float, shimmer, draw, tilt, clip-path reveal and view transition. Keep short (about 120 to 200ms) opacity or colour changes that aid comprehension. The sheet appears and disappears with a 120 to 150ms cross-fade and no travel. Spinners slow down rather than disappear.
- Audit every `animate-*`, `transition-*`, `duration-*` and `group-hover:scale-*` class in the Astro files and make sure each one is covered by a `motion-reduce:` variant or the global reduced-motion block. Do not assume the existing block covers them; check class names against what is actually used.
- `prefers-reduced-transparency: reduce`: replace blur and translucency with solid surfaces.
- `prefers-contrast: more`: near-solid backgrounds and defined borders.
- Keyboard: everything reachable and operable; visible focus states; sheet focus handling as above.
- Never trap the user: every overlay closes with Escape, scrim click and a visible close button.

## A5. Typography

- Headings: `h1` tracking about -0.025em, `h2` -0.02em, `h3` -0.01em; leading 1.05 to 1.2 for large sizes, 1.5 to 1.65 for body. Small caps and eyebrow labels get positive tracking (about 0.12em).
- Preload only the two font files used above the fold; keep `font-display: swap`.

## A6. Motion acceptance criteria

- No layout shift (CLS) introduced; Lighthouse performance on the home page does not drop versus the baseline you measure first.
- Home hero H1 is visible at first paint (no opacity 0 start).
- With reduced motion enabled in OS settings, nothing moves except short fades.
- Sheet: can be grabbed mid-open and mid-close, flicked closed from any position, and rubber-bands at the top. Test on a real touch device or Chrome device emulation with touch.
- Unit tests (Node) for `project`, `rubberband`, `releaseVelocity` and the spring integrator (critically damped peak equals target, damping 0.8 overshoot about 1.5% or less).

## A7. Scroll-driven sections (how apple.com moves through divs and sections)

Apple's pages do not animate "when an element appears". They tie motion to **scroll position**: a section pins, content inside it changes as you scroll, text brightens as it passes, media scales into place, layers drift at different speeds. Build the same vocabulary with **CSS scroll-driven animations** (`animation-timeline: scroll()` / `view()` / named `view-timeline`), no scroll listeners and no animation library.

Rules:

- Everything lives inside `@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) { … } }`. Unsupported browsers (Firefox today, older Safari) and reduced-motion users must get the normal, fully visible, static layout. Nothing may be hidden by default.
- Use the individual properties `translate` and `scale` (not `transform`) so scroll effects never fight existing `transform` utilities such as `-rotate-2`.
- Declare `animation-timeline` **after** the `animation` shorthand (the shorthand resets it).
- `position: sticky` breaks if any ancestor has `overflow: hidden/auto`. Use `overflow: clip` if clipping is needed. Check ancestors.
- Pinned sections only at `min-width: 768px`; on phones use a non-pinned version scrubbed by the element's own `view()` position.
- Do not animate the H1/hero text in from opacity 0. Never put essential content only inside a scroll-revealed state.

Patterns to implement on the home page (and reuse on other pages where they fit):

1. **Header settles on scroll.** `header.sticky > div:first-child` (the first child only, not the mobile menu panel): `scroll(root)`, range `0 120px`, `scale: 0.985` and a deeper shadow.
2. **Hero depth.** Two columns of hero art drift at different speeds (about -30px and +26px) over `scroll(root)` range `0 90vh`.
3. **Statement section (scroll-scrubbed words).** Full-bleed dark (`bg-ink text-cream`) section with one large sentence split into words server-side (`<span class="sd-word" style="--i:N">`, **`display: inline-block`**, with the space as a text node *outside* the span). Each word's own `view()` timeline brightens it from 0.2 to 1 opacity, range `cover calc(12% + var(--i) * 0.5%)` to `cover calc(36% + var(--i) * 0.5%)`. Result: lines brighten as they climb the screen, left to right. (Inline, non-inline-block spans do not get per-element progress; verify.)
4. **Pinned "How it works" story (the signature piece).**
   - Dark section, height `320vh` at 768px and up, containing a `position: sticky; top: 0; height: 100svh` stage.
   - Left: the three steps. Right: a product illustration that **prints bottom-up as you scroll** (`clip-path: inset(100% 0 0 0)` to `inset(0)`), with a live "Printing N%" counter driven by an `@property --pct { syntax: "<integer>"; inherits: true }` animated on a named `view-timeline: --how block` and rendered with `counter-reset` + `content: counter(pct)`.
   - The pinned window is roughly `cover 24%` to `cover 76%` of the section's timeline (for a 320vh section in a 100vh viewport). The print runs `cover 26%` to `cover 68%`.
   - Step highlighting is a **crossfade**: each step has a window of about 21% starting at `24% + k * 17.3%`, with 17% fades, so one step fades out exactly as the next fades in (no moment with nothing highlighted). First step starts bright; last step stays bright.
   - Static fallback: ordinary two-column section, all steps fully visible, art complete, counter hidden.
5. **Panels scale into place.** Large rounded panels (`.sd-scale`): `scale 0.93 → 1`, `opacity 0.35 → 1`, `view()` range `entry 0% entry 75%`.
6. **Parallax layers.** `.sd-par` with `--y` custom property: `translate` from `+--y` to `-(--y)` over `view()` range `cover`; give sibling images opposite signs for depth.
7. **Reading progress bar** on long pages (guides): fixed 3px bar, `scale: 0 1 → 1 1`, `scroll(root)`.
8. Consider (optional, if time): a horizontally snapping product row on mobile with cards scaling by `view(inline)`; a colour shift between sections via `view()`-driven `background-color`.

Verification for A7 (required): drive a real Chromium (for example `puppeteer-core` with `@sparticuz/chromium`) against the built site and **sample computed styles at several scroll offsets**: the pinned stage's `getBoundingClientRect().top` stays 0 through the pin; `clip-path` progresses monotonically; exactly one step is at opacity 1 at every sample; word opacities increase with scroll; with `prefers-reduced-motion: reduce` emulated everything is static and fully visible; at 390px width there is no horizontal scroll and no pin; Firefox/unsupported path is the plain layout. Take screenshots at start, mid and end of the pin and look at them.

---

# Part B: SEO and AI-search implementation

Target: Google, Bing (and therefore DuckDuckGo, Yahoo, Ecosia), Yandex, Apple, Brave, and AI answer engines (ChatGPT search, Claude, Perplexity, Gemini, Copilot).

## B1. Structured data

1. Create `src/lib/schema.ts` exporting stable IDs (`/#website`, `/#business`, `/#niamade-hub`) plus `websiteNode`, `businessNode` and a `graph()` helper.
2. `Layout.astro` emits **one** `<script type="application/ld+json">` containing `@graph: [WebSite, LocalBusiness, ...pageNodes]`. Strip per-node `@context`. Pages pass only their own nodes (WebPage, AboutPage, ContactPage, Service, FAQPage, CollectionPage, Product, BreadcrumbList) and reference the business by `{ "@id": ids.business }`. Remove every inline duplicate LocalBusiness/Organization block.
3. `LocalBusiness`: name, legalName, alternateName, url, telephone, email, logo, image, address (locality, region, country; no street address unless the business provides one), `openingHoursSpecification` generated from the site's hours data, `areaServed` (Kenya, Uasin Gishu County), `parentOrganization` (Niamade Hub), `sameAs` (real social and Google Business Profile URLs), `currenciesAccepted: "KES"`, `paymentAccepted: ["M-Pesa", "Cash"]`, and a `priceRange` **derived from the catalogue** (min to max), not hard-coded.
4. `Product`: `@id`, name, sku (slug), url, description (HTML stripped), category, material, image (array), brand, manufacturer (`@id`), and `offers` with `priceCurrency: "KES"`, `price` (or `AggregateOffer` with `lowPrice` and `offerCount` when the price is "From"), `priceValidUntil` (one year ahead at build time), availability, itemCondition, url, seller (`@id`), `shippingDetails` (destination KE) and `hasMerchantReturnPolicy`. The return policy must reflect `/terms/` (bespoke made-to-order items are not returnable for change of mind: `MerchantReturnNotPermitted`). Do **not** add `aggregateRating` or `review` unless real, visible reviews exist on the page.
5. `BreadcrumbList` on products and occasion pages, with the occasion as the middle level.
6. Validate output with a script that parses every built HTML file's JSON-LD (must parse, exactly one block per page, no duplicate `@id`s) and fails the build on error.

## B2. Indexable occasion landing pages

The shop currently filters by `/shop/?for=…` (client-side, canonical to `/shop/`), so intent searches have no page to rank.

- Add `slug`, `title`, `h1` and `desc` to each entry in `occasions` (`src/data/site.ts`):

| id | slug |
|---|---|
| gift | `birthday-gifts` |
| events | `wedding-event-favours` |
| business | `corporate-branding` |
| kenya | `kenya-souvenirs` |
| home | `home-office-decor` |
| learn | `school-learning-models` |
| parts | `prototypes-and-parts` |

- Create `src/pages/shop/for/[slug].astro` (static paths from `occasions`): breadcrumb, H1, short intro, product grid for that occasion, "how ordering works" steps, WhatsApp CTA, links to the other occasion pages, plus `CollectionPage` + `ItemList` + `BreadcrumbList` schema. If an occasion has zero products, render `robots: noindex, follow` and exclude it from the sitemap.
- Copy must be original, specific and honest; use only facts already on the site (made to order in Eldoret, M-Pesa, courier across Kenya, PLA/PETG/TPU). No keyword stuffing, no doorway-style city pages.
- Repoint every internal link that used `?for=` (home occasion cards, footer, for-business page, product breadcrumb) to `/shop/for/<slug>/`. Keep `/shop/?for=` working for existing users, with its canonical staying `/shop/`.
- Each page has a unique title (about 60 characters including the brand) and description (about 150 to 158 characters).

## B3. Meta and head

- `Layout.astro`: `<html lang="en-KE">`; clip every description to about 158 characters at a word boundary after stripping HTML (CMS blurbs can contain tags); self-referencing canonical with consistent trailing slash; Open Graph and Twitter tags using the same clipped description; per-product `og:image` (never a shared default if a product image exists).
- Add `<meta name="msvalidate.01">` driven by env var `BING_SITE_VERIFICATION` (render only when set). Keep the existing Google verification tag.
- Titles: keep unique per page; add intent words where natural (for example "3D Printed … in Kenya") without exceeding about 60 characters.
- `noindex, follow` on: 404, order-confirmed, clean-cache, any empty occasion page.

## B4. Sitemap

- `src/pages/sitemap.xml.ts`: include home, shop, all static pages, all indexable occasion pages and all products.
- Emit `<lastmod>` **only** from real data (add `_updatedAt` to the Sanity GROQ query and an `updatedAt` field to the product type). For pages with no real date, omit `<lastmod>`. Never stamp the build date on everything. Drop `changefreq` and `priority`.
- Once real product photos exist, add image entries (`image:image`) to the sitemap.

## B5. robots.txt, headers, crawl hygiene

`public/robots.txt`:

- `User-agent: *` allows `/`; disallow `/admin/`, `/api/`, `/clean-cache/`.
- Name AI **search and retrieval** bots explicitly with their own groups (repeat the Disallow lines, because a named group ignores `*`): `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Applebot`, `Bingbot`.
- Training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`): allowed by default; include a comment explaining how to opt out.
- `Sitemap: https://printhub.africa/sitemap.xml`.

`public/_headers`:

- `X-Robots-Tag: noindex, nofollow` on `/admin*`, `/api/*`, `/clean-cache/`.
- `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*`.
- On `/*`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

Also:

- Remove unreferenced server functions that expose tokens (for example `functions/api/cms-token.js`) after confirming nothing references them.
- Move catalogue CSV backups out of `public/` so they are not publicly downloadable.
- Remove any hard-coded API token from source (for example `src/lib/sanity.ts`); read `SANITY_API_TOKEN` from env only. Note in the final report that the old token must be rotated.

## B6. AI availability

- `src/pages/llms.txt.ts` generates `/llms.txt` from the same data as the site: one-paragraph summary, key facts (location, hours, contact, payment, delivery, materials, custom-file formats), main pages, occasion pages, every product with its page URL and price, top FAQs, policies. Plain text, no HTML. Treat it as a convenience, not a ranking lever.
- Make pages answerable: where the site already states concrete facts (hours, M-Pesa, delivery, materials, accepted file formats), keep them in short prose or FAQ form near the top of the relevant page, not only in images or JS. Add a TODO list (do not invent) for facts that are missing and would help answer engines: typical lead times, maximum print size, delivery cost and time per town, minimum order.
- Illustration text inside SVG art (`<text>` elements) is read by crawlers as page content. Convert any such text to outlines (for example with `fontTools` from the bundled Fraunces file) or remove it.
- Keep all content server-rendered in static HTML (already true). Do not move product or FAQ content behind client-side rendering.

## B7. IndexNow and webmaster tooling

- Generate a random 32-character key, add `public/<key>.txt` containing the key, and add `scripts/indexnow.mjs` that reads `dist/sitemap.xml` and POSTs the URL list to `https://api.indexnow.org/indexnow` (host, key, keyLocation, urlList). Add `"indexnow": "node scripts/indexnow.mjs"` to `package.json`. (Google ignores IndexNow; it serves Bing, Yandex, Naver and Seznam.)
- Do not touch the Google Tag Manager or gtag setup beyond flagging it (see report).

## B8. Performance items that affect ranking

- Hero: no opacity-from-zero on the LCP text; preload the two critical font files.
- Images: explicit `width`/`height`, `loading="lazy"` below the fold, `fetchpriority="high"` only on the LCP image if there is one, modern formats (WebP/AVIF) for photos.
- Heavy blur on low-end phones: limit `backdrop-filter` to the header and open overlays.

---

## B9. Security and crawl-trust headers

- Add `Strict-Transport-Security: max-age=31536000` (no `includeSubDomains` unless every subdomain is confirmed HTTPS).
- Do **not** ship a blocking `Content-Security-Policy` untested: the site loads GTM/GA, Paystack, Sanity CDN and Google Fonts and a wrong CSP breaks checkout. If you add one, ship `Content-Security-Policy-Report-Only` first and list the violations for the owner.
- Host canonicalisation (www to apex, http to https) cannot be done in `_redirects` (path-only); list it in the owner checklist as a Cloudflare Redirect Rule.

---

# Part C: Content, internal linking and hygiene

## C1. Guides (informational search intent)

Informational queries ("PLA vs PETG", "how to prepare an STL") are where most people first meet a 3D printing business, and they are the content answer engines quote.

- Create `src/data/guides.ts` and routes `/guides/` and `/guides/<slug>/` with at least these three guides: **PLA vs PETG vs TPU** (which material, heat, outdoor use in Kenya), **How to prepare a 3D file for printing** (STEP vs STL vs 3MF, solid model, wall thickness, fit tolerances, orientation), **How to measure a broken part for a replacement** (photos, calipers, load direction).
- Use only general, correct engineering knowledge and clearly typical figures ("roughly", "as a rough guide"). Never state PrintHub-specific capabilities (lead times, max size, tolerances achieved) that are not already on the site. The owner is an engineer and will review.
- Each guide page: one H1, logical H2s, visible "Updated" date in a `<time>` element, `Article` + `BreadcrumbList` schema (author and publisher by `@id` of the business), a WhatsApp CTA, links to related guides and to `/custom/`.
- Link guides from the footer, from every occasion page ("Helpful guides" row) and from `llms.txt` and the sitemap (with the real `updated` date as `lastmod`).
- Add the reading progress bar (A7.7) to guide pages.
- Backlog to propose (do not write without owner input): customer case studies with photos, "3D printed corporate gifts in Kenya", "how pricing works", a materials-and-finishes page, Swahili versions of the top pages.

## C2. Image SEO

- Every `<img>`: meaningful `alt` (describes the object, not "image of"), explicit `width`/`height`, `decoding="async"`; `loading="lazy"` below the fold; the product page's main image gets `fetchpriority="high"`; the header logo is eager.
- Descriptive, hyphenated file names for new photos (`name-keychain-purple-eldoret.webp`).
- Serve WebP/AVIF for photos via Astro's `<Image>`; keep PNG/SVG only for logos and illustrations.
- Decorative illustrations stay `aria-hidden`; real photos need alt text. Add an image sitemap once real photos exist.

## C3. Headings and internal links

- One H1 per page; no skipped levels (for example do not jump H1 to H3 because a card component renders an H3: add a visually hidden `<h2 class="sr-only">` before the grid).
- Every indexable page must be reachable from at least two other pages with descriptive anchor text (no "click here"). Report any orphan that is meant to be indexed.
- Add contextual links: product pages to their occasion page and to the relevant guide; guides to products and `/custom/`; `/custom/` to the file-prep and broken-part guides; `/for-business/` to the corporate-branding occasion page.
- Write a script that crawls the built `dist/` and fails on: broken internal links, missing alt, missing width/height, heading skips, missing canonical, more than one H1.

---

# Part D: Off-site, local and measurement plan (write to `docs/SEO-PLAYBOOK.md`; mostly not code)

For a local made-to-order business in Eldoret these usually matter as much as on-page work. Produce a concrete, prioritised checklist with owner actions, and implement only the code parts. Do not fabricate reviews, addresses, awards, press or backlinks.

1. **Google Business Profile.** Primary category (for example "3D printing service"), secondary categories, service area (Eldoret, Uasin Gishu, delivery across Kenya), hours matching the site exactly, WhatsApp/phone/website, products with photos, at least 10 real photos of finished work and the workshop, weekly posts, Q&A seeded with real questions. Replace the `google.com/search?…` link in `site.googleBusinessProfile` with the real Maps place URL and use it in `sameAs`.
2. **NAP consistency.** The same business name ("PrintHub Africa"), phone and email everywhere: site, GBP, Facebook, Instagram, TikTok, WhatsApp Business, directories. Fix the TikTok handle mismatch (`@printhub_africa` vs `@printhub.africa`).
3. **Citations and directories (Kenya).** Claim and complete listings on Bing Places, Apple Business Connect, Facebook Page, LinkedIn Company Page, and relevant Kenyan business directories. Keep the list in the playbook with status columns.
4. **Reviews.** A simple process to request reviews on GBP after each delivered order (WhatsApp message template with the review link). Show real reviews on the site only when genuine and visible; only then add `AggregateRating`/`Review` schema.
5. **Real photography and proof of work.** Photograph finished pieces on a plain background and in use; add a portfolio/case-study section; this also fixes the largest on-page gap (the current product PNGs are rendered illustrations).
6. **Backlinks and partnerships (earned, not bought).** Local schools and STEM clubs, makerspaces and universities, wedding planners and event venues, corporate clients (logo signs), architecture and design studios (scale models), Kenyan maker/tech communities, local press and podcasts. Offer guides and demos as the reason to link. List 20 realistic targets with the angle for each.
7. **Entity and brand consistency for AI engines.** Same description and facts across the site, `llms.txt`, GBP, LinkedIn and social bios; consider a Wikidata/Crunchbase entry only if notability criteria are honestly met.
8. **Language.** Evaluate Swahili: Swahili search terms for the main services, and whether to add `sw-KE` versions with `hreflang` for the top pages. Do not machine-translate; propose and let the owner decide.
9. **Shopping surfaces.** Check Google Merchant Center eligibility for Kenya; if eligible, build a free-listings feed from the catalogue (the CSV backups are a starting point) and match it to on-page prices.
10. **Measurement.** Verify the site in Google Search Console and Bing Webmaster Tools; submit the sitemap; connect GA4; define conversions (WhatsApp click, quote form, checkout started, order confirmed); resolve the GTM + direct gtag double-loading (use GTM Preview to confirm no event fires twice, then keep one path). Track: impressions/clicks for the occasion and guide pages, Core Web Vitals (field data in Search Console), Google Business Profile calls and direction requests, and AI referrals (look for `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`, `claude.ai` in referrers). Add a monthly 15-minute review checklist.
11. **90-day plan.** Week 1 to 2: Search Console/Bing, GBP, citations, fix handles. Week 3 to 6: photography, reviews process, publish guides, case studies. Week 7 to 12: outreach for backlinks, Swahili pilot, Merchant Center, review rankings and iterate.

---

# Verification before you finish

1. `astro build` succeeds.
2. A script confirms, for every built page: exactly one H1; exactly one JSON-LD block that parses; meta description at most about 160 characters; canonical present; `lang="en-KE"`.
3. `dist/sitemap.xml` lists every indexable URL and contains no `noindex` pages and no fake `lastmod` values.
4. `dist/robots.txt`, `dist/llms.txt` and the IndexNow key file exist.
5. grep the repo for leftover secrets and for `?for=` links.
6. Unit tests for the spring and gesture maths pass.
7. Manually test (or emulate): reduced-motion on, touch drag on the checkout sheet, view transition between two pages, keyboard-only checkout open and close.
8. Run the A7 headless-Chromium scroll sampling and attach the numbers and screenshots to the report.
9. Run the C3 crawl script (broken links, alt, dimensions, heading order, one H1, canonical).

# Final report (required)

Return a short report that lists: what you changed per file; anything you skipped and why; the measured before and after Lighthouse scores (Performance, SEO, Accessibility, Best Practices) for `/`, `/shop/` and one product page; and a **"needs the owner"** list:

- Rotate the leaked Sanity token and set `SANITY_API_TOKEN` and `BING_SITE_VERIFICATION` in Cloudflare.
- Check Cloudflare AI Crawl Control and bot settings against the new `robots.txt`.
- Replace the Google Business Profile `google.com/search?…` link with the real Maps place URL.
- Resolve the TikTok handle mismatch (`@printhub_africa` vs `@printhub.africa`).
- Verify in GTM Preview that GA4 and `generate_lead` are not double-firing (both GTM and a direct gtag are loaded).
- Replace illustration PNGs with real product photos.
- Supply the missing facts for answer engines (lead times, max print size, delivery costs, minimum order).
- Review the technical claims in the three guides before publishing.
- Add a Cloudflare Redirect Rule for www to apex.
- Work through `docs/SEO-PLAYBOOK.md` (GBP, citations, reviews, photos, backlinks, measurement).
- Submit the sitemap in Google Search Console and Bing Webmaster Tools, and run `npm run indexnow` after each deploy.
