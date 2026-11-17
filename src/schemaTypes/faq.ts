import { defineField, defineType } from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'group',
      title: 'Group / Category',
      type: 'string',
      description: 'e.g. Ordering, Payment, Delivery, Materials & care, or type any category you want',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 4', value: 'h4' },
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
                title: 'URL',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
      ],
      description: 'Rich text answer: supports bold, italic, links, and bullet lists',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'group',
    },
  },
})
