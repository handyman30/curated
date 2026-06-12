import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        espresso: {
          DEFAULT: '#0E0907',
          light: '#1A110C',
          card: '#221610',
          border: '#2E1E14',
        },
        cream: {
          DEFAULT: '#F0E6D6',
          muted: '#C4AD97',
          faint: '#7A6558',
        },
        cognac: {
          DEFAULT: '#C49A6E',
          light: '#D4B08A',
          dark: '#9A7050',
        },
      },
    },
  },
  plugins: [],
}

export default config
