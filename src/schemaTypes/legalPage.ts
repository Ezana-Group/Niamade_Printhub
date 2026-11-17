import { defineField, defineType } from 'sanity'

export const legalPageType = defineType({
  name: 'legalPage',
  title: 'Legal Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      description: 'e.g. "terms" for /terms/ or "privacy" for /privacy/',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g. "Registered Business: Niamade Hub · Brand: PrintHub Africa"',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated Date',
      type: 'string',
      description: 'e.g. "November 17, 2026"',
    }),
    defineField({
      name: 'noticeBanner',
      title: 'Notice Banner',
      type: 'text',
      rows: 3,
      description: 'Highlighted callout box at the top of the page',
    }),
    defineField({
      name: 'sections',
      title: 'Policy Sections',
      type: 'array',
      description: 'The clauses/articles of the agreement or policy',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Section Title' },
            {
              name: 'content',
              type: 'array',
              title: 'Clause Content',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'Heading 3', value: 'h3' },
                  ],
                  lists: [
                    { title: 'Bullet List', value: 'bullet' },
                    { title: 'Numbered List', value: 'number' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Bold', value: 'strong' },
                      { title: 'Italic', value: 'em' },
                      { title: 'Underline', value: 'underline' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [{ name: 'href', type: 'url', title: 'URL' }],
                      },
                    ],
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'content' },
          },
        },
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `/${subtitle}/` }
    },
  },
})
