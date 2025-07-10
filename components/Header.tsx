import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* サイトロゴ・タイトル */}
        <div className="text-xl font-extrabold text-primary">
          <Link href="/">
            人事総務の羅針盤
          </Link>
        </div>

        {/* ナビゲーション */}
        <nav>
          <ul className="flex items-center space-x-6 text-md font-medium">
            <li>
              <Link href="/" className="text-neutral-dark hover:text-primary transition-colors">
                ホーム
              </Link>
            </li>
            {/* ↓↓↓ これがプロフィールページへのリンクです ↓↓↓ */}
            <li>
              <Link href="/profile" className="text-neutral-dark hover:text-primary transition-colors">
                プロフィール
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}