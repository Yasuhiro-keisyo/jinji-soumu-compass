import { client, urlFor } from '@/lib/sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import { PortableText } from '@portabletext/react' // 本文表示でおなじみのコンポーネント

// Sanityから取得する著者データの型を定義
interface AuthorProfile {
  name: string;
  image: SanityImageSource;
  bio: any; // Portable Textの型。あとで厳密にできます
  // 必要であれば、他のフィールド（例: email, websiteなど）も追加
}

// Sanityから特定の著者データを取得する関数
// "your-author-slug" の部分は、Sanityで設定したあなたの著者のslugに置き換えてください
async function getAuthorProfile(): Promise<AuthorProfile | null> {
  const query = `*[_type == "author" && slug.current == "やすひろ"][0]{
    name,
    image,
    bio
  }`
  const data = await client.fetch(query);
  return data;
}


// プロフィールページのメインコンポーネント
export default async function ProfilePage() {
  const author = await getAuthorProfile();

  if (!author) {
    return <div>プロフィール情報が見つかりません。</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* プロフィール画像 */}
          {author.image && (
            <div className="relative w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={urlFor(author.image).url()}
                alt={author.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          )}

          {/* 名前と肩書き */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-primary">{author.name}</h1>
            <p className="mt-2 text-lg text-neutral-medium">
              人事・総務コンサルタント / AI活用アドバイザー
            </p>
          </div>
        </div>

        {/* 自己紹介文 */}
        <div className="mt-10 border-t pt-8">
          <div className="prose prose-lg max-w-none">
            {author.bio ? (
              <PortableText value={author.bio} />
            ) : (
              <p>ここに自己紹介文が入ります。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}