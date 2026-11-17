import { defineField, defineType } from 'sanity'

export const pageContentType = defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
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
    // ── ABOUT CONTENT ──
    defineField({
      name: 'niamadeHubBlurb',
      title: 'About Niamade Hub',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'About page: description of the registered corporate entity (rich text)',
    }),
    defineField({
      name: 'brandBlurb',
      title: 'About PrintHub Africa',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'About page: description of the commercial trading brand (rich text)',
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
