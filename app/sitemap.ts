import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { Post } from './blog/[slug]/types'

// Sanityから全記事のslugと更新日時を取得する
async function getAllPosts() {
  const query = `*[_type == "post"]{
    "slug": slug.current,
    _updatedAt
  }`
  const data = await client.fetch(query)
  return data
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jinji-soumu-compass.vercel.app'

  // Sanityから動的ページ情報を取得
  const posts = await getAllPosts();
  const postUrls = posts.map((post: Post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly', // as 'weekly' を削除するだけでOKな場合が多い
    priority: 0.8,
  }))

  // 静的ページの定義
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...postUrls]
}