import { defineField, defineType } from 'sanity'

export const bookingType = defineType({
  name: 'booking',
  title: 'Customer Bookings',
  type: 'document',
  icon: () => '📅',

  groups: [
    { name: 'details', title: '📋 Booking Details', default: true },
    { name: 'customer', title: '👤 Customer Info' },
    { name: 'admin', title: '⚙️ Status & Internal Notes' },
  ],

  fields: [
    // ─── 📋 BOOKING DETAILS ─────────────────────────────────────────
    defineField({
      name: 'bookingRef',
      title: 'Booking Reference',
      type: 'string',
      group: 'details',
      description: 'Unique reference code (e.g. PH-BK-84210)',
      readOnly: false,
    }),
    defineField({
      name: 'service',
      title: 'Consultation / Service Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: '3D Print Feasibility & Slicing Check', value: '3D Print Feasibility & Slicing Check' },
          { title: 'Custom CAD Design & Modeling Session', value: 'Custom CAD Design & Modeling Session' },
          { title: 'Engineering Prototype & Parts Review', value: 'Engineering Prototype & Parts Review' },
          { title: 'In-Person Studio Visit (Eldoret)', value: 'In-Person Studio Visit (Eldoret)' },
          { title: 'Corporate / Bulk Print Consultation', value: 'Corporate / Bulk Print Consultation' },
          { title: 'General 3D Printing Inquiry', value: 'General 3D Printing Inquiry' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'appointmentDate',
      title: 'Appointment Date',
      type: 'date',
      group: 'details',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'appointmentTime',
      title: 'Appointment Time Slot',
      type: 'string',
      group: 'details',
      description: 'e.g. 10:00 AM, 02:30 PM (EAT / Africa/Nairobi)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'meetingType',
      title: 'Meeting Mode',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'In-Person Studio Visit (Eldoret)', value: 'in_person' },
          { title: 'WhatsApp Audio / Video Call', value: 'whatsapp' },
          { title: 'Google Meet', value: 'google_meet' },
          { title: 'Phone Call', value: 'phone' },
        ],
        layout: 'radio',
      },
      initialValue: 'whatsapp',
    }),
    defineField({
      name: 'duration',
      title: 'Estimated Duration (Minutes)',
      type: 'number',
      group: 'details',
      initialValue: 30,
    }),
    defineField({
      name: 'projectDetails',
      title: 'Project Requirements / Notes from Customer',
      type: 'text',
      group: 'details',
      rows: 4,
      description: 'Customer project description, dimensions, material preferences, or questions.',
    }),

    // ─── 👤 CUSTOMER INFO ──────────────────────────────────────────
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      group: 'customer',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'Phone / WhatsApp Number',
      type: 'string',
      group: 'customer',
      description: 'e.g. +254 792 732 929',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      group: 'customer',
      validation: (rule) => rule.email(),
    }),

    // ─── ⚙️ STATUS & ADMIN ─────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Booking Status',
      type: 'string',
      group: 'admin',
      options: {
        list: [
          { title: '⏳ Pending Confirmation', value: 'pending' },
          { title: '✅ Confirmed & Scheduled', value: 'confirmed' },
          { title: '🏁 Completed', value: 'completed' },
          { title: '❌ Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'adminNotes',
      title: 'Internal Studio Notes',
      type: 'text',
      group: 'admin',
      rows: 3,
      description: 'Private notes for PrintHub staff (slicing estimates, CAD files received, outcome).',
    }),
    defineField({
      name: 'easyAppointmentsId',
      title: 'Easy!Appointments ID / Hash',
      type: 'string',
      group: 'admin',
      description: 'Corresponding appointment ID from Easy!Appointments system if synced.',
    }),
    defineField({
      name: 'source',
      title: 'Lead Source',
      type: 'string',
      group: 'admin',
      options: {
        list: [
          { title: 'Website Booking Form (printhub.africa/bookings)', value: 'website' },
          { title: 'Easy!Appointments Direct', value: 'easyappointments' },
          { title: 'WhatsApp Direct', value: 'whatsapp' },
          { title: 'Phone / In-Person', value: 'manual' },
        ],
      },
      initialValue: 'website',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      group: 'admin',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  orderings: [
    {
      title: 'Appointment Date (Upcoming first)',
      name: 'appointmentDateAsc',
      by: [
        { field: 'appointmentDate', direction: 'asc' },
        { field: 'appointmentTime', direction: 'asc' },
      ],
    },
    {
      title: 'Created Date (Newest first)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'customerName',
      service: 'service',
      date: 'appointmentDate',
      time: 'appointmentTime',
      status: 'status',
      ref: 'bookingRef',
    },
    prepare({ title, service, date, time, status, ref }) {
      const statusEmoji: Record<string, string> = {
        pending: '⏳',
        confirmed: '✅',
        completed: '🏁',
        cancelled: '❌',
      }
      const emoji = statusEmoji[status as string] || '📅'
      const refTag = ref ? `[${ref}] ` : ''
      return {
        title: `${title || 'Unnamed Customer'} — ${service || 'General'}`,
        subtitle: `${emoji} ${refTag}${date || 'No date'} at ${time || 'TBD'} • ${(status || 'pending').toUpperCase()}`,
      }
    },
  },
})
