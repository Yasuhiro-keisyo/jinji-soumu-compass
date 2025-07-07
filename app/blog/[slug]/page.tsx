import type { PortableTextBlock } from 'sanity'
import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '@/lib/sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

// ★★★ 型定義を一つにまとめる ★★★
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// データ取得用の型
interface PostData {
  _id: string;
  title: string;
  excerpt: string;
  mainImage: SanityImageSource;
  publishedAt: string;
  _updatedAt: string;
  body: PortableTextBlock[]; // PortableText用の型
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

// ★★★ generateMetadata 関数 ★★★
export async function generateMetadata({ params: awaitedParams }: PageProps): Promise<Metadata> {
  const params = await awaitedParams; // ここでもawaitする
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

// PortableTextのカスタムコンポーネント
const components = {
  types: {
    code: ({ value }: { value: { code: string; language: string } }) => {
      return (
        <SyntaxHighlighter language={value.language} style={atomOneDark}>
          {value.code}
        </SyntaxHighlighter>
      );
    },
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
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-6 mt-10">{children}</h1>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-5 mt-8">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-2xl md:text-3xl font-semibold text-neutral-dark mb-4 mt-6">{children}</h3>,
    h4: ({ children }: { children?: React.ReactNode }) => <h4 className="text-xl md:text-2xl font-medium text-neutral-dark mb-3 mt-5">{children}</h4>,
    normal: ({ children }: { children?: React.ReactNode }) => <p className="text-lg leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 italic text-neutral-medium">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside mb-4 pl-5">{children}</ul>,
    number: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside mb-4 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => <li className="mb-2">{children}</li>,
    number: ({ children }: { children?: React.ReactNode }) => <li className="mb-2">{children}</li>,
  },
};

// ★★★ ページコンポーネント ★★★
export default async function PostDetailPage({ params: awaitedParams }: PageProps) {
  const params = await awaitedParams; // ここでもawaitする
  const post = await getPost(params.slug);

  if (!post) {
    return <div>記事が見つかりません。</div>;
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
      <article className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-md text-neutral-medium mb-6 border-b pb-4 border-neutral-light">
          公開日: {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {post.author && <span className="ml-4">著者: {post.author.name}</span>}
        </p>
        {post.mainImage && (
          <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden shadow-xl">
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
        {post.body && (
          <div className="prose prose-lg max-w-none mt-8">
            <PortableText value={post.body} components={components} />
          </div>
        )}
      </article>
    </>
  );
}