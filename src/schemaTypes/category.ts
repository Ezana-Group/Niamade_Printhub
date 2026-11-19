import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Product Categories',
  type: 'document',
  icon: () => '📁',
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
    defineField({
      name: 'featuredOnHome',
      title: '⭐ Feature on Home Page',
      type: 'boolean',
      description: 'Display this category on the home page under "Shop by occasion"',
      initialValue: false,
    }),
    defineField({
      name: 'homeTone',
      title: 'Home Card Color Tone',
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
      name: 'featuredImage',
      title: 'Category Image / Visual',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
