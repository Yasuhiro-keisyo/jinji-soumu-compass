import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">
          <Link href="/">
            人事総務の羅針盤
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-white hover:text-accent transition-colors duration-300">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-white hover:text-accent transition-colors duration-300">
                プロフィール
              </Link>
            </li>
            {/* 必要に応じて他のリンクを追加 */}
          </ul>
        </nav>
      </div>
    </header>
  )
}