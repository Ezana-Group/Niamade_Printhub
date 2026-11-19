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
    { name: 'bookings',   title: '📅 Bookings & Easy!Appointments' },
    { name: 'brand',      title: '🎨 Logos & Brand'    },
    { name: 'socials',    title: '📣 Social Media'      },
    { name: 'messages',   title: '💬 WhatsApp Messages' },
    { name: 'payments',   title: '💳 Payments & Checkout' },
    { name: 'shipping',   title: '🚚 Delivery & Rates' },
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
      title: 'Public General Inquiries Email',
      type: 'string',
      group: 'contact',
      description: 'e.g. hello@printhub.africa — shown in header/footer and on the contact page',
      initialValue: 'hello@printhub.africa',
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Bookings & Consultation Email',
      type: 'string',
      group: 'contact',
      description: 'The email address where consultation and studio booking notifications are sent (defaults to booking@printhub.africa)',
      initialValue: 'booking@printhub.africa',
    }),
    defineField({
      name: 'quotesEmail',
      title: 'Custom 3D Quotes & CAD Orders Email',
      type: 'string',
      group: 'contact',
      description: 'The email address where 3D file uploads and quote inquiries are sent (defaults to quotes@printhub.africa)',
      initialValue: 'quotes@printhub.africa',
    }),
    defineField({
      name: 'privacyEmail',
      title: 'Data Protection & Legal Email',
      type: 'string',
      group: 'contact',
      description: 'The email address for KDPA compliance and CAD confidentiality requests (defaults to privacy@printhub.africa)',
      initialValue: 'privacy@printhub.africa',
    }),
    defineField({
      name: 'notificationEmail',
      title: 'Admin Notification Email',
      type: 'string',
      group: 'contact',
      description: 'The primary admin email address where all new customer quote inquiries and general alerts are delivered.',
      initialValue: 'booking@printhub.africa',
    }),
    defineField({
      name: 'resendApiKey',
      title: 'Email Dispatcher API Key (Resend.com)',
      type: 'string',
      group: 'contact',
      description: 'Optional: Paste your free API key from https://resend.com (starts with re_...). When filled in, every booking and contact message triggers an instant email to your inbox automatically.',
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

    // ─── 📅 BOOKINGS & EASY!APPOINTMENTS ──────────────────────────
    defineField({
      name: 'easyAppointmentsUrl',
      title: 'Easy!Appointments Installation URL',
      type: 'url',
      group: 'bookings',
      description: 'URL where your Easy!Appointments PHP instance is hosted (e.g. https://booking.printhub.africa or https://appointments.printhub.africa). If set, this enables direct synchronization and iframe embed options.',
    }),
    defineField({
      name: 'enableEasyAppointmentsEmbed',
      title: 'Show Embedded Easy!Appointments Scheduler',
      type: 'boolean',
      group: 'bookings',
      initialValue: false,
      description: 'When ON: customers on /bookings can view and use the embedded Easy!Appointments iframe directly. When OFF: customers use the fast, native PrintHub booking form.',
    }),
    defineField({
      name: 'bookingNotice',
      title: 'Booking Banner / Notice',
      type: 'string',
      group: 'bookings',
      description: 'Optional note shown at the top of the /bookings page (e.g. "Appointments in Eldoret require at least 2 hours notice. Virtual consultations are confirmed on WhatsApp.")',
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
    defineField({
      name: 'mpesaTillNumber',
      title: 'M-Pesa Till Number (Buy Goods)',
      type: 'string',
      group: 'payments',
      description: 'Your Safaricom Buy Goods Till Number — shown to customers as a manual payment fallback when STK Push fails. e.g. 5012345',
    }),
    defineField({
      name: 'mpesaPaybillNumber',
      title: 'M-Pesa Paybill Number',
      type: 'string',
      group: 'payments',
      description: 'Your Safaricom Paybill business number — if you use Paybill instead of or alongside a Till. e.g. 522522 (Equity)',
    }),
    defineField({
      name: 'mpesaAccountName',
      title: 'M-Pesa Paybill Account Name',
      type: 'string',
      group: 'payments',
      description: 'The account name customers enter when paying via Paybill. e.g. PrintHub or your phone number. Leave blank if using Till only.',
    }),
    defineField({
      name: 'mpesaBusinessName',
      title: 'M-Pesa Business / Till Display Name',
      type: 'string',
      group: 'payments',
      description: 'The name that appears on the customer\'s M-Pesa confirmation SMS — usually your registered Safaricom business name. e.g. NIAMADE HUB',
      initialValue: 'NIAMADE HUB',
    }),

    // ─── 🚚 DELIVERY & SHIPPING RATES ───────────────────────────────
    defineField({
      name: 'deliveryRates',
      title: 'City & Regional Delivery Pricing',
      type: 'array',
      group: 'shipping',
      description: 'Define delivery fees per town or county. When a customer selects their town during checkout, the shipping fee is automatically calculated and added to the M-Pesa/Card total.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'city',
              title: 'City / Region Name',
              type: 'string',
              description: 'e.g. Nairobi, Eldoret Town, Mombasa, Kisumu, Nakuru, Rest of Kenya',
              validation: (rule: any) => rule.required(),
            },
            {
              name: 'fee',
              title: 'Delivery Fee in KES',
              type: 'number',
              description: 'Enter 0 for free pickup/delivery. e.g. 350',
              validation: (rule: any) => rule.required().min(0),
            },
            {
              name: 'estimatedDays',
              title: 'Estimated Delivery Time',
              type: 'string',
              description: 'e.g. Next day, 1–2 business days',
            },
            {
              name: 'isPickup',
              title: 'Is Studio / In-Person Pickup',
              type: 'boolean',
              description: 'Toggle on if this is in-person collection at the Eldoret studio (fee will be KES 0)',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'city',
              fee: 'fee',
              days: 'estimatedDays',
              isPickup: 'isPickup',
            },
            prepare({ title, fee, days, isPickup }: any) {
              const feeStr = fee === 0 ? 'FREE' : `KES ${fee?.toLocaleString() || '0'}`;
              return {
                title: `${title || 'City'} — ${feeStr}`,
                subtitle: `${isPickup ? '📍 Studio Pickup' : '🚚 Courier'} ${days ? `· ${days}` : ''}`,
              };
            },
          },
        },
      ],
      initialValue: [
        { city: 'Eldoret Studio Pickup (Free)', fee: 0, estimatedDays: 'Ready in 24–48h', isPickup: true },
        { city: 'Eldoret Town Delivery', fee: 150, estimatedDays: 'Same day after printing', isPickup: false },
        { city: 'Nairobi', fee: 350, estimatedDays: '1 business day (Courier)', isPickup: false },
        { city: 'Nakuru / Central Kenya', fee: 350, estimatedDays: '1–2 business days', isPickup: false },
        { city: 'Kisumu / Western Kenya', fee: 350, estimatedDays: '1–2 business days', isPickup: false },
        { city: 'Mombasa / Coast', fee: 450, estimatedDays: '2 business days', isPickup: false },
        { city: 'Rest of Kenya (Other Counties)', fee: 400, estimatedDays: '2–3 business days', isPickup: false },
      ],
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
