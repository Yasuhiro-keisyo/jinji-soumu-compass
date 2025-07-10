import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

import { client, urlFor } from '@/lib/sanity'

// ★★★ 型定義 ★★★
// ページコンポーネントが受け取るPropsの型
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Sanityから取得する投稿データの型
interface PostData {
  _id: string;
  title: string;
  excerpt: string;
  mainImage: SanityImageSource;
  publishedAt: string;
  _updatedAt: string;
  body: PortableTextBlock[];
  author: {
    name: string;
  };
}

// ★★★ データ取得関数 ★★★
async function getPost(slug: string): Promise<PostData | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    excerpt,
    mainImage,
    publishedAt,
    _updatedAt,
    body,
    author->{name}
  }`
  const params = { slug };
  const data = await client.fetch(query, params);
  return data;
}

// ★★★ メタデータ生成関数 ★★★
export async function generateMetadata({ params: awaitedParams }: PageProps): Promise<Metadata> {
  const params = await awaitedParams;
  const post = await getPost(params.slug);

  if (!post) {
    return { title: '記事が見つかりません' };
  }

  const ogImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : '/default-og-image.png';

  return {
    title: `${post.title} | 人事総務の羅針盤`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

// ★★★ PortableTextのカスタムコンポーネント定義 ★★★
const portableTextComponents = {
  types: {
    // Sanityの本文中のcode型をSyntaxHighlighterで表示
    code: ({ value }: { value: { code: string; language: string } }) => {
      return (
        <div className="my-6 text-sm">
          <SyntaxHighlighter language={value.language || 'plaintext'} style={atomOneDark} customStyle={{ padding: '1.5em', borderRadius: '0.5em' }}>
            {value.code}
          </SyntaxHighlighter>
        </div>
      );
    },
    // Sanityの本文中のimage型をNext/Imageで表示
    image: ({ value }: { value: SanityImageSource & { alt?: string } }) => {
      return (
        <div className="my-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      );
    },
  },
  marks: {
    // 本文中のリンクを新しいタブで開き、スタイルを適用
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => {
      const href = value?.href || '';
      const isInternal = href.startsWith('/') || href.startsWith('#');
      return (
        <a 
          href={href} 
          target={isInternal ? '_self' : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          className="text-primary hover:underline decoration-primary/50"
        >
          {children}
        </a>
      )
    }
  }
  // block, list, listItemのカスタムスタイルは削除。proseに任せる。
};

// ★★★ ページコンポーネント本体 ★★★
export default async function PostDetailPage({ params: awaitedParams }: PageProps) {
  const params = await awaitedParams;
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1>404 - 記事が見つかりません</h1>
        <p className="mt-4">お探しのページは存在しないか、移動した可能性があります。</p>
        <Link href="/" className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90">
          ホームに戻る
        </Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    // ... (JSON-LDの他のプロパティ) ...
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-white py-8 md:py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* 記事ヘッダー */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
                {post.title}
              </h1>
              <p className="mt-4 text-md text-neutral-medium border-b pb-4 border-neutral-light">
                公開日: {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {post.author && <span className="ml-4">著者: {post.author.name}</span>}
              </p>
            </header>

            {/* メイン画像 */}
            {post.mainImage && (
              <div className="relative w-full aspect-video my-8 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={urlFor(post.mainImage).url()}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>
            )}
            
            {/* 本文 */}
            {post.body && (
              <div className="prose prose-lg max-w-none 
                              prose-h2:border-b prose-h2:border-primary/30 prose-h2:pb-2 
                              prose-a:text-primary 
                              prose-blockquote:border-primary">
                <PortableText value={post.body} components={portableTextComponents} />
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}