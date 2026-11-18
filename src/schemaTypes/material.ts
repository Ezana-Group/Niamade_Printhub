import { defineField, defineType } from 'sanity'

export const materialType = defineType({
  name: 'material',
  title: 'Materials Guide',
  type: 'document',
  icon: () => '🧪',
  fields: [
    defineField({
      name: 'name',
      title: 'Material Name / Abbreviation',
      type: 'string',
      description: 'e.g. PLA, PETG, TPU, PVA',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fullName',
      title: 'Full Chemical Name',
      type: 'string',
      description: 'e.g. Polylactic Acid',
    }),
    defineField({
      name: 'heatResistance',
      title: 'Heat Resistance',
      type: 'string',
      description: 'e.g. 55°C, 75°C, 80°C',
    }),
    defineField({
      name: 'finish',
      title: 'Surface Finish',
      type: 'string',
      description: 'e.g. Crisp detail, vivid colours',
    }),
    defineField({
      name: 'durability',
      title: 'Durability Profile',
      type: 'string',
      description: 'e.g. High impact, UV-stable',
    }),
    defineField({
      name: 'bestFor',
      title: 'Best Applications',
      type: 'string',
      description: 'e.g. Display models, gifts, desk decor, brackets',
    }),
    defineField({
      name: 'sampleImage',
      title: 'Sample Print Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo showing this material in action',
    }),
    defineField({
      name: 'tone',
      title: 'Card Colour Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Peach', value: 'peach' },
          { title: 'Sky Blue', value: 'sky' },
          { title: 'Mint', value: 'mint' },
          { title: 'Lilac', value: 'lilac' },
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
      title: 'name',
      subtitle: 'bestFor',
      media: 'sampleImage',
    },
  },
})
