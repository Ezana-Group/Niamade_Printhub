import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Product Categories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'e.g. Home & decor, Desk & tech, Kenya souvenirs',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
    defineField({
      name: 'discountNote',
      title: 'Category Promo / Discount Note',
      type: 'string',
      description: 'e.g. 15% off bulk corporate orders, or Seasonal promo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
