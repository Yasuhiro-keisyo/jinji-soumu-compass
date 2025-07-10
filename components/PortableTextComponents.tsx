import Image from 'next/image'
import { urlFor } from '@/lib/sanity'


// ★★★ Sanityの画像オブジェクトの具体的な型を定義 ★★★
interface SanityImageValue {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export const portableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageValue }) => {
      if (!value?.asset?._ref) {
        return null;
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
      );
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value?.href} rel={rel} target="_blank" className="text-primary hover:underline">
          {children}
        </a>
      )
    },
  },
}