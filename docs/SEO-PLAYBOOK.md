# PrintHub Africa: off-site, local and measurement playbook

Code can only do part of SEO. For a local made-to-order business in Eldoret, the items below often move rankings (and AI-engine recommendations) as much as on-page work. Tick them off in order. Nothing here should be invented: no fake reviews, no fake addresses, no bought links.

## 1. First week: foundations

| # | Action | Where | Done |
|---|---|---|---|
| 1 | Verify the site in **Google Search Console** (domain property); submit `https://printhub.africa/sitemap.xml` | search.google.com/search-console | [ ] |
| 2 | Verify in **Bing Webmaster Tools** (import from GSC is fastest); put the meta code in `BING_SITE_VERIFICATION`; submit the sitemap | bing.com/webmasters | [ ] |
| 3 | After every deploy run `npm run indexnow` (Bing, Yandex, Naver, Seznam) | terminal | [ ] |
| 4 | Cloudflare: confirm AI crawlers are not blocked (Security > Bots / AI Crawl Control) and that live `/robots.txt` matches `public/robots.txt` | Cloudflare dashboard | [ ] |
| 5 | Cloudflare Redirect Rule: `www.printhub.africa/*` to `https://printhub.africa/$1` (301); force HTTPS | Cloudflare Rules | [ ] |
| 6 | Rotate the leaked Sanity token; set `SANITY_API_TOKEN` (read-only) in Cloudflare Pages env vars | Sanity + Cloudflare | [ ] |
| 7 | ~~Fix the TikTok handle mismatch~~ — confirmed `@printhub_africa` is correct; code updated | `src/data/site.ts` | [x] |
| 8 | GTM + direct gtag both load. Use GTM Preview and make sure GA4 and `generate_lead` fire once; remove the duplicate path | GTM / `Layout.astro` | [ ] |

## 2. Google Business Profile (the biggest local lever)

- Primary category: the closest match for "3D printing service". Add secondary categories only if true (for example custom manufacturing/prototyping if offered).
- Service area: Eldoret, Uasin Gishu County and delivery across Kenya. Hide the street address if there is no public shopfront (service-area business).
- Hours exactly as on the website (Mon-Fri 8:00-18:00, Sat 9:00-15:00, closed Sunday unless that changes).
- Phone, WhatsApp, website `https://printhub.africa/`, appointment link if used.
- Add the product list with real photos and prices ("from" prices, as on the site).
- Upload at least 10 real photos: finished pieces, the printers, packaging, a delivery.
- Post weekly (new print, customer project, offer).
- Seed the Q&A with real questions (lead times, M-Pesa, delivery, file formats), answering honestly.
- Replace `site.googleBusinessProfile` (currently a `google.com/search?...` URL) with the real Maps place URL so schema `sameAs` is correct.

## 3. Name, address, phone consistency (NAP)

Use one spelling and one phone/email everywhere: **PrintHub Africa**, the WhatsApp number, `hello@printhub.africa`.

| Place | Status |
|---|---|
| Website footer / contact | [ ] |
| Google Business Profile | [ ] |
| Bing Places | [ ] |
| Apple Business Connect | [ ] |
| Facebook Page | [ ] |
| Instagram / TikTok / Threads / YouTube bios | [ ] |
| LinkedIn Company Page (mention Niamade Hub as parent) | [ ] |
| WhatsApp Business profile | [ ] |
| Kenyan business directories (pick 5 to 10 reputable ones) | [ ] |

## 4. Reviews

- After each delivered order, send a WhatsApp message with the Google review link and a one-line thank-you. Ask every customer, not only happy ones.
- Reply to every review, good or bad, within 48 hours.
- Show reviews on the site only when they are real and visible. Only then add `AggregateRating` / `Review` schema (never before).

## 5. Real photography and proof of work

The current product images are rendered illustrations. Replace them with real photos: plain background, good daylight, one shot in use per product, plus a scale reference. Add a portfolio / case-study section (client type, problem, material, result, photo). Use descriptive file names and alt text. This is the largest remaining on-page gap and also feeds Google Images, GBP and AI visual search.

## 6. Backlinks and partnerships (earned, not bought)

Aim for 20 relevant links in 6 months. Angles that give people a reason to link:

| Target | Angle |
|---|---|
| Schools, STEM clubs, universities in Uasin Gishu | learning models, classroom demos, free workshop |
| Makerspaces, tech hubs, engineering societies | guest talk, file-prep guide, equipment partnership |
| Wedding planners, venues, event companies | custom favours, branded signage |
| Architecture, design and construction firms | scale models for pitches |
| Corporate clients | dimensional logo signs, desk nameplates (ask for a link in their case study) |
| Kenyan tech/business blogs, podcasts, local press | "made in Eldoret" story; materials guide |
| Supplier / filament and printer brand communities | showcase their material in a real project |

Do not buy links, join link networks, or mass-email guest-post requests.

## 7. Entity and AI-engine consistency

Keep one short description of the business and the same core facts (location, hours, payment, delivery, materials) across: website, `llms.txt`, GBP, LinkedIn, social bios. Answer engines cross-check these. Consider Wikidata/Crunchbase only if notability criteria are honestly met.

## 8. Language (Swahili)

Evaluate before building:
1. Search demand in Swahili for the core services (use Search Console queries and Google Trends for Kenya).
2. If real, pilot Swahili versions of the 3 to 5 top pages with natural (not machine) translation, `sw-KE` locale and `hreflang` links between versions.
3. Otherwise add a few Swahili keywords naturally in FAQs.

## 9. Shopping surfaces

Check Google Merchant Center eligibility for Kenya. If eligible, build a free-listings feed from the catalogue (the CSV backups in `backups/` are a starting point) and keep prices identical to the site (prices are "from" guides, so use clear wording).

## 10. Measurement

| What | Tool | Cadence |
|---|---|---|
| Impressions, clicks, queries for `/shop/for/*` and `/guides/*` | Search Console + Bing WMT | monthly |
| Core Web Vitals (field data) | Search Console > Experience | monthly |
| Conversions: WhatsApp click, quote form, checkout started, order confirmed | GA4 | monthly |
| GBP calls, direction requests, messages | Business Profile | monthly |
| AI referrals (`chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`, `claude.ai`) | GA4 referral report | monthly |
| Rankings for 15 target queries ("3D printing Eldoret", "personalised gifts Kenya", ...) | manual or a rank tracker | monthly |
| Do AI assistants describe the business correctly? Ask 5 test questions | manual | quarterly |

## 11. 90-day plan

- **Weeks 1-2:** section 1 and 2, NAP clean-up, citations.
- **Weeks 3-6:** photography, reviews process, review the three guides, add 2 case studies, publish.
- **Weeks 7-12:** outreach for backlinks, Swahili pilot (if demand), Merchant Center, review rankings and iterate.

## 12. Content backlog (write only with real facts)

Case studies with photos; "3D printed corporate gifts in Kenya"; how pricing works (what is quoted, deposit terms from `/terms/`); materials and finishes; typical lead times and delivery costs (needs owner data); FAQs from real WhatsApp questions.
