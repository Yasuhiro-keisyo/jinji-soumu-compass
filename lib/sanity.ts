// 必要なライブラリから createClient という機能をインポートします
import { createClient } from 'next-sanity'
// ↓↓↓ この2行を追加します ↓↓↓
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
// .env.localファイルから設定値を読み込みます
// process.env.変数名 という書き方でアクセスできます
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!

// createClient関数を使って、Sanityと通信するためのクライアント（電話機）を作成します
export const client = createClient({
  projectId,    // どのプロジェクトにかけるか (電話番号)
  dataset,      // "production" か "staging" か (部署名)
  apiVersion,   // APIのバージョン (話し方のルール)
  useCdn: false, // 開発中はCDNを使わない設定 (常に最新のデータを取得するため)
})
const builder = imageUrlBuilder(client)

// Sanityから受け取った画像ソースの型を正しく扱うための設定
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}