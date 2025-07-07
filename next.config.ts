import type { NextConfig } from 'next'
// bundle-analyzerをインポート
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const config: NextConfig = {
  // ↓↓↓ この images プロパティを追記、または既存の設定とマージします ↓↓↓
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // Sanityの画像パスのパターン
      },
    ],
  },
  // ↑↑↑ ここまで追記 ↑↑↑
  // もし他の設定があれば、それはそのまま残してください
  // 例: reactStrictMode: true, 
};
// 設定を withBundleAnalyzer でラップしてエクスポート
export default withBundleAnalyzer(config)