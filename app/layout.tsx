import type { Metadata } from 'next'
// 'Inter'のインポートを 'Noto_Sans_JP' に変更
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ["400", "700"],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: '人事総務の羅針盤',
  description: '中小企業を支える実務とAI活用術',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body className={`font-sans bg-background text-text-dark min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}