import {defineType, defineArrayMember} from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * article body content.
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    // テキストブロックの定義
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // 利用できるスタイル（H2, H3, H4, 通常文, 引用）
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      // 利用できるリスト（番号付き、点付き）
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      // テキスト装飾（太字、イタリック）
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        // リンクの定義
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // 本文中に挿入できる画像
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
    }),
    // 本文中に挿入できるコードブロック（@sanity/code-input プラグインが必要）
    defineArrayMember({
      type: 'code',
      options: {
        withFilename: true, // ファイル名を表示するオプション
      },
    }),
  ],
})