import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Business & Brand Settings',
  type: 'document',
  icon: () => '⚙️',

  // ── FIELD GROUPS (tabs) ──────────────────────────────────────────
  groups: [
    { name: 'identity',   title: '🏢 Business Info',    default: true },
    { name: 'contact',    title: '📞 Contact & Hours'  },
    { name: 'brand',      title: '🎨 Logos & Brand'    },
    { name: 'socials',    title: '📣 Social Media'      },
    { name: 'messages',   title: '💬 WhatsApp Messages' },
    { name: 'payments',   title: '💳 Payments & Checkout' },
    { name: 'site',       title: '🌐 Site & Banners'    },
  ],

  fields: [
    // ─── 🏢 BUSINESS IDENTITY ──────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Commercial Brand Name',
      type: 'string',
      group: 'identity',
      description: 'The public-facing brand — e.g. PrintHub Africa',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'businessName',
      title: 'Registered Legal Entity',
      type: 'string',
      group: 'identity',
      description: 'The legal/registered name — e.g. Niamade Hub',
    }),
    defineField({
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'string',
      group: 'identity',
      description: 'Short one-liner shown in SEO & social share — e.g. "3D printing in Eldoret, Kenya"',
    }),

    // ─── 📞 CONTACT & HOURS ────────────────────────────────────────
    defineField({
      name: 'phone',
      title: 'Phone Number (Display)',
      type: 'string',
      group: 'contact',
      description: 'e.g. +254 792 732 929',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number (Digits Only)',
      type: 'string',
      group: 'contact',
      description: 'e.g. 254792732929 — no spaces, no +',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
      description: 'e.g. hello@printhub.africa',
    }),
    defineField({
      name: 'city',
      title: 'City & Studio Location',
      type: 'string',
      group: 'contact',
      description: 'e.g. Eldoret, Kenya',
    }),
    defineField({
      name: 'hours',
      title: 'Operating Hours',
      type: 'array',
      group: 'contact',
      of: [{ type: 'string' }],
      description: 'e.g. "Mon–Fri: 8am – 6pm", "Sat: 9am – 4pm", "Sun: Closed"',
    }),

    // ─── 🎨 LOGOS & BRAND ASSETS ──────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Primary Logo (Horizontal, for Header)',
      type: 'image',
      group: 'brand',
      description: 'Main horizontal logo displayed in the site header — use a transparent PNG',
    }),
    defineField({
      name: 'logoDark',
      title: 'Dark Background Logo (White, for Footer)',
      type: 'image',
      group: 'brand',
      description: 'White/inverted version for dark backgrounds and the footer',
    }),
    defineField({
      name: 'logoMark',
      title: 'Brand Mark / Icon (Square)',
      type: 'image',
      group: 'brand',
      description: 'Square emblem/icon used in the About section and browser favicon',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (Open Graph)',
      type: 'image',
      group: 'brand',
      description: '1200×630 px image shown when site links are shared on WhatsApp, Facebook, LinkedIn, Twitter',
    }),

    // ─── 📣 SOCIAL MEDIA ──────────────────────────────────────────
    defineField({
      name: 'socials',
      title: 'Social Media Links',
      type: 'object',
      group: 'socials',
      description: 'Full URLs for each platform — displayed in the site footer and About page',
      fields: [
        { name: 'instagram',      type: 'string', title: 'Instagram',             description: 'e.g. https://www.instagram.com/printhub.africa' },
        { name: 'threads',        type: 'string', title: 'Threads',               description: 'e.g. https://www.threads.com/@printhub.africa' },
        { name: 'tiktok',         type: 'string', title: 'TikTok',                description: 'e.g. https://www.tiktok.com/@printhub_africa' },
        { name: 'youtube',        type: 'string', title: 'YouTube',               description: 'e.g. https://www.youtube.com/@PrinthubAfrica' },
        { name: 'facebook',       type: 'string', title: 'Facebook',              description: 'e.g. https://www.facebook.com/printhub.africa' },
        { name: 'linkedin',       type: 'string', title: 'LinkedIn',              description: 'e.g. https://www.linkedin.com/company/printhub-africa' },
        { name: 'googleBusiness', type: 'string', title: 'Google Business Profile', description: 'Your Google Maps / Business listing URL' },
      ],
    }),

    // ─── 💬 WHATSAPP MESSAGES ──────────────────────────────────────
    defineField({
      name: 'whatsappMessages',
      title: 'WhatsApp Message Templates',
      type: 'object',
      group: 'messages',
      description: 'Customize the pre-filled text for each WhatsApp button across the site. Leave blank to use the site defaults.',
      fields: [
        {
          name: 'general',
          type: 'string',
          title: '💬 Default / Header / Floating Button',
          description: 'Default: "Hi PrintHub, I\'d like to ask about a 3D print."',
        },
        {
          name: 'customFile',
          type: 'string',
          title: '📁 Custom Orders — Has a 3D File',
          description: 'Default: "Hi PrintHub, I have a 3D file ready for slicing analysis and quote."',
        },
        {
          name: 'customIdea',
          type: 'string',
          title: '💡 Custom Orders — Idea Only',
          description: 'Default: "Hi PrintHub, I have an idea and need it designed and manufactured."',
        },
        {
          name: 'business',
          type: 'string',
          title: '🏢 For Business Page',
          description: 'Default: "Hi PrintHub, I need a quote for custom business pieces."',
        },
        {
          name: 'help',
          type: 'string',
          title: '❓ Help & FAQs Page',
          description: 'Default: "Hi PrintHub, I have a question."',
        },
      ],
    }),

    // ─── 💳 PAYMENTS & CHECKOUT ───────────────────────────────────
    defineField({
      name: 'enableCheckout',
      title: 'Enable Online Checkout (M-Pesa & Card)',
      type: 'boolean',
      group: 'payments',
      description: 'When ON: products with a fixed KES price show a "Pay with M-Pesa / Card" button. When OFF: all orders go via WhatsApp.',
      initialValue: true,
    }),
    defineField({
      name: 'paystackPublicKey',
      title: 'Paystack Public Key',
      type: 'string',
      group: 'payments',
      description: 'Paste your Paystack Public Key here (starts with pk_live_ or pk_test_). Get it from Paystack Dashboard → Settings → API Keys & Webhooks. Leave empty to route all checkout orders to WhatsApp instead.',
    }),

    // ─── 🌐 SITE & BANNERS ────────────────────────────────────────
    defineField({
      name: 'announcement',
      title: 'Top Announcement Banner',
      type: 'object',
      group: 'site',
      fields: [
        {
          name: 'enabled',
          type: 'boolean',
          title: 'Enable Banner',
          description: 'Toggle the announcement bar on/off — changes are live within minutes',
        },
        {
          name: 'text',
          type: 'string',
          title: 'Banner Message',
          description: 'e.g. "Free delivery in Eldoret on orders over KES 3,000 🎉"',
        },
        {
          name: 'link',
          type: 'string',
          title: 'Banner Link URL (optional)',
          description: 'e.g. /shop — clicking the banner takes the user here',
        },
      ],
    }),
  ],
})
