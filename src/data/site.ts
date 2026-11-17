// Edit business details here once; every page reads from this file.
import fs from "node:fs";
import path from "node:path";

export const site = {
  name: "PrintHub Africa",
  businessName: "Niamade Hub",
  endorsement: "A Niamade Hub Company",
  relationship: "PrintHub Africa — A Niamade Hub Company",
  url: "https://printhub.africa", // CHANGE if the live domain differs (canonical links, sitemap, social previews)
  city: "Eldoret, Uasin Gishu County, Kenya",
  phone: "+254 792 732 929",   // same number as WhatsApp
  whatsapp: "254792732929",
  email: "hello@printhub.africa",
  parent: "Niamade Hub",
  hours: ["Mon–Fri 8:00 – 18:00", "Sat 9:00 – 15:00"],
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

// Prices are DRAFT guides in KES. Confirm every price before launch.
const stock = [
  { slug: "geometric-spiral-vase", name: "Geometric Spiral Vase", cat: "Home & decor", price: "KES 1,600", note: "Twisted layers, modern look", material: "PLA", finish: "Smooth or brushed", tags: ["gift", "home"], blurb: "A twisted, textured vase that looks hand-sculpted. Great for dried stems and faux flowers, and a lovely housewarming gift.", uses: ["Housewarming gift", "Shelf or table centrepiece", "Dried flowers"], care: "Made for dry arrangements. Prints are not watertight unless made for it, so ask us if you want fresh flowers." },
  { slug: "succulent-planter-set", name: "Succulent Planter Set", cat: "Home & decor", price: "KES 1,900", note: "Set of three, drainage included", material: "PLA or PETG", finish: "Matte", tags: ["home", "events", "gift"], blurb: "Three planters in graduated sizes with drainage holes and matching saucers. Ask about a set as table favours for an event.", uses: ["Desk plants", "Event favours", "Gifts"], care: "PETG is the better pick if the planters will sit outdoors." },
  { slug: "phone-headphone-dock", name: "Phone & Headphone Dock", cat: "Desk & tech", price: "KES 1,200", note: "Charging cable routing", material: "PLA or PETG", finish: "Smooth", tags: ["business", "home"], blurb: "One tidy spot for your phone and headphones, with a channel that keeps the charging cable neat.", uses: ["Desk or bedside", "Branded team gift", "Reception counter"], care: "Tell us your phone model so the cable channel fits." },
  { slug: "cable-desk-organiser", name: "Cable & Desk Organiser", cat: "Desk & tech", price: "KES 1,400", note: "Weighted pen well & cable channels", material: "PLA or PETG", finish: "Matte", tags: ["business", "home"], blurb: "A desktop anchor with custom channels to keep your charging cords from diving behind your desk every time you unplug.", uses: ["Workstations", "Team gifts", "Retail counters"], care: "Custom debossed company logos available for team batches." },
  { slug: "adjustable-laptop-stand", name: "Adjustable Laptop Stand", cat: "Desk & tech", price: "KES 2,800", note: "Lifts your screen, folds flat", material: "PETG", finish: "Smooth", tags: ["home", "business"], blurb: "Ergonomics without the ugly aluminum clutter. Engineered in structural PETG to handle heavy workstations without flexing, then folds flat into your bag.", uses: ["Remote work", "Ergonomic setups", "Travel"], care: "Tell us your laptop size and we will calibrate hinge tension to match." },
  { slug: "kenya-topographic-relief", name: "Kenya Topographic Relief Map", cat: "Kenya", price: "From KES 3,500", note: "Wall or desk display", material: "PLA", finish: "Layered, painted on request", tags: ["kenya", "business", "gift"], blurb: "A layered relief of Kenya's highlands, Great Rift Valley and coast. Real geographical contour data, translated into tactile physical art.", uses: ["Diaspora gift", "Boardrooms & lobbies", "Geography collections"], care: "Larger custom dimensions quoted on request." },
  { slug: "big-five-animal-set", name: "Big Five Animal Set", cat: "Kenya", price: "KES 3,200", note: "Five collectible figurines", material: "PLA", finish: "Hand-finished, painted on request", tags: ["kenya", "gift"], blurb: "Lion, elephant, buffalo, rhino and leopard. Minimalist geometric figurines with substantial weight, designed and printed in Kenya.", uses: ["Souvenirs", "Executive desk display", "Gifts"], care: "Hand-painted accent coats available on request." },
  { slug: "kenya-map-keychain", name: "Kenya Map Keychain", cat: "Kenya", price: "KES 350", note: "Pocket-sized keepsake", material: "PLA", finish: "Smooth", tags: ["kenya", "events"], blurb: "A pocket-sized silhouette of Kenya. Precise perimeter cuts, durable infill, and zero cheap plastic feel.", uses: ["Souvenirs", "Event giveaways", "Tour groups"], care: "Volume batch discounts apply automatically for events." },
  { slug: "name-keychain", name: "Personalised Name Keychain", cat: "Gifts", price: "KES 300", note: "Any name, high-contrast colours", material: "PLA", finish: "Smooth", tags: ["gift", "events", "business"], blurb: "Custom raised lettering fused directly into the base layer so the letters never peel or snap off.", uses: ["Birthdays", "Wedding favours", "Team gear"], care: "Send names and hex colors. Larger batches cost significantly less per piece." },
  { slug: "custom-desk-nameplate", name: "Custom Desk Nameplate", cat: "Business", price: "KES 1,500", note: "Dual-colour raised typography", material: "PLA", finish: "Crisp raised lettering", tags: ["business"], blurb: "Establish desk territory with sharp, two-tone raised typography. Because a folded piece of paper taped to a display is an insult to your title.", uses: ["Executive desks", "New hire onboarding", "Team promotions"], care: "Send team roster, titles and brand colours. Batch pricing kicks in automatically for teams." },
  { slug: "lithophane-photo-lamp", name: "Lithophane Photo Lamp", cat: "Gifts", price: "From KES 2,800", note: "Your photo revealed by backlight", material: "PLA, white", finish: "Smooth", tags: ["gift", "events"], blurb: "Optical physics in action: variable layer thickness translates grayscale photo pixels into light density. An unassuming white relief until the light turns on.", uses: ["Anniversaries", "Memorials", "Keepsakes"], care: "Send a clear, high-contrast photo. Backlit LEDs included." },
  { slug: "architectural-scale-model", name: "Architectural Scale Model", cat: "Business", price: "From KES 8,000", note: "Buildings and site layouts", material: "PLA", finish: "Detailed, painted on request", tags: ["business"], blurb: "Scale models from floor plans and BIM exports. Tangible volume and sightline verification for client pitches, planning reviews and public exhibits.", uses: ["Architects", "Developers", "Exhibition showrooms"], care: "Send DWG, IFC, or 3D CAD files for a structural estimate." },
  { slug: "branded-logo-sign", name: "Branded Logo Sign", cat: "Business", price: "From KES 2,500", note: "Counter, reception or shop front", material: "PLA or PETG", finish: "Matched to brand colours", tags: ["business"], blurb: "Your brand deserves better than a blurry logo on cheap paper. We turn flat vector marks into raised, weighted 3D signs for reception desks, feature walls and showroom counters.", uses: ["Reception walls", "Retail counters", "Exhibition booths"], care: "Send vector assets (SVG, AI, PDF) or high-res files. We match your Pantone or hex brand colours." },
  { slug: "rapid-prototype-print", name: "Rapid Prototype Print", cat: "Prototypes", price: "From KES 800", note: "Dimensional verification in your hands", material: "PLA, PETG or TPU", finish: "As printed or sanded", tags: ["parts", "business"], blurb: "Simulations lie. Physics does not. Hold your part, test bolt hole tolerances, check clearances, and catch design flaws before ordering tooling.", uses: ["Tolerance checks", "Fit testing", "Investor demos"], care: "Send STEP, STL or 3MF. We verify manifold geometry and wall thickness before slicing." },
  { slug: "stem-learning-models", name: "STEM Learning Models", cat: "Education", price: "From KES 600", note: "Geometry, mechanisms & anatomy", material: "PLA", finish: "Smooth, durable", tags: ["learn"], blurb: "Physical mechanics you can disassemble: planetary gearboxes, crystal lattices, and anatomical cross-sections that make abstract physics obvious.", uses: ["Classrooms", "Makerspaces", "Science clubs"], care: "Curriculum-aligned bulk sets available on request." },
  { slug: "custom-petg-bracket", name: "Custom PETG Bracket", cat: "Parts", price: "From KES 700", note: "Engineered to load specifications", material: "PETG", finish: "Functional", tags: ["parts"], blurb: "Structural mounting brackets printed in chemical and UV-resistant PETG, oriented along the stress axis for maximum layer adhesion.", uses: ["Equipment mounting", "Vehicle brackets", "Industrial repairs"], care: "Send force load requirements and bolt dimensions." },
  { slug: "replacement-spare-parts", name: "Replacement Spare Parts", cat: "Parts", price: "From KES 500", note: "Gears, brackets, clips & knobs", material: "PLA, PETG or TPU", finish: "Functional engineering grade", tags: ["parts"], blurb: "Manufacturers want you to discard a perfectly good machine because a 50-shilling nylon gear broke. We disagree. Send the broken fragment.", uses: ["Appliances", "Workshop machinery", "Vehicle trim"], care: "Bring or courier the broken original so we can gauge dimensions with vernier calipers." },
  { slug: "articulated-flexi-dragon", name: "Articulated Flexi Dragon", cat: "Toys & fun", price: "KES 900", note: "Moves and twists like a toy", material: "PLA", finish: "Smooth, glossy colours", tags: ["gift"], blurb: "A dragon with a bendy, jointed body, printed in one piece. It wiggles, twists and makes a great gift.", uses: ["Children's gifts", "Desk fidget", "Party prizes"], care: "Pick your colours when you order." },
];

// Your own photos win automatically: drop <slug>-1.jpg, <slug>-2.jpg (jpg/jpeg/png/webp/avif) into public/products/.
const ownDir = path.join(process.cwd(), "public", "products");
const ownFiles = fs.existsSync(ownDir) ? fs.readdirSync(ownDir) : [];
export const products = stock.map((p) => {
  const own = ownFiles.filter((f) => new RegExp(`^${p.slug}-\\d+\\.(jpe?g|png|webp|avif)$`, "i").test(f)).sort().map((f) => `/products/${f}`);
  return { ...p, photos: own };
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

export const faqs = [
  { group: "Ordering", q: "How do I get a quote?", a: "Message us on WhatsApp with your idea, a photo or your 3D model. We look at the size, how it will print, the material and the finish, then send your quote in KES." },
  { group: "Ordering", q: "I don't have a 3D model. Can you make one?", a: "Yes. Share a sketch, photos, measurements, or the part you want copied. Design work is billed separately and paid before we send the full print quote, which comes once the design is finished." },
  { group: "Ordering", q: "Which file types can I send?", a: "STL, OBJ, STEP and 3MF. STEP is best when dimensions must be exact. If you only have a sketch or a photo, send that and we will take it from there." },
  { group: "Ordering", q: "Can I change the size, colour or design?", a: "Message us with what you would like and we will confirm what is possible and the price. Custom work is quoted after we assess your request." },
  { group: "Ordering", q: "How big can a print be?", a: "Tell us the size you need and we will confirm. Larger objects can often be printed in sections and joined together." },
  { group: "Payment", q: "How do I pay?", a: "By M-Pesa. Design work is paid before we issue the print quote. Custom print jobs usually need a deposit before printing starts, with the balance due before dispatch." },
  { group: "Payment", q: "How is a print priced?", a: "By the material used and the print time, plus finishing and quantity. We confirm your price after we have assessed what you need." },
  { group: "Payment", q: "Are the prices in the shop final?", a: "Shop prices are a guide. Custom work and any changes are quoted after we assess your request, so you always know the price before you commit." },
  { group: "Payment", q: "Is it cheaper to order in bulk?", a: "Usually, yes. Larger batches cost less per piece, so ask about batch pricing for events, teams and shops." },
  { group: "Delivery", q: "Do you deliver?", a: "Yes. We send by courier or parcel service to Nairobi, Mombasa, Kisumu, Nakuru and other towns. Delivery is charged at cost." },
  { group: "Delivery", q: "Can I collect in Eldoret?", a: "Yes, collection in Eldoret is free and by appointment. Please message us first so we can have it ready." },
  { group: "Delivery", q: "How long will my order take?", a: "We confirm timing when we send your quote, based on the size, the material, the finish and our print queue." },
  { group: "Materials & care", q: "Which material should I choose?", a: "Not sure? Tell us what it is for and where it will live, and we will suggest one. PLA suits gifts and décor, PETG suits everyday and outdoor parts, and TPU is for flexible pieces." },
  { group: "Materials & care", q: "How do I look after my print?", a: "Keep PLA away from hot cars and direct sun for long periods. Wipe with a damp cloth. Prints are not watertight unless we made them to be, so check with us for anything that must hold liquid." },
];

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
