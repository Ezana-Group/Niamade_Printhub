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
      description: 'Unique order ID (e.g. PH-WA-84210). Auto-generated for new orders.',
      initialValue: () => `PH-WA-${Math.floor(10000 + Math.random() * 90000)}`,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orderSource',
      title: 'Order Source',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: '💬 WhatsApp Chat',           value: 'whatsapp' },
          { title: '🌐 Website Direct Checkout', value: 'website'  },
          { title: '🏢 Studio Walk-in / Phone',   value: 'studio'   },
        ],
        layout: 'radio',
      },
      initialValue: 'whatsapp',
    }),
    defineField({
      name: 'productName',
      title: 'Product / Custom Item Name',
      type: 'string',
      group: 'overview',
      placeholder: 'e.g. Kenya Map Keychain, Custom Architectural Model, etc.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productSlug',
      title: 'Product Slug (Optional)',
      type: 'string',
      group: 'overview',
      description: 'Slug from shop catalog if it matches an existing product.',
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
      title: 'Size / Dimensions',
      type: 'string',
      group: 'overview',
      placeholder: 'e.g. 15cm, Large, Standard',
    }),
    defineField({
      name: 'colour',
      title: 'Colour / Material',
      type: 'string',
      group: 'overview',
      placeholder: 'e.g. Matte Black PLA, Silk Gold PETG',
    }),
    defineField({
      name: 'customNote',
      title: 'Customisation / Engraving Note',
      type: 'string',
      group: 'overview',
      placeholder: 'e.g. Engrave "Amina & Kevin", 20% infill for durability',
    }),
    defineField({
      name: 'deliveryCity',
      title: 'Delivery City / Region',
      type: 'string',
      group: 'overview',
      placeholder: 'e.g. Nairobi, Eldoret, Mombasa, Kisumu, Nakuru',
    }),
    defineField({
      name: 'delivery',
      title: 'Full Delivery Address / Instructions',
      type: 'text',
      group: 'overview',
      rows: 2,
      placeholder: 'e.g. Westlands, Mpaka Rd, Woodvale Place, 3rd Floor, Suite 4B (Landmark: Opp Shell)',
    }),
    defineField({
      name: 'subtotalKes',
      title: 'Items Subtotal (KES)',
      type: 'number',
      group: 'overview',
      description: 'Price of the 3D printed items before delivery fee.',
    }),
    defineField({
      name: 'deliveryFeeKes',
      title: 'Delivery / Courier Fee (KES)',
      type: 'number',
      group: 'overview',
      description: 'Enter 0 if customer is picking up at Eldoret studio.',
      initialValue: 0,
    }),
    defineField({
      name: 'amountKes',
      title: 'Total Amount (KES)',
      type: 'number',
      group: 'overview',
      description: 'Total amount paid by customer (Subtotal + Delivery Fee).',
      validation: (rule) => rule.required(),
    }),

    // ── CUSTOMER ───────────────────────────────────────────────────
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      group: 'customer',
      placeholder: 'e.g. Brian Kiprono',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer Phone / WhatsApp Number',
      type: 'string',
      group: 'customer',
      description: 'Crucial for courier riders and delivery updates. e.g. 0712 345 678',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      group: 'customer',
      placeholder: 'e.g. brian@example.com (optional for WhatsApp orders)',
    }),

    // ── PAYMENT ────────────────────────────────────────────────────
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      group: 'payment',
      options: {
        list: [
          { title: '✅ Paid',          value: 'paid'      },
          { title: '⏳ Deposit Paid',  value: 'deposit'   },
          { title: '⏳ Pending',       value: 'pending'   },
          { title: '❌ Failed',        value: 'failed'    },
          { title: '↩️ Refunded',      value: 'refunded'  },
        ],
        layout: 'radio',
      },
      initialValue: 'paid',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method Used',
      type: 'string',
      group: 'payment',
      options: {
        list: [
          { title: '📱 M-Pesa Buy Goods Till', value: 'mpesa_till'    },
          { title: '📱 M-Pesa Paybill',        value: 'mpesa_paybill' },
          { title: '📱 M-Pesa Send Money',     value: 'mpesa_direct'  },
          { title: '💳 Paystack (Online)',     value: 'paystack'      },
          { title: '💵 Cash / Studio',         value: 'cash'          },
        ],
      },
      initialValue: 'mpesa_till',
    }),
    defineField({
      name: 'paystackRef',
      title: 'Transaction / M-Pesa Reference Code',
      type: 'string',
      group: 'payment',
      description: 'The M-Pesa transaction code (e.g. SHG749DJH2) or Paystack reference.',
      placeholder: 'e.g. SHG749DJH2',
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid At / Payment Date',
      type: 'datetime',
      group: 'payment',
      initialValue: () => new Date().toISOString(),
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
      title: 'Order Date & Time',
      type: 'datetime',
      group: 'admin',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: 'orderRef',
      product: 'productName',
      status: 'paymentStatus',
      amount: 'amountKes',
      customer: 'customerName',
      source: 'orderSource',
    },
    prepare({ title, product, status, amount, customer, source }: any) {
      const statusIcon: Record<string, string> = {
        pending: '⏳', paid: '✅', deposit: '⏳', failed: '❌', refunded: '↩️',
      };
      const sourceIcon: Record<string, string> = {
        whatsapp: '💬 WhatsApp',
        website: '🌐 Web',
        studio: '🏢 Studio',
      };
      return {
        title: `${statusIcon[status] || '❓'} ${title || 'Order'} — ${product || 'Custom 3D Print'}`,
        subtitle: `${customer || 'Customer'} · KES ${amount?.toLocaleString() || '0'} · ${sourceIcon[source] || 'Order'}`,
      };
    },
  },
})
