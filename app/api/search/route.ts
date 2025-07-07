import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity' // 既存のSanityクライアントをインポート

export async function GET(request: Request) {
  // 1. リクエストURLから検索クエリを取得
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // 2. 検索クエリがなければ、空の結果を返す
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  // 3. 全文検索用のGROQクエリを定義
  const groqQuery = `
    *[_type == "post" && (
      title match $query + "*" ||
      pt::text(body) match $query ||
      excerpt match $query ||
      keywords[] match $query ||
      category->title match $query ||
      tags[]->title match $query
    )] | score(
      title match $query => 3,
      excerpt match $query => 2,
      keywords[] match $query => 2,
      pt::text(body) match $query => 1
    ) | order(_score desc) {
      _id,
      title,
      "slug": slug.current,
      "category": category->title
    }`

  // 4. Sanityにクエリを送信
  try {
    const params: Record<string, string> = { query: query as string };
    const results = await client.fetch(groqQuery, params)
    // 5. 結果をJSON形式でクライアントに返す
    return NextResponse.json(results)
  } catch (error) {
    console.error('Sanity search fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 })
  }
}