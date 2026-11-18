import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Business & Brand Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'name',
      title: 'Commercial Brand Name',
      type: 'string',
      description: 'e.g. PrintHub Africa',
    }),
    defineField({
      name: 'businessName',
      title: 'Registered Legal Entity',
      type: 'string',
      description: 'e.g. Niamade Hub',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number (Display)',
      type: 'string',
      description: 'e.g. +254 792 732 929',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number (Digits Only)',
      type: 'string',
      description: 'e.g. 254792732929',
    }),
    defineField({
      name: 'whatsappMessages',
      title: 'WhatsApp Message Templates',
      type: 'object',
      description: 'Customize the default prefilled text when customers click WhatsApp buttons across the site',
      fields: [
        {
          name: 'general',
          type: 'string',
          title: 'Default / Header / Floating Button Message',
          description: 'Default: "Hi PrintHub, I\'d like to ask about a 3D print."',
        },
        {
          name: 'customFile',
          type: 'string',
          title: 'Custom Orders (Has File) Button',
          description: 'Default: "Hi PrintHub, I have a 3D file ready for slicing analysis and quote."',
        },
        {
          name: 'customIdea',
          type: 'string',
          title: 'Custom Orders (Idea Only) Button',
          description: 'Default: "Hi PrintHub, I have an idea and need it designed and manufactured."',
        },
        {
          name: 'business',
          type: 'string',
          title: 'For Business Page Button',
          description: 'Default: "Hi PrintHub, I need a quote for custom business pieces."',
        },
        {
          name: 'help',
          type: 'string',
          title: 'Help & FAQs Button',
          description: 'Default: "Hi PrintHub, I have a question."',
        },
      ],
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'e.g. hello@printhub.africa',
    }),
    defineField({
      name: 'city',
      title: 'City & Studio Location',
      type: 'string',
      description: 'e.g. Eldoret, Kenya',
    }),
    defineField({
      name: 'hours',
      title: 'Operating Hours',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    // ── BRAND LOGOS & SOCIAL ASSETS ──
    defineField({
      name: 'logo',
      title: 'Primary Logo (Horizontal, for Header)',
      type: 'image',
      description: 'Main horizontal logo displayed in the site header',
    }),
    defineField({
      name: 'logoDark',
      title: 'Dark Background Logo (White, for Footer)',
      type: 'image',
      description: 'White/inverted logo displayed on dark backgrounds and the footer',
    }),
    defineField({
      name: 'logoMark',
      title: 'Brand Mark / Icon (Square)',
      type: 'image',
      description: 'Square emblem/mark used in the About section and favicon',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (Open Graph)',
      type: 'image',
      description: '1200x630 image displayed when links are shared on WhatsApp, Facebook, LinkedIn',
    }),
    // ── ANNOUNCEMENTS & SOCIALS ──
    defineField({
      name: 'announcement',
      title: 'Top Announcement Banner',
      type: 'object',
      fields: [
        { name: 'enabled', type: 'boolean', title: 'Enable Announcement Banner' },
        { name: 'text', type: 'string', title: 'Banner Text (e.g. Free delivery in Eldoret on orders over KES 3,000)' },
        { name: 'link', type: 'string', title: 'Banner Link URL (optional)' },
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'string', title: 'Instagram URL' },
        { name: 'tiktok', type: 'string', title: 'TikTok URL' },
        { name: 'facebook', type: 'string', title: 'Facebook URL' },
        { name: 'googleBusiness', type: 'string', title: 'Google Business Profile URL' },
      ],
    }),
  ],
})
