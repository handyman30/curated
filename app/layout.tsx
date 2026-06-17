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
  title: 'Cinta Kau Dan Dia — Matchmaking Eksklusif untuk Profesional Jakarta',
  description:
    'Matchmaking berbasis AI untuk profesional Indonesia. Profil terverifikasi, perkenalan personal, untuk hubungan serius.',
  openGraph: {
    title: 'Cinta Kau Dan Dia',
    description: 'Berhenti swipe. Mulai bertemu dengan orang yang tepat.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-espresso text-cream antialiased font-sans">
        {children}
        <WhatsAppChat />
      </body>
    </html>
  )
}
