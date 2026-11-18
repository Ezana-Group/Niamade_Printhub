import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Select an existing category or create a new one directly here',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Current Price',
      type: 'string',
      description: 'The active selling price (e.g. KES 1,200 or From KES 800)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original / Strikethrough Price (for Price Cuts)',
      type: 'string',
      description: 'Optional. e.g. KES 1,600. When set, this displays crossed out next to the current sale price.',
    }),
    defineField({
      name: 'discountBadge',
      title: 'Discount Badge / Label',
      type: 'string',
      description: 'Optional badge text (e.g. "20% OFF", "Save KES 300", "Holiday Sale", "Special Offer"). Defaults to "Sale" if left blank.',
    }),
    defineField({
      name: 'onSale',
      title: 'Mark as On Sale / Promotional Piece',
      type: 'boolean',
      description: 'Toggle on to give this piece high-visibility sale badges on product cards',
      initialValue: false,
    }),
    defineField({
      name: 'note',
      title: 'Short Note / Subtitle',
      type: 'string',
      description: 'One-line summary shown on the product card',
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'e.g. PLA, PETG, TPU',
    }),
    defineField({
      name: 'finish',
      title: 'Finish',
      type: 'string',
      description: 'e.g. Smooth, Matte, Hand-painted',
    }),
    defineField({
      name: 'occasions',
      title: 'Occasions (Tags)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Add or remove tags freely. Type any tag (e.g. gift, events, business, kenya, home, learn, parts) and press Enter to add.',
    }),
    defineField({
      name: 'blurb',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
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
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Rich text: format with bold, italics, bullet points, numbered lists, headings, and links',
    }),
    defineField({
      name: 'uses',
      title: 'Use Cases',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g. Standard, Small (10cm), Medium (15cm), Large (20cm) — customers can choose on the page',
    }),
    defineField({
      name: 'colours',
      title: 'Available Colours',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g. Matte Black, White, Silk Gold, Fire Engine Red, Forest Green, Navy Blue — customers can select on the page',
    }),
    defineField({
      name: 'customizationPrompt',
      title: 'Custom Text / Personalisation Prompt',
      type: 'string',
      description: 'e.g. "Enter name for keychain" or "Company name for logo" (if personalized)',
    }),
    defineField({
      name: 'waMessage',
      title: 'Custom WhatsApp Order Message (Optional)',
      type: 'string',
      description: 'Override the default order message for this specific product. Placeholders: {name}, {price}, {size}, {colour}',
    }),
    defineField({
      name: 'care',
      title: 'Care & Ordering Guidance',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
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
      description: 'Rich text: "Good to know" box on product page (tolerances, cleaning, order turnaround)',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Enables visual cropping & focal points
          },
        },
      ],
    }),
    defineField({
      name: 'isCollab',
      title: 'Client / Creator Collaboration',
      type: 'boolean',
      description: 'Toggle on if this product is made for a featured customer, creator, or brand partner',
      initialValue: false,
    }),
    defineField({
      name: 'creatorName',
      title: 'Creator / Brand Name',
      type: 'string',
      description: 'The name of the customer, brand, or creator (e.g. "Kiprono Studios", "AfroCrafts")',
      hidden: ({ parent }) => !parent?.isCollab,
    }),
    defineField({
      name: 'creatorUrl',
      title: 'Creator Website / Social Profile',
      type: 'url',
      description: 'Optional link to the creator\'s portfolio, homepage, or Instagram profile',
      hidden: ({ parent }) => !parent?.isCollab,
    }),
    defineField({
      name: 'externalPurchaseUrl',
      title: 'External Store / Checkout URL',
      type: 'url',
      description: 'Link directly to the customer\'s e-commerce store / product page (e.g. Shopify, website, or Instagram post)',
      hidden: ({ parent }) => !parent?.isCollab,
    }),
    defineField({
      name: 'purchaseAction',
      title: 'Purchase Button Action',
      type: 'string',
      options: {
        list: [
          { title: 'Redirect to Creator Store (External URL)', value: 'external' },
          { title: 'Order via PrintHub WhatsApp (We print & fulfill)', value: 'whatsapp' },
          { title: 'Both (Primary button to Creator Store + secondary WhatsApp inquiry)', value: 'both' },
        ],
        layout: 'radio',
      },
      initialValue: 'external',
      description: 'How visitors can purchase this product',
      hidden: ({ parent }) => !parent?.isCollab,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      creator: 'creatorName',
      isCollab: 'isCollab',
      media: 'photos.0',
    },
    prepare({ title, subtitle, creator, isCollab, media }) {
      return {
        title,
        subtitle: isCollab && creator ? `${subtitle} · Collab with ${creator}` : subtitle,
        media,
      }
    },
  },
})
