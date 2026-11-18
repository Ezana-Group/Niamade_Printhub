import { defineField, defineType } from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Services & Capabilities',
  type: 'document',
  icon: () => '🛠️',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Service Category',
      type: 'string',
      options: {
        list: [
          { title: '3D Printing & Manufacturing', value: 'printing' },
          { title: '3D CAD Design & Modeling', value: 'design' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sampleImage',
      title: 'Sample Work Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Image showing an example of this service',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'sampleImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === 'printing' ? '3D Printing' : 'CAD Design',
        media,
      }
    },
  },
})
