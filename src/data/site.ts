// Edit business details here once; every page reads from this file.
// Products and FAQs are sourced from src/content/ and managed via the Decap CMS admin at /admin.
import fs from "node:fs";
import path from "node:path";

// ── Load CMS-managed content ──────────────────────────────────────────────────
// import.meta.glob is processed by Vite at build time — works in .ts files
// imported by Astro pages.
const _productModules = import.meta.glob("../content/products/*.json", { eager: true }) as Record<string, { default: Record<string, unknown> }>;
const _cmsStock = Object.values(_productModules).map((m) => m.default ?? m) as Array<{
  slug: string; name: string; cat: string; price: string; note: string;
  material: string; finish: string; tags: string[]; blurb: string; uses: string[]; care: string;
}>;

import _faqsData from "../content/faqs.json";
import _settingsData from "../content/settings.json";
import { fetchProductsFromNotion } from "../lib/notion";

export const site = {
  name: _settingsData.name,
  businessName: "Niamade Hub",
  endorsement: "A Niamade Hub Company",
  relationship: "PrintHub Africa — A Niamade Hub Company",
  url: "https://printhub.africa", // CHANGE if the live domain differs (canonical links, sitemap, social previews)
  city: _settingsData.city,
  phone: _settingsData.phone,
  whatsapp: _settingsData.whatsapp,
  email: _settingsData.email,
  parent: "Niamade Hub",
  hours: _settingsData.hours,
  // Same hours in machine-readable form (0 = Sunday). Drives the live "Open now" badge and search-engine data.
  hoursSpec: [{ days: [1, 2, 3, 4, 5], open: "08:00", close: "18:00" }, { days: [6], open: "09:00", close: "15:00" }],
  tz: "Africa/Nairobi",
  socials: [
    { id: "instagram", label: "Instagram", handle: "@printhub.africa", href: "https://www.instagram.com/printhub.africa/" },
    { id: "threads", label: "Threads", handle: "@printhub.africa", href: "https://www.threads.com/@printhub.africa" },
    { id: "tiktok", label: "TikTok", handle: "@printhub_africa", href: "https://www.tiktok.com/@printhub_africa" },
    { id: "youtube", label: "YouTube", handle: "@PrinthubAfrica", href: "https://www.youtube.com/@PrinthubAfrica" },
    { id: "linkedin", label: "LinkedIn", handle: "PrintHub Africa", href: "https://www.linkedin.com/company/printhub-africa" },
  ],
  googleBusinessProfile: "https://www.google.com/search?q=PrinthubAfrica&stick=H4sIAAAAAAAA_-NgU1I1qDA0tzA0MLSwtDQ3MTA2NEuyMqgwSTI2NTM1t7A0TLY0tTBKXsTKF1CUmVeSUZrkmFaUmZwIAIsxzsY6AAAA",
  // SEO, Analytics & Tag Manager
  gtmId: "GTM-MJQKD9BZ",
  googleSiteVerification: "wCWYBxjCrZbXaBiDU1aioTUMNUC7wAjEBIpVFX5rrwk",
  googleAnalyticsId: "G-DPPDS1G5P1",
  googleAdsId: "AW-18115096382",
};

export const wa = (msg = "Hi PrintHub, I'd like to ask about a 3D print.") => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

// Shop-by-occasion groups. `art` is the product whose illustration represents the group.
export const occasions = [
  { id: "gift", label: "Birthdays & gifts", blurb: "Keepsakes with a name, a photo or a joke on them.", art: "lithophane-photo-lamp", tone: "lilac" },
  { id: "events", label: "Weddings & events", blurb: "Favours and keepsakes your guests will actually keep.", art: "name-keychain", tone: "rose" },
  { id: "business", label: "Business & branding", blurb: "Signs, desk plates and giveaways with your logo on.", art: "branded-logo-sign", tone: "butter" },
  { id: "kenya", label: "Kenya souvenirs", blurb: "Maps, wildlife and relief art for visitors and the diaspora.", art: "kenya-topographic-relief", tone: "mint" },
  { id: "home", label: "Home & office", blurb: "Planters, vases and desk helpers that look good.", art: "geometric-spiral-vase", tone: "peach" },
  { id: "learn", label: "Schools & learning", blurb: "Hands-on shapes and models for the classroom.", art: "stem-learning-models", tone: "sky" },
  { id: "parts", label: "Parts & prototypes", blurb: "Brackets, spares and test pieces for makers and engineers.", art: "rapid-prototype-print", tone: "sand" },
] as const;

// Try fetching products from Notion if configured; otherwise use local JSON files.
const _notionProducts = await fetchProductsFromNotion();
const stock = _notionProducts || _cmsStock;

// Your own photos win automatically: drop <slug>-1.jpg, <slug>-2.jpg (jpg/jpeg/png/webp/avif) into public/products/.
const ownDir = path.join(process.cwd(), "public", "products");
const ownFiles = fs.existsSync(ownDir) ? fs.readdirSync(ownDir) : [];
export const products = stock.map((p: any) => {
  const own = ownFiles.filter((f) => new RegExp(`^${p.slug}-\\d+\\.(jpe?g|png|webp|avif)$`, "i").test(f)).sort().map((f) => `/products/${f}`);
  const photos = (p.photos && p.photos.length) ? p.photos : own;
  return { ...p, photos };
});
export type Product = (typeof products)[number];
export const price = (p: string) => { const m = p.replace(/,/g, "").match(/\d+/); return m ? Number(m[0]) : undefined; };

export const materials = [
  { name: "PLA", tone: "peach", for: "Gifts, décor and prototypes", note: "The easiest to print, with the widest range of colours. Not for hot cars or long outdoor use." },
  { name: "PETG", tone: "sky", for: "Everyday parts and outdoor use", note: "Tough and water-resistant, with a little give. A good all-rounder for useful things." },
  { name: "TPU", tone: "mint", for: "Flexible pieces", note: "Rubber-like and bendy. Used for grips, seals, bumpers and phone cases." },
  { name: "PVA", tone: "lilac", for: "Support for tricky shapes", note: "A support material that dissolves in water, so we can print overhangs and complex shapes cleanly." },
] as const;

export const steps = [
  { n: 1, title: "Tell us your idea", text: "Message us on WhatsApp with what you want, a photo, a sketch or your 3D file. No file yet? That's fine." },
  { n: 2, title: "We send your quote", text: "We check size, material and finish, then send your price in KES. Design work, if you need it, is quoted first." },
  { n: 3, title: "Pay by M-Pesa, then receive", text: "Custom jobs usually need a deposit before printing, with the balance before dispatch. Collect in Eldoret or we courier it." },
];

// FAQs are managed via the Decap CMS at /admin — edit src/content/faqs.json
export const faqs = _faqsData.faqs;

export const printServices = [
  { title: "Printing from your file", text: "Send your 3D model and we print it in PLA, PETG or TPU, after checking it will print well." },
  { title: "Complex shapes", text: "Tricky overhangs and moving parts are printed with dissolvable PVA supports, so the surface stays clean." },
  { title: "Prototypes", text: "Hold your idea in your hands, test it, change it, and print it again." },
  { title: "Small batches", text: "Giveaways, team orders, shop stock. Batches cost less per piece." },
  { title: "Finishing", text: "Sanding, smoothing, priming and painting are available if you want a polished result." },
  { title: "Large pieces", text: "Bigger items can often be printed in sections and joined seamlessly." },
];

export const designServices = [
  { title: "From a sketch or idea", text: "Draw it on paper or describe it in words, and we turn it into a printable 3D model." },
  { title: "From photos and measurements", text: "Show us the object and tell us the sizes. We model it so it fits." },
  { title: "Copying a broken part", text: "Send the old piece and we recreate it, often in a tougher material." },
  { title: "Logos and lettering", text: "Your logo or text turned into a raised 3D sign, plate or keychain." },
  { title: "Fixing or improving a file", text: "Have a model that won't print well? We clean it up so it does." },
];
