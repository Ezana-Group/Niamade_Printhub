import { defineField, defineType } from 'sanity'

export const occasionType = defineType({
  name: 'occasion',
  title: 'Occasions & Gift Guides',
  type: 'document',
  icon: () => '🏷️',
  fields: [
    defineField({
      name: 'label',
      title: 'Occasion Title',
      type: 'string',
      description: 'e.g. Birthdays & gifts, Kenya souvenirs',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagId',
      title: 'Tag Identifier',
      type: 'string',
      description: 'e.g. gift, events, business, kenya, home, learn, parts',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blurb',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Category Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Visual displayed on the occasion card on the home page',
    }),
    defineField({
      name: 'tone',
      title: 'Card Colour Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Lilac', value: 'lilac' },
          { title: 'Rose', value: 'rose' },
          { title: 'Butter', value: 'butter' },
          { title: 'Mint', value: 'mint' },
          { title: 'Peach', value: 'peach' },
          { title: 'Sky Blue', value: 'sky' },
          { title: 'Sand', value: 'sand' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'blurb',
      media: 'featuredImage',
    },
  },
})
