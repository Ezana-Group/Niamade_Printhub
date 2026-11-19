import { defineField, defineType } from 'sanity'

export const contactInquiryType = defineType({
  name: 'contactInquiry',
  title: 'Contact & Quote Requests',
  type: 'document',
  icon: () => '💬',

  fields: [
    defineField({
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone / WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'service',
      title: 'Service Requested',
      type: 'string',
    }),
    defineField({
      name: 'material',
      title: 'Preferred Material',
      type: 'string',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'message',
      title: 'Project Details / Message',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🟡 New / Unread', value: 'new' },
          { title: '🟢 Replied / In Progress', value: 'replied' },
          { title: '⚪ Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'createdAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      service: 'service',
      status: 'status',
      createdAt: 'createdAt',
    },
    prepare({ title, service, status, createdAt }) {
      const statusIcon = status === 'new' ? '🟡' : status === 'replied' ? '🟢' : '⚪'
      const date = createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : ''
      return {
        title: `${title || 'Unnamed Customer'}`,
        subtitle: `${statusIcon} ${service || 'Quote Request'} • ${date}`,
      }
    },
  },
})
