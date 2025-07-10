/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
         // ↓↓↓ ここから追記・編集 ↓↓↓
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        neutral: {
          light: 'var(--color-neutral-light)',
          dark: 'var(--color-neutral-dark)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      },
    },
    plugins: [
      require('@tailwindcss/typography'), // typographyプラグイン
    ],
  }