import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import WhatsAppChat from '@/components/WhatsAppChat'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Curated — Exclusive Matchmaking for Ambitious Professionals',
  description:
    'AI-assisted matchmaking for ambitious Indonesian professionals. Verified profiles, curated introductions, serious relationships only.',
  openGraph: {
    title: 'Curated',
    description: 'Stop swiping. Start meeting curated matches.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-espresso text-cream antialiased font-sans">
        {children}
        <WhatsAppChat />
      </body>
    </html>
  )
}
