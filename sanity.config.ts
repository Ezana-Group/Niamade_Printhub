import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/schemaTypes'
import { structure } from './src/structure'
import { PrintShippingLabelAction, PrintReceiptAction } from './src/actions/orderActions'

export default defineConfig({
  name: 'default',
  title: 'PrintHub Africa Content Studio',

  projectId: 'm7x6icn3',
  dataset: 'production',
  basePath: '/admin',

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'order') {
        return [...prev, PrintShippingLabelAction, PrintReceiptAction]
      }
      return prev
    },
  },
})
