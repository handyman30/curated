'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Profile = { name: string; status: string; occupation: string; age: number; position: number }

export default function JoinPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/auth')
        return
      }
      const email = data.session.user.email!
      sessionStorage.setItem('curated_email', email)

      const res = await fetch('/api/my-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()

      if (!json.profile) {
        router.push('/apply')
        return
      }

      if (json.profile.status === 'approved') {
        router.push('/dashboard')
        return
      }

      if (json.profile.status === 'rejected') {
        setProfile(json.profile)
        setChecking(false)
        return
      }

      // Status = waitlist — show position
      setProfile(json.profile)
      setChecking(false)
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center">
        <div className="w-4 h-4 border border-cognac/40 border-t-cognac rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) return null

  if (profile.status === 'rejected') {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-serif font-light text-cream/30 text-2xl mb-3">Aplikasi tidak lolos</p>
          <p className="text-cream/25 text-sm font-sans mb-6">Terima kasih sudah mendaftar. Kamu bisa coba lagi nanti.</p>
          <a href="/" className="text-cognac/60 text-xs font-sans hover:text-cognac transition-colors">← Kembali ke beranda</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <a href="/" className="block text-center font-serif font-light text-cream text-xl tracking-[0.25em] uppercase mb-12">
          Curated
        </a>

        <div className="border border-espresso-border p-8 text-center" style={{ background: '#1A110C' }}>
          {/* Position badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-cognac/30 mb-6" style={{ background: 'rgba(196,154,110,0.08)' }}>
            <span className="font-serif font-light text-cognac text-2xl">#{profile.position}</span>
          </div>

          <h2 className="font-serif font-light text-2xl text-cream mb-2">
            Kamu ada di waitlist, {profile.name?.split(' ')[0]}.
          </h2>
          <p className="text-cream/40 text-sm font-sans leading-relaxed mb-6">
            Kamu adalah pendaftar ke-<span className="text-cream/70">{profile.position}</span>. Kami review setiap aplikasi secara personal dan akan menghubungimu via email setelah disetujui.
          </p>

          <div className="space-y-3 pt-5 border-t border-espresso-border">
            <a
              href="/dashboard"
              className="block w-full bg-cognac text-espresso py-3 text-xs tracking-[0.2em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors"
            >
              Browse Member →
            </a>
            <a
              href="https://wa.me/61400403294"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border border-espresso-border text-cream/40 py-3 text-xs tracking-[0.15em] uppercase font-sans hover:border-cognac/40 hover:text-cream/60 transition-colors"
            >
              Ada pertanyaan? WhatsApp kami
            </a>
          </div>
        </div>

        <p className="text-center text-cream/20 text-xs font-sans mt-6">
          Cek inbox (dan folder junk) untuk email konfirmasi.
        </p>
      </div>
    </div>
  )
}
