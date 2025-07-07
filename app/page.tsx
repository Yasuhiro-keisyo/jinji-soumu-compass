import { client } from '@/lib/sanity' // @ はルートディレクトリを指すエイリアス
import Link from 'next/link'
import { Post } from './blog/[slug]/types'

// Sanityからデータを取得する非同期関数
async function getPosts() {
  // GROQというクエリ言語で「投稿(post)を全て(*)取得する」と命令
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt
  }`
  const data = await client.fetch(query)
  return data
}

// トップページのコンポーネント
export default async function HomePage() {
  const posts = await getPosts()

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-dark mb-8 border-b-2 border-primary pb-4">
        最新記事一覧
      </h1>
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <article key={post._id} className="p-6 rounded-xl border border-neutral-light shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
            <h2 className="text-2xl font-bold">
              <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                {post.title}
              </Link>
            </h2>
            <div className="mt-2 text-sm text-neutral-medium">
              <span>
                公開日: {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

// ISR（Incremental Static Regeneration）の設定。60秒ごとにデータを再検証
export const revalidate = 60 