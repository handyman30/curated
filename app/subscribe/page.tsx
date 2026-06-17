'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setEmail(data.session.user.email)
      } else {
        const stored = sessionStorage.getItem('curated_email')
        if (stored) setEmail(stored)
      }
    })
  }, [])

  async function handleSubscribe() {
    if (!email) { setError('Masukkan email kamu untuk melanjutkan.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
      else setError('Tidak bisa memulai pembayaran. Coba lagi.')
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="block text-center font-serif font-light text-cream text-xl tracking-[0.25em] uppercase mb-12">
          Cinta Kau Dan Dia
        </a>

        {/* Card */}
        <div className="border border-espresso-border p-8" style={{ background: 'linear-gradient(160deg, #1A110C 0%, #221610 100%)' }}>
          {/* Top accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cognac/40 to-transparent mb-8" />

          <p className="text-center text-cognac text-[10px] tracking-[0.3em] uppercase font-sans mb-4">Membership</p>
          <div className="text-center mb-2">
            <span className="font-serif font-light text-cream text-5xl">Rp 75.000</span>
            <span className="text-cream/40 text-sm font-sans ml-2">/ bulan</span>
          </div>
          <p className="text-center text-cream/35 text-xs font-sans mb-8">Batalkan kapan saja.</p>

          <div className="space-y-3 mb-8">
            {[
              'Kami konfirmasi bahwa orang tersebut juga tertarik padamu',
              'Dapatkan nama lengkap, Instagram & LinkedIn mereka',
              'Tidak ada ghosting — kedua pihak sudah setuju sebelum bayar',
              'Kami yang urus perkenalan secara personal',
            ].map((f) => (
              <div key={f} className="flex items-start gap-3">
                <span className="text-cognac text-xs mt-0.5 flex-shrink-0">✓</span>
                <span className="text-cream/55 text-sm font-sans leading-relaxed">{f}</span>
              </div>
            ))}
          </div>

          {!email && (
            <div className="mb-4">
              <label className="block text-cream/35 text-[10px] tracking-[0.25em] uppercase mb-2 font-sans">Email kamu</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-espresso-border text-cream px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-cognac/50 transition-colors placeholder-cream/15"
                placeholder="your@email.com"
              />
            </div>
          )}

          {error && <p className="text-red-400/80 text-xs font-sans mb-4">{error}</p>}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-cognac text-espresso py-4 text-xs tracking-[0.2em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Mulai Membership · Rp 75.000/bulan'}
          </button>

          <p className="text-center text-cream/20 text-xs font-sans mt-4">
            Aman dengan Stripe. Kartu tidak tersimpan di sistem kami.
          </p>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => router.back()} className="text-cream/25 text-xs font-sans hover:text-cream/50 transition-colors">
            ← Kembali ke match
          </button>
        </div>
      </div>
    </div>
  )
}
