import { defineField, defineType } from 'sanity'

export const pageContentType = defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'Home Page', value: 'home' },
          { title: 'About Us', value: 'about' },
          { title: 'Custom Orders', value: 'custom' },
          { title: 'For Business', value: 'for-business' },
          { title: 'Help / FAQs', value: 'help' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    // ── HERO CONTENT ──
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading (H1)',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Subtext / Lead Paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Page Hero / Feature Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Primary visual associated with this page',
    }),
    // ── HOME PAGE CURATION ──
    defineField({
      name: 'featuredProducts',
      title: '⭐ Home Page Featured Products ("Good places to start")',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Handpick and drag to reorder products displayed on the Home Page. If empty, products with "Feature on Home Page" toggled or standard defaults will be shown.',
      hidden: ({ document }) => document?.page !== 'home',
    }),
    defineField({
      name: 'featuredCategories',
      title: '🏷️ Home Page Featured Categories ("Shop by occasion")',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'occasion' }, { type: 'category' }] }
      ],
      description: 'Choose which occasion/category collections are shown on the home page.',
      hidden: ({ document }) => document?.page !== 'home',
    }),
    // ── ABOUT CONTENT ──
    defineField({
      name: 'niamadeHubBlurb',
      title: 'About Niamade Hub',
      type: 'text',
      rows: 4,
      description: 'About page: description of the registered corporate entity',
    }),
    defineField({
      name: 'brandBlurb',
      title: 'About PrintHub Africa',
      type: 'text',
      rows: 4,
      description: 'About page: description of the commercial trading brand',
    }),
    defineField({
      name: 'values',
      title: 'Company Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Value Title' },
            { name: 'description', type: 'text', title: 'Description' },
            {
              name: 'tone',
              type: 'string',
              title: 'Card Tone',
              options: {
                list: [
                  { title: 'Peach', value: 'bg-peach' },
                  { title: 'Sky Blue', value: 'bg-sky' },
                  { title: 'Mint', value: 'bg-mint' },
                  { title: 'Lilac', value: 'bg-lilac' },
                ],
              },
            },
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    }),
    // ── ORDER STEPS ──
    defineField({
      name: 'steps',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'step', type: 'string', title: 'Step Number (e.g. 01)' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description' },
          ],
          preview: { select: { title: 'title', subtitle: 'step' } },
        },
      ],
    }),
    // ── CTAS ──
    defineField({
      name: 'ctaHeading',
      title: 'Call to Action Heading',
      type: 'string',
    }),
    defineField({
      name: 'ctaBody',
      title: 'Call to Action Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'waMessage',
      title: 'Page WhatsApp Message (Optional)',
      type: 'string',
      description: 'Prefilled WhatsApp message when users click buttons on this page',
    }),
  ],
  preview: {
    select: {
      title: 'page',
      subtitle: 'heroHeading',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }) {
      const labels: Record<string, string> = {
        home: 'Home Page',
        about: 'About Us',
        custom: 'Custom Orders',
        'for-business': 'For Business',
        help: 'Help / FAQs',
        contact: 'Contact',
      }
      return {
        title: labels[title] || title,
        subtitle: subtitle || '',
        media,
      }
    },
  },
})
