import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // 画像の切り抜き位置を調整できるようにする
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'blockContent',
      description: 'プロフィールページに表示される自己紹介文',
    }),
  ],
})