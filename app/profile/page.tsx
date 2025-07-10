import type { Metadata } from 'next'
import type { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'

import { client, urlFor } from '@/lib/sanity'
import { portableTextComponents } from '@/components/PortableTextComponents'

type AuthorProfile = {
  name: string;
  image?: any;
  bio?: PortableTextBlock[];
}

async function getAuthorProfile(): Promise<AuthorProfile | null> {
  const authorSlug = "やすひろ";
  
  const query = `*[_type == "author" && slug.current == $slug][0]{
    name,
    image,
    bio
  }`
  const params = { slug: authorSlug };
  const data = await client.fetch(query, params);
  return data;
}

export default async function ProfilePage() {
  const author = await getAuthorProfile();

  if (!author) {
    notFound();
  }

  return (
    <div className="bg-neutral-light py-12 sm:py-16">
      <div className="container">
        <article className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
          {/* 画像・名前などをここに表示可能 */}

          <div className="border-t border-neutral-light pt-8">
            <div className="prose prose-lg max-w-none prose-h3:text-primary text-neutral-dark">
              {author.bio ? (
                <PortableText 
                  value={author.bio} 
                  components={portableTextComponents} 
                />
              ) : (
                <p>自己紹介文が設定されていません。</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
