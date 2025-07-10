import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

export const portableTextComponents = {
  types: {
    // Sanityの本文中に追加した画像を、Next/Imageで最適化して表示する設定
    image: ({ value }: { value: SanityImageSource & { alt?: string } }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className="relative my-6 mx-auto w-full h-96">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ' '}
            loading="lazy"
            fill
            className="object-contain"
          />
        </div>
      )
    },
    // 他のカスタムタイプ（例: code）があればここに追加
  },
  marks: {
    // リンクを新しいタブで開く設定
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value?.href} rel={rel} target="_blank" className="text-primary hover:underline">
          {children}
        </a>
      )
    },
  },
  // block: {
  //   // 見出しや段落のスタイルを細かくカスタマイズしたい場合はここを編集
  //   h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-2xl mt-8 mb-4 font-bold">{children}</h2>,
  //   blockquote: ({ children }: { children: React.ReactNode }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>,
  // }
}