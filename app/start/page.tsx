'use client'

import { useState } from 'react'

export default function StartPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [occupation, setOccupation] = useState('')
  const [education, setEducation] = useState('')
  const [religion, setReligion] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, phone, occupation, education, religion }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error || 'Coba lagi'); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-espresso flex flex-col items-center justify-center px-6 text-center gap-5">
        <p className="font-serif font-light text-cream text-xl tracking-[0.3em] uppercase">Curated</p>
        <h2 className="font-serif font-light text-3xl text-cream">Kamu masuk.</h2>
        <p className="text-cream/40 text-sm font-sans max-w-xs leading-relaxed">
          Cek inbox kamu. Kami akan review dan kabari dalam waktu dekat.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-espresso flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <p className="font-serif font-light text-cream text-xl tracking-[0.3em] uppercase">Curated</p>
          <h1 className="font-serif font-light text-3xl text-cream leading-tight">
            Komunitas eksklusif<br />
            <span className="italic text-cream/45">untuk profesional Jakarta.</span>
          </h1>
          <p className="text-cream/35 text-sm font-sans leading-relaxed">
            Setiap anggota diverifikasi. Gathering bulanan. Tidak semua diterima.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            placeholder="Nama kamu"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-transparent border border-espresso-border text-cream placeholder-cream/25 text-sm font-sans px-4 py-3.5 outline-none focus:border-cognac/50 transition-colors"
          />
          <input
            type="email"
            placeholder="Email kamu"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-transparent border border-espresso-border text-cream placeholder-cream/25 text-sm font-sans px-4 py-3.5 outline-none focus:border-cognac/50 transition-colors"
          />
          <input
            type="tel"
            placeholder="Nomor HP (WhatsApp)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full bg-transparent border border-espresso-border text-cream placeholder-cream/25 text-sm font-sans px-4 py-3.5 outline-none focus:border-cognac/50 transition-colors"
          />
          <input
            type="text"
            placeholder="Pekerjaan / Profesi"
            value={occupation}
            onChange={e => setOccupation(e.target.value)}
            className="w-full bg-transparent border border-espresso-border text-cream placeholder-cream/25 text-sm font-sans px-4 py-3.5 outline-none focus:border-cognac/50 transition-colors"
          />
          <input
            type="text"
            placeholder="Pendidikan / Gelar"
            value={education}
            onChange={e => setEducation(e.target.value)}
            className="w-full bg-transparent border border-espresso-border text-cream placeholder-cream/25 text-sm font-sans px-4 py-3.5 outline-none focus:border-cognac/50 transition-colors"
          />
          <select
            value={religion}
            onChange={e => setReligion(e.target.value)}
            className="w-full bg-espresso border border-espresso-border text-sm font-sans px-4 py-3.5 outline-none focus:border-cognac/50 transition-colors appearance-none"
            style={{ color: religion ? '#F0E6D6' : 'rgba(240,230,214,0.25)' }}
          >
            <option value="" disabled>Agama</option>
            <option value="Islam">Islam</option>
            <option value="Kristen">Kristen</option>
            <option value="Katolik">Katolik</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddha">Buddha</option>
            <option value="Konghucu">Konghucu</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {error && <p className="text-red-400/70 text-xs font-sans">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-cognac text-espresso py-4 text-sm tracking-[0.2em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors disabled:opacity-40"
          >
            {loading ? 'Mendaftar...' : 'Gabung Waitlist'}
          </button>
        </form>

        <p className="text-center text-cream/15 text-[10px] font-sans">
          Gratis daftar · Tidak ada spam
        </p>

      </div>
    </div>
  )
}
