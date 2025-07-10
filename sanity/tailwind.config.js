/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ↓↓↓ この内容に書き換えてください ↓↓↓
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // pagesディレクトリも念のため
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    // './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // ... themeの設定 ...
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}