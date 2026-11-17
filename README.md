# PrintHub Africa website (v2, fresh build)

A warm, friendly site for gift buyers and small businesses. Astro 5 + Tailwind 3, fonts self-hosted (Fraunces + Figtree), no client framework. Your real logo is used throughout (`public/logo-*.png`).

## Run

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview
```

## Pages

`/` home · `/shop` (filter by occasion, deep links like `/shop?for=kenya`) · `/shop/<slug>` · `/for-business` · `/custom` · `/help` (FAQ) · `/about` · `/contact` · 404 · `/sitemap.xml`

## Where to edit things

| What | Where |
| --- | --- |
| Phone, WhatsApp, email, hours, social links, domain | `src/data/site.ts` (top of file) |
| Products, prices (DRAFT guides, confirm before launch) | `src/data/site.ts` (`stock`) |
| FAQs, steps, materials, service lists | `src/data/site.ts` |
| Product illustrations | `src/data/art.ts` |
| Colours, fonts, easing | `tailwind.config.mjs` |
| Component styles, motion, reduced-motion rules | `src/styles/global.css` |
| Domain for canonical links | `astro.config.mjs` (`site`) and `site.url` in `src/data/site.ts` (keep the same) |

## Product photos

Until you have real photos, each product shows a friendly illustration (labelled as an illustration on the site).
To use your own photos, drop files into `public/products/` named after the product slug:

```
public/products/name-keychain-1.jpg
public/products/name-keychain-2.jpg
```

The slug is the last part of the product URL. Formats: jpg, jpeg, png, webp, avif. As soon as a product has a photo it replaces the illustration, gets a thumbnail gallery if it has more than one, and the "illustration" note disappears for it. Aim for square or 4:3 photos about 1600 px wide, under 300 KB each.

## Content rules we followed

Only facts supplied by PrintHub are stated as fact. There are no customer counts, testimonials or turnaround times; the site says timing is confirmed with each quote. Add them back only when you have real ones.

## Design and motion

- Press feedback on everything pressable (0.97 scale); hover effects only on devices that can hover.
- `ease-out` is a strong custom curve; UI transitions stay under about 300 ms and only animate transform and opacity.
- Respects reduced motion, reduced transparency and high contrast.
- Brand colour `#A6360A` passes AA text contrast on every pastel tile. Keep `coral` for decoration only.
- Add `data-reveal-group` to any grid and its children will rise in once on scroll.
- The home-page "Open now / Closed" badge reads `site.hoursSpec` and always uses Kenya time.
