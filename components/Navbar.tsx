'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const NAV_LINKS = [
  { label: 'Acara', href: '#events' },
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Keanggotaan', href: '#membership' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })

    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-espresso/95 backdrop-blur-sm border-b border-espresso-border'
          : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-serif text-xl text-cream tracking-[0.25em] uppercase select-none font-light">
          Cinta Kau Dan Dia
        </a>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-cream/45 hover:text-cream text-xs tracking-[0.15em] uppercase font-sans transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {loggedIn ? (
            <a
              href="/dashboard"
              className="text-cognac/70 hover:text-cognac text-xs tracking-[0.15em] uppercase font-sans transition-colors duration-200 hidden md:block"
            >
              Dashboard →
            </a>
          ) : (
            <>
              <a
                href="/auth"
                className="text-cream/40 hover:text-cream text-xs tracking-[0.15em] uppercase font-sans transition-colors duration-200 hidden md:block"
              >
                Masuk
              </a>
              <a
                href="/join"
                className="border border-cognac/50 text-cognac text-xs tracking-[0.15em] uppercase px-5 py-2.5 font-sans hover:bg-cognac hover:text-espresso transition-all duration-200"
              >
                Daftar
              </a>
            </>
          )}

          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`md:hidden bg-espresso border-t border-espresso-border overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-cream/60 text-sm tracking-[0.15em] uppercase font-sans hover:text-cream transition-colors"
            >
              {link.label}
            </a>
          ))}
          {loggedIn ? (
            <a href="/dashboard" onClick={() => setMenuOpen(false)} className="text-cognac/80 text-sm tracking-[0.15em] uppercase font-sans hover:text-cognac transition-colors">
              Dashboard →
            </a>
          ) : (
            <a href="/auth" onClick={() => setMenuOpen(false)} className="text-cream/60 text-sm tracking-[0.15em] uppercase font-sans hover:text-cream transition-colors">
              Masuk
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
