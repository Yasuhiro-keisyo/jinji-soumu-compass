import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'

// スキーマのインポートパスが `./schemas` になることに注意
import { schemaTypes } from './schemas/index' // 末尾に /index を追加

export default defineConfig({
  name: 'default',
  title: '人事総務の羅針盤',

  projectId: 'b0l6rftv',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
