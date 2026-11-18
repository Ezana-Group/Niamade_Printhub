import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/schemaTypes'
import { structure } from './src/structure'

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
})
