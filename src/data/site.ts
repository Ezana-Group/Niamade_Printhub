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
import {
  fetchProductsFromSanity,
  fetchFaqsFromSanity,
  fetchSettingsFromSanity,
  fetchMaterialsFromSanity,
  fetchServicesFromSanity,
  fetchOccasionsFromSanity,
} from "../lib/sanity";
import { fetchProductsFromGoogleSheets } from "../lib/sheets";
import { fetchProductsFromNotion } from "../lib/notion";

// Live content from Sanity (with fallback to local files)
const _sanitySettings = await fetchSettingsFromSanity();
const _sanityFaqs = await fetchFaqsFromSanity();
const _sanityMaterials = await fetchMaterialsFromSanity();
const _sanityPrintServices = await fetchServicesFromSanity("printing");
const _sanityDesignServices = await fetchServicesFromSanity("design");
const _sanityOccasions = await fetchOccasionsFromSanity();

export const faqs = _sanityFaqs || _faqsData.faqs;

export const site = {
  name: _sanitySettings?.name || _settingsData.name,
  businessName: "Niamade Hub",
  endorsement: "A Niamade Hub Company",
  relationship: "PrintHub Africa — A Niamade Hub Company",
  url: "https://printhub.africa", // CHANGE if the live domain differs (canonical links, sitemap, social previews)
  city: _sanitySettings?.city || _settingsData.city,
  phone: _sanitySettings?.phone || _settingsData.phone,
  whatsapp: _sanitySettings?.whatsapp || _settingsData.whatsapp,
  email: _sanitySettings?.email || "hello@printhub.africa",
  bookingEmail: _sanitySettings?.bookingEmail || "booking@printhub.africa",
  notificationEmail: _sanitySettings?.notificationEmail || _sanitySettings?.email || "booking@printhub.africa",
  parent: "Niamade Hub",
  hours: _sanitySettings?.hours || _settingsData.hours,
  // Same hours in machine-readable form (0 = Sunday). Drives the live "Open now" badge and search-engine data.
  hoursSpec: [{ days: [1, 2, 3, 4, 5], open: "08:00", close: "18:00" }, { days: [6], open: "09:00", close: "15:00" }],
  tz: "Africa/Nairobi",
  socials: [
    { id: "instagram", label: "Instagram", handle: "@printhub.africa", href: _sanitySettings?.socials?.instagram || "https://www.instagram.com/printhub.africa/" },
    { id: "threads", label: "Threads", handle: "@printhub.africa", href: _sanitySettings?.socials?.threads || "https://www.threads.com/@printhub.africa" },
    { id: "tiktok", label: "TikTok", handle: (_sanitySettings?.socials?.tiktok?.split("/").pop() || "@printhub_africa"), href: _sanitySettings?.socials?.tiktok || "https://www.tiktok.com/@printhub_africa" },
    { id: "youtube", label: "YouTube", handle: "@PrinthubAfrica", href: _sanitySettings?.socials?.youtube || "https://www.youtube.com/@PrinthubAfrica" },
    { id: "linkedin", label: "LinkedIn", handle: "PrintHub Africa", href: _sanitySettings?.socials?.linkedin || "https://www.linkedin.com/company/printhub-africa" },
  ],
  googleBusinessProfile: _sanitySettings?.socials?.googleBusiness || "https://www.google.com/search?q=PrinthubAfrica&stick=H4sIAAAAAAAA_-NgU1I1qDA0tzA0MLSwtDQ3MTA2NEuyMqgwSTI2NTM1t7A0TLY0tTBKXsTKF1CUmVeSUZrkmFaUmZwIAIsxzsY6AAAA",
  // SEO, Analytics & Tag Manager
  gtmId: "GTM-MJQKD9BZ",
  googleSiteVerification: "wCWYBxjCrZbXaBiDU1aioTUMNUC7wAjEBIpVFX5rrwk",
  googleAnalyticsId: "G-DPPDS1G5P1",
  googleAdsId: "AW-18115096382",
  // Payments & Checkout
  paystackPublicKey: _sanitySettings?.paystackPublicKey || process.env.PUBLIC_PAYSTACK_KEY || import.meta.env?.PUBLIC_PAYSTACK_KEY || "",
  enableCheckout: _sanitySettings?.enableCheckout ?? true,
  // Bookings & Easy!Appointments
  easyAppointmentsUrl: _sanitySettings?.easyAppointmentsUrl || process.env.PUBLIC_EASYAPPOINTMENTS_URL || import.meta.env?.PUBLIC_EASYAPPOINTMENTS_URL || "",
  enableEasyAppointmentsEmbed: _sanitySettings?.enableEasyAppointmentsEmbed ?? false,
  bookingNotice: _sanitySettings?.bookingNotice || "",
};

export const wa = (msg = "Hi PrintHub, I'd like to ask about a 3D print.") => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

// WhatsApp message templates — editable in Sanity Studio → Site Settings → WhatsApp Message Templates
export const waMessages = {
  general:     _sanitySettings?.whatsappMessages?.general     || "Hi PrintHub, I'd like to ask about a 3D print.",
  customFile:  _sanitySettings?.whatsappMessages?.customFile  || "Hi PrintHub, I have a 3D file ready for slicing analysis and quote.",
  customIdea:  _sanitySettings?.whatsappMessages?.customIdea  || "Hi PrintHub, I have an idea and need it designed and manufactured.",
  business:    _sanitySettings?.whatsappMessages?.business    || "Hi PrintHub, I need a quote for custom business pieces.",
  help:        _sanitySettings?.whatsappMessages?.help        || "Hi PrintHub, I have a question.",
};

// Shop-by-occasion groups. `art` is the product whose illustration represents the group.
export const occasions = [
  {
    id: "gift",
    slug: "birthday-gifts",
    label: "Birthdays & gifts",
    title: "3D Printed Birthday Gifts & Keepsakes in Kenya",
    h1: "3D Printed Birthday Gifts & Personalised Keepsakes",
    blurb: "Keepsakes with a name, a photo or a joke on them.",
    desc: "Custom 3D printed birthday gifts, personalised keychains, and lithophane photo lamps made to order in Eldoret, Kenya. Order on WhatsApp with M-Pesa.",
    art: "lithophane-photo-lamp",
    tone: "lilac",
  },
  {
    id: "events",
    slug: "wedding-event-favours",
    label: "Weddings & events",
    title: "Custom Wedding Favours & Event Keepsakes Kenya",
    h1: "Custom Wedding Favours & Event Keepsakes",
    blurb: "Favours and keepsakes your guests will actually keep.",
    desc: "Personalised wedding favours, event keepsakes, and guest name tags 3D printed in Eldoret, Kenya. Durable, memorable dimensional pieces.",
    art: "name-keychain",
    tone: "rose",
  },
  {
    id: "business",
    slug: "corporate-branding",
    label: "Business & branding",
    title: "3D Printed Corporate Signs & Branding in Kenya",
    h1: "3D Printed Corporate Signs & Dimensional Branding",
    blurb: "Signs, desk plates and giveaways with your logo on.",
    desc: "Dimensional logo signs, weighted executive desk nameplates, and custom branded giveaways manufactured in Eldoret, Kenya. Fast courier delivery.",
    art: "branded-logo-sign",
    tone: "butter",
  },
  {
    id: "kenya",
    slug: "kenya-souvenirs",
    label: "Kenya souvenirs",
    title: "3D Printed Kenya Souvenirs & Topographic Art",
    h1: "3D Printed Kenya Souvenirs & Topographic Art",
    blurb: "Maps, wildlife and relief art for visitors and the diaspora.",
    desc: "Topographic relief maps of Kenya, Big Five animal sets, and Kenya map keychains 3D printed in Eldoret. Authentic souvenirs delivered across Kenya.",
    art: "kenya-topographic-relief",
    tone: "mint",
  },
  {
    id: "home",
    slug: "home-office-decor",
    label: "Home & office",
    title: "Modern 3D Printed Home & Office Decor in Kenya",
    h1: "Modern 3D Printed Home & Office Decor",
    blurb: "Planters, vases and desk helpers that look good.",
    desc: "Geometric spiral vases, succulent planter sets, and minimalist desk organisers 3D printed to order in Eldoret, Kenya in PLA and PETG.",
    art: "geometric-spiral-vase",
    tone: "peach",
  },
  {
    id: "learn",
    slug: "school-learning-models",
    label: "Schools & learning",
    title: "STEM Learning Models & Classroom Shapes Kenya",
    h1: "STEM Learning Models & Classroom Teaching Aids",
    blurb: "Hands-on shapes and models for the classroom.",
    desc: "Tactile mathematical shapes, molecular models, and STEM teaching aids 3D printed for Kenyan schools, universities, and students in Eldoret.",
    art: "stem-learning-models",
    tone: "sky",
  },
  {
    id: "parts",
    slug: "prototypes-and-parts",
    label: "Parts & prototypes",
    title: "Custom 3D Printed Parts & Prototypes in Kenya",
    h1: "Custom 3D Printed Parts & Engineering Prototypes",
    blurb: "Brackets, spares and test pieces for makers and engineers.",
    desc: "Functional replacement parts, custom PETG brackets, and engineering rapid prototypes 3D printed to specification in Eldoret, Kenya.",
    art: "rapid-prototype-print",
    tone: "sand",
  },
] as const;

// Priority: Sanity Studio -> Google Sheet Backup -> Notion -> local JSON content
const _sanityProducts = await fetchProductsFromSanity();
const _sheetProducts = _sanityProducts ? null : await fetchProductsFromGoogleSheets();
const _notionProducts = (_sanityProducts || _sheetProducts) ? null : await fetchProductsFromNotion();
const stock = _sanityProducts || _sheetProducts || _notionProducts || _cmsStock;

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

export const materials = (_sanityMaterials && _sanityMaterials.length)
  ? _sanityMaterials.map((m) => ({
      name: m.name,
      tone: (m.tone as any) || "peach",
      for: m.bestFor || m.fullName || "General 3D Printing",
      note: m.durability ? `${m.finish ? m.finish + ' · ' : ''}${m.durability}` : (m.finish || m.heatResistance || "Printed to precision in Eldoret."),
    }))
  : [
      { name: "PLA", tone: "peach", for: "Gifts, décor and prototypes", note: "The easiest to print, with the widest range of colours. Not for hot cars or long outdoor use." },
      { name: "PETG", tone: "sky", for: "Everyday parts and outdoor use", note: "Tough and water-resistant, with a little give. A good all-rounder for useful things." },
      { name: "TPU", tone: "mint", for: "Flexible pieces", note: "Rubber-like and bendy. Used for grips, seals, bumpers and phone cases." },
      { name: "PVA", tone: "lilac", for: "Support for tricky shapes", note: "A support material that dissolves in water, so we can print overhangs and complex shapes cleanly." },
    ];

export const steps = [
  { n: 1, title: "Tell us your idea", text: "Message us on WhatsApp with what you want, a photo, a sketch or your 3D file. No file yet? That's fine." },
  { n: 2, title: "We send your quote", text: "We check size, material and finish, then send your price in KES. Design work, if you need it, is quoted first." },
  { n: 3, title: "Pay by M-Pesa, then receive", text: "Custom jobs usually need a deposit before printing, with the balance before dispatch. Collect in Eldoret or we courier it." },
];

// FAQs are managed via Sanity Studio / Google Sheets / src/content/faqs.json

export const printServices = (_sanityPrintServices && _sanityPrintServices.length)
  ? _sanityPrintServices.map((s) => ({ title: s.title, text: s.description }))
  : [
      { title: "Printing from your file", text: "Send your 3D model and we print it in PLA, PETG or TPU, after checking it will print well." },
      { title: "Complex shapes", text: "Tricky overhangs and moving parts are printed with dissolvable PVA supports, so the surface stays clean." },
      { title: "Prototypes", text: "Hold your idea in your hands, test it, change it, and print it again." },
      { title: "Small batches", text: "Giveaways, team orders, shop stock. Batches cost less per piece." },
      { title: "Finishing", text: "Sanding, smoothing, priming and painting are available if you want a polished result." },
      { title: "Large pieces", text: "Bigger items can often be printed in sections and joined seamlessly." },
    ];

export const designServices = (_sanityDesignServices && _sanityDesignServices.length)
  ? _sanityDesignServices.map((s) => ({ title: s.title, text: s.description }))
  : [
      { title: "From a sketch or idea", text: "Draw it on paper or describe it in words, and we turn it into a printable 3D model." },
      { title: "From photos and measurements", text: "Show us the object and tell us the sizes. We model it so it fits." },
      { title: "Copying a broken part", text: "Send the old piece and we recreate it, often in a tougher material." },
      { title: "Logos and lettering", text: "Your logo or text turned into a raised 3D sign, plate or keychain." },
      { title: "Fixing or improving a file", text: "Have a model that won't print well? We clean it up so it does." },
    ];
