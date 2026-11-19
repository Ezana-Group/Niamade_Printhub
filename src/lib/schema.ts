/**
 * Canonical Schema.org JSON-LD graph builder for PrintHub Africa.
 * Ensures consistent entity identity across search engines and AI answer engines.
 */
import { site, products, price } from "../data/site";

export const ids = {
  website: `${site.url}/#website`,
  business: `${site.url}/#business`,
  parentOrg: `${site.url}/#niamade-hub`,
};

// Compute dynamic priceRange from the catalogue
const numericPrices = products
  .map((p) => price(p.price))
  .filter((n): n is number => typeof n === "number" && !isNaN(n) && n > 0);

const minPrice = numericPrices.length ? Math.min(...numericPrices) : 300;
const maxPrice = numericPrices.length ? Math.max(...numericPrices) : 15000;
export const cataloguePriceRange = `KES ${minPrice.toLocaleString()} - KES ${maxPrice.toLocaleString()}`;

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const parentOrganizationNode = {
  "@type": "Organization",
  "@id": ids.parentOrg,
  name: "Niamade Hub",
  url: site.url,
  description: "Parent company of PrintHub Africa, delivering innovative design, 3D printing, technology and custom manufacturing solutions.",
};

export const businessNode = {
  "@type": "LocalBusiness",
  "@id": ids.business,
  name: "PrintHub Africa",
  legalName: "Niamade Hub",
  alternateName: ["PrintHub", "PrintHub Kenya", "PrintHub Africa — A Niamade Hub Company"],
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/og.png`,
  logo: `${site.url}/logo.png`,
  priceRange: cataloguePriceRange,
  currenciesAccepted: "KES",
  paymentAccepted: ["M-Pesa", "Cash"],
  description: "Made-to-order 3D printing studio in Eldoret, Kenya by PrintHub Africa (a Niamade Hub company). Personalised gifts, branded business pieces, souvenirs and custom engineering parts with delivery across Kenya.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Eldoret",
    addressRegion: "Uasin Gishu County",
    addressCountry: "KE",
  },
  openingHoursSpecification: site.hoursSpec.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days.map((d) => daysOfWeek[d]),
    opens: h.open,
    closes: h.close,
  })),
  areaServed: [
    { "@type": "Country", name: "Kenya" },
    { "@type": "AdministrativeArea", name: "Uasin Gishu County" },
  ],
  parentOrganization: {
    "@id": ids.parentOrg,
  },
  sameAs: [site.googleBusinessProfile, ...site.socials.map((s) => s.href)],
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": ids.website,
  name: "PrintHub Africa",
  alternateName: ["PrintHub", "PrintHub Kenya"],
  url: site.url,
  inLanguage: "en-KE",
  description: "Custom made-to-order 3D printing, CAD design, and dimensional fabrication in Eldoret, Kenya by Niamade Hub.",
  publisher: {
    "@id": ids.business,
  },
};

/**
 * Strips HTML tags from strings for clean schema descriptions
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

/**
 * Strips any per-node `@context` to guarantee clean single-context `@graph` output
 */
function cleanNode(node: any): any {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(cleanNode);
  const copy: Record<string, any> = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "@context") continue;
    copy[k] = cleanNode(v);
  }
  return copy;
}

/**
 * Combines core site nodes with page-specific nodes into a single Schema.org @graph.
 */
export function buildSchemaGraph(pageNodes: any[] = []): Record<string, any> {
  const flattened = pageNodes.flatMap((n) => (Array.isArray(n) ? n : [n])).filter(Boolean);
  const cleanedPageNodes = flattened.map(cleanNode);

  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode, parentOrganizationNode, businessNode, ...cleanedPageNodes],
  };
}

/**
 * Helpers for standard page schema nodes
 */
export function breadcrumbNode(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productSchemaNode(p: any) {
  const num = price(p.price);
  const isFrom = p.price?.startsWith("From");
  const abs = (u: string) => (u.startsWith("/") ? site.url + u : u);
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const priceValidUntil = nextYear.toISOString().split("T")[0];

  const offers: Record<string, any> = {
    "@type": isFrom ? "AggregateOffer" : "Offer",
    priceCurrency: "KES",
    priceValidUntil,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    url: `${site.url}/shop/${p.slug}/`,
    seller: {
      "@id": ids.business,
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: "KES",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "KE",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 3,
          unitCode: "d",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 3,
          unitCode: "d",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "KE",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: `${site.url}/terms/`,
    },
  };

  if (num) {
    if (isFrom) {
      offers.lowPrice = num;
      offers.offerCount = 1;
    } else {
      offers.price = num;
    }
  }

  return {
    "@type": "Product",
    "@id": `${site.url}/shop/${p.slug}/#product`,
    name: p.name,
    sku: p.slug,
    url: `${site.url}/shop/${p.slug}/`,
    description: stripHtml(p.blurb || p.note || ""),
    category: p.cat,
    material: p.material,
    image: p.photos && p.photos.length ? p.photos.map(abs) : [`${site.url}/og.png`],
    brand: {
      "@type": "Brand",
      name: "PrintHub Africa",
    },
    manufacturer: {
      "@id": ids.business,
    },
    offers: num ? offers : undefined,
  };
}
