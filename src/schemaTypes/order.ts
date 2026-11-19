import { defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Shop Orders',
  type: 'document',
  icon: () => '🛍️',

  groups: [
    { name: 'overview',  title: '📋 Order',    default: true },
    { name: 'customer',  title: '👤 Customer'  },
    { name: 'payment',   title: '💳 Payment'   },
    { name: 'admin',     title: '⚙️ Fulfilment' },
  ],

  fields: [
    // ── ORDER ──────────────────────────────────────────────────────
    defineField({
      name: 'orderRef',
      title: 'Order Reference',
      type: 'string',
      group: 'overview',
      description: 'Unique order ID (e.g. PH-ORD-84210)',
      readOnly: true,
    }),
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'productSlug',
      title: 'Product Slug',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      group: 'overview',
      initialValue: 1,
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'colour',
      title: 'Colour',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'customNote',
      title: 'Customisation / Engraving Note',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'delivery',
      title: 'Delivery Town / Full Address',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'deliveryCity',
      title: 'Delivery City / Region',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'deliveryFeeKes',
      title: 'Delivery Fee (KES)',
      type: 'number',
      group: 'overview',
    }),
    defineField({
      name: 'subtotalKes',
      title: 'Items Subtotal (KES)',
      type: 'number',
      group: 'overview',
    }),
    defineField({
      name: 'amountKes',
      title: 'Total Amount Paid (KES)',
      type: 'number',
      group: 'overview',
    }),

    // ── CUSTOMER ───────────────────────────────────────────────────
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      group: 'customer',
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      group: 'customer',
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer Phone',
      type: 'string',
      group: 'customer',
    }),

    // ── PAYMENT ────────────────────────────────────────────────────
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      group: 'payment',
      options: {
        list: [
          { title: '⏳ Pending',   value: 'pending'   },
          { title: '✅ Paid',      value: 'paid'      },
          { title: '❌ Failed',    value: 'failed'    },
          { title: '↩️ Refunded',  value: 'refunded'  },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'paystackRef',
      title: 'Paystack Reference',
      type: 'string',
      group: 'payment',
      description: 'The reference returned by Paystack on successful payment',
      readOnly: true,
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid At',
      type: 'datetime',
      group: 'payment',
      readOnly: true,
    }),

    // ── FULFILMENT ─────────────────────────────────────────────────
    defineField({
      name: 'fulfilmentStatus',
      title: 'Fulfilment Status',
      type: 'string',
      group: 'admin',
      options: {
        list: [
          { title: '🕐 Queue',       value: 'queued'    },
          { title: '🖨️ Printing',    value: 'printing'  },
          { title: '✔️ Ready',       value: 'ready'     },
          { title: '🚚 Dispatched',  value: 'dispatched'},
          { title: '📦 Delivered',   value: 'delivered' },
        ],
        layout: 'radio',
      },
      initialValue: 'queued',
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      group: 'admin',
      rows: 3,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      group: 'admin',
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'orderRef',
      product: 'productName',
      status: 'paymentStatus',
      amount: 'amountKes',
      customer: 'customerName',
    },
    prepare({ title, product, status, amount, customer }) {
      const statusIcon: Record<string, string> = {
        pending: '⏳', paid: '✅', failed: '❌', refunded: '↩️',
      }
      return {
        title: `${statusIcon[status] || '❓'} ${title || 'No ref'} — ${product || 'Unknown product'}`,
        subtitle: `${customer || 'Unknown customer'} · KES ${amount?.toLocaleString() || '?'}`,
      }
    },
  },
})
