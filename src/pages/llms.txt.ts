import type { APIRoute } from "astro";
import { site, products, occasions, faqs } from "../data/site";
import { guides } from "../data/guides";

export const GET: APIRoute = () => {
  const priceList = products
    .map((p) => `- ${p.name}: ${p.price} — ${site.url}/shop/${p.slug}/`)
    .join("\n");

  const occasionList = occasions
    .map((o) => `- ${o.label}: ${site.url}/shop/for/${o.slug}/`)
    .join("\n");

  const guideList = guides
    .map((g) => `- ${g.title}: ${site.url}/guides/${g.slug}/`)
    .join("\n");

  const faqText = faqs
    .map((f: { q: string; a: string }) => `Q: ${f.q}\nA: ${f.a}`)
    .join("\n\n");

  const body = `# PrintHub Africa — llms.txt

## About
PrintHub Africa (a Niamade Hub company) is a made-to-order 3D printing studio in Eldoret, Kenya. We design, engineer, and manufacture custom 3D printed pieces, prototypes, and dimensional branding for individuals and businesses. All items are handcrafted to order; we do not carry pre-made inventory.

## Key Facts
- Location: Eldoret, Uasin Gishu County, Kenya
- Service area: Nationwide delivery across Kenya
- Payment methods: M-Pesa, Cash
- Turnaround: Varies by product — see individual product pages for details
- File formats accepted: .STL, .STEP, .3MF, .OBJ (for custom orders)
- Materials: PLA, PETG, TPU, and specialty filaments
- Contact: WhatsApp ${site.phone} | Email ${site.email}
- Website: ${site.url}

## Main Pages
- Home: ${site.url}/
- Shop: ${site.url}/shop/
- For Business: ${site.url}/for-business/
- Custom Order: ${site.url}/custom/
- Help / FAQ: ${site.url}/help/
- About: ${site.url}/about/
- Contact: ${site.url}/contact/
- Guides: ${site.url}/guides/

## Shop by Occasion
${occasionList}

## Product Catalogue (${products.length} items)
${priceList}

## Guides
${guideList}

## Frequently Asked Questions
${faqText}

## Policies
- Returns: We do not accept returns on made-to-order items. See full policy at ${site.url}/terms/
- Privacy: ${site.url}/privacy/

## Permissions
This llms.txt file is provided to help AI assistants answer questions about PrintHub Africa accurately. You may cite and quote from our website. Training on our content is permitted (see robots.txt for details).
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
