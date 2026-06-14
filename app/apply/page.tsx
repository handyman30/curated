'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type FormData = {
  name: string
  age: string
  gender: string
  occupation: string
  city: string
  goals: string
  linkedin: string
  instagram: string
}

const EMPTY: FormData = {
  name: '', age: '', gender: '',
  occupation: '', city: '', goals: '', linkedin: '', instagram: '',
}

const inputClass = 'w-full bg-transparent border border-espresso-border text-cream px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-cognac/50 transition-colors placeholder-cream/15'
const selectClass = 'w-full bg-espresso-light border border-espresso-border text-cream px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-cognac/50 transition-colors appearance-none cursor-pointer'
const labelClass = 'block text-cream/35 text-[10px] tracking-[0.25em] uppercase mb-2 font-sans'

export default function ApplyPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [authUserId, setAuthUserId] = useState('')
  const [form, setForm] = useState<FormData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/auth')
        return
      }
      const userEmail = data.session.user.email ?? ''
      const userId = data.session.user.id
      setEmail(userEmail)
      setAuthUserId(userId)
      sessionStorage.setItem('curated_email', userEmail)

      // Check if already applied
      const res = await fetch('/api/my-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      })
      const json = await res.json()
      if (json.profile) {
        router.push('/dashboard')
        return
      }
      setChecking(false)
    })
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email, auth_user_id: authUserId }),
      })
      if (!res.ok) {
        const j = await res.json()
        setError(j.error ?? 'Something went wrong')
        setLoading(false)
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error — try again')
    }
    setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center">
        <div className="w-4 h-4 border border-cognac/40 border-t-cognac rounded-full animate-spin" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="font-serif text-4xl text-cognac mb-6">✓</div>
          <h2 className="font-serif font-light text-2xl text-cream mb-4">Kamu sudah di waitlist.</h2>
          <p className="text-cream/40 text-sm font-sans leading-relaxed mb-8">
            Kami review aplikasimu dan kabari dalam 24–48 jam. Sementara itu, kamu sudah bisa lihat siapa yang ada di Curated.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-cognac text-espresso px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors"
          >
            Lihat Profil Member →
          </a>
          <p className="text-cream/20 text-xs font-sans mt-5">Cek inbox (dan folder junk) untuk email konfirmasi.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-espresso py-20 px-6">
      <div className="max-w-xl mx-auto">
        <a href="/" className="block text-center font-serif font-light text-cream text-xl tracking-[0.25em] uppercase mb-12">
          Curated
        </a>

        <div className="mb-10 text-center">
          <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-3 font-sans">Langkah 1 dari 1</p>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-cream mb-3">Lengkapi profilmu</h1>
          <p className="text-cream/40 text-sm font-sans">Daftar sebagai <span className="text-cream/60">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gender */}
          <div>
            <label className={labelClass}>Saya adalah <span className="text-cream/20">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {([['female', 'Wanita', '♀'], ['male', 'Pria', '♂']] as const).map(([val, label, icon]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, gender: val }))}
                  className={`py-3 border text-sm font-sans transition-all ${
                    form.gender === val
                      ? 'border-cognac bg-cognac/10 text-cognac'
                      : 'border-espresso-border text-cream/40 hover:border-cognac/40'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Name + Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nama lengkap <span className="text-cream/20">*</span></label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Nama kamu" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Usia <span className="text-cream/20">*</span></label>
              <input type="number" name="age" required min="18" max="55" value={form.age} onChange={handleChange} placeholder="e.g. 28" className={inputClass} />
            </div>
          </div>

          {/* Occupation + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Pekerjaan <span className="text-cream/20">*</span></label>
              <input type="text" name="occupation" required value={form.occupation} onChange={handleChange} placeholder="e.g. Lawyer, Founder" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Kota <span className="text-cream/20">*</span></label>
              <input type="text" name="city" required value={form.city} onChange={handleChange} placeholder="e.g. Jakarta" className={inputClass} />
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className={labelClass}>Tujuan relasi <span className="text-cream/20">*</span></label>
            <div className="relative">
              <select name="goals" required value={form.goals} onChange={handleChange} className={selectClass}>
                <option value="" disabled>Pilih</option>
                <option value="serious">Hubungan serius</option>
                <option value="marriage">Menuju pernikahan</option>
                <option value="open">Terbuka untuk keduanya</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 text-xs pointer-events-none">↓</span>
            </div>
          </div>

          {/* LinkedIn + Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/kamu" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input type="text" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@handle" className={inputClass} />
            </div>
          </div>

          {error && <p className="text-red-400/80 text-xs font-sans">{error}</p>}

          <p className="text-cream/20 text-xs font-sans leading-relaxed">
            Informasimu hanya digunakan untuk keperluan matching dan tidak dibagikan tanpa persetujuanmu.
          </p>

          <button
            type="submit"
            disabled={loading || !form.gender || !form.name || !form.age || !form.occupation || !form.city || !form.goals}
            className="w-full bg-cognac text-espresso py-4 text-xs tracking-[0.15em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 border border-espresso/30 border-t-espresso rounded-full animate-spin" />
                Mengirim...
              </span>
            ) : 'Daftar Waitlist →'}
          </button>
        </form>
      </div>
    </div>
  )
}
