'use client'

import { useMemo, useState, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { getUpcomingEvents } from '@/lib/events-config'

const RECENT_JOINS = [
  { initial: 'A', name: 'Anindya R.', time: '2j lalu' },
  { initial: 'D', name: 'Dimas S.', time: '4j lalu' },
  { initial: 'P', name: 'Priscilla M.', time: '6j lalu' },
  { initial: 'R', name: 'Rafi A.', time: 'kemarin' },
  { initial: 'N', name: 'Nadia K.', time: 'kemarin' },
]

// Seeded signup counts per venue index so they look consistent
const SEED_SIGNUPS = [
  { men: 2, women: 1 },
  { men: 1, women: 2 },
  { men: 0, women: 0 },
]

const SEED_ATTENDEES: Record<string, Array<{ initial: string; name: string; gender: 'male' | 'female' }>> = {
  'evt-0': [
    { initial: 'D', name: 'Dian R.', gender: 'male' },
    { initial: 'J', name: 'Jennifer C.', gender: 'female' },
    { initial: 'H', name: 'Handy H.', gender: 'male' },
  ],
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const hh = Math.floor(total / 60) % 24
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function slotsLeft(cap: number, filled: number) { return cap - filled }

export default function Events() {
  const { ref, isVisible } = useScrollAnimation()
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [signedUpEvents, setSignedUpEvents] = useState<Set<string>>(new Set())
  const [signingUp, setSigningUp] = useState<string | null>(null)
  const [signupError, setSignupError] = useState<string>('')
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userProfile, setUserProfile] = useState<{ name?: string; gender?: string; age?: number; status?: string; phone?: string } | null>(null)
  const [showPhoneForm, setShowPhoneForm] = useState<string | null>(null)
  const [phoneInput, setPhoneInput] = useState<Record<string, string>>({})

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        const email = data.session?.user?.email || sessionStorage.getItem('curated_email') || ''
        if (!email) return
        setUserEmail(email)
        fetch(`/api/event-join?email=${encodeURIComponent(email)}`)
          .then(r => r.json())
          .then(j => setSignedUpEvents(new Set(j.signups ?? [])))
        fetch('/api/my-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
          .then(r => r.json())
          .then(j => { if (j.profile) setUserProfile(j.profile) })
      })
    })
  }, [])

  function openSignup(ev: { id: string; name: string; date: Date; dateStr: string }) {
    if (!userEmail) { window.location.href = '/join'; return }
    if (!userProfile) { window.location.href = '/apply'; return }
    if (userProfile.status === 'waitlist') {
      setSignupError('Aplikasimu masih dalam review. Kami akan kabari setelah disetujui.')
      setTimeout(() => setSignupError(''), 5000)
      return
    }
    if (userProfile.status === 'rejected') {
      setSignupError('Aplikasimu tidak lolos seleksi ini.')
      setTimeout(() => setSignupError(''), 5000)
      return
    }
    if (userProfile.status !== 'approved') {
      setSignupError('Kamu perlu disetujui Curated sebelum bisa daftar event.')
      setTimeout(() => setSignupError(''), 5000)
      return
    }
    // If we already have their phone from registration, skip the phone form
    if (userProfile.phone) {
      submitSignupWithPhone(ev, userProfile.phone)
    } else {
      setShowPhoneForm(ev.id)
    }
  }

  async function submitSignup(ev: { id: string; name: string; date: Date; dateStr: string }) {
    const phone = phoneInput[ev.id] ?? ''
    if (!phone.trim()) {
      setSignupError('Masukkan nomor WhatsApp dulu ya.')
      return
    }
    await submitSignupWithPhone(ev, phone.trim())
  }

  async function submitSignupWithPhone(ev: { id: string; name: string; date: Date; dateStr: string }, phone: string) {
    setSigningUp(ev.id)
    setSignupError('')
    setSignupSuccess(null)
    const res = await fetch('/api/event-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        event_id: ev.id,
        event_name: ev.name,
        event_date: ev.dateStr,
        gender: userProfile?.gender ?? '',
        age: userProfile?.age ?? null,
        name: userProfile?.name ?? '',
        phone,
      }),
    })
    if (res.ok) {
      setSignedUpEvents(prev => new Set([...prev, ev.id]))
      setSignupSuccess(ev.id)
      setShowPhoneForm(null)
    } else {
      const j = await res.json().catch(() => ({}))
      setSignupError(j.error ?? 'Gagal daftar — coba lagi')
      setTimeout(() => setSignupError(''), 8000)
    }
    setSigningUp(null)
  }

  const events = useMemo(() => {
    return getUpcomingEvents().map((ev, i) => ({
      ...ev,
      signups_men: SEED_SIGNUPS[i]?.men ?? 0,
      signups_women: SEED_SIGNUPS[i]?.women ?? 0,
      price_idr: 175000,
    }))
  }, [])

  return (
    <section id="events" className="py-20 md:py-28 border-t border-espresso-border" style={{ background: 'linear-gradient(180deg, #1A110C 0%, #0E0907 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          ref={ref}
          className={`mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cognac/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cognac" />
            </span>
            <p className="text-cognac text-xs tracking-[0.3em] uppercase font-sans">Acara Mendatang</p>
          </div>
          <h2 className="font-serif font-light text-3xl md:text-4xl text-cream mb-3">
            Gathering Sabtu — 3 pria, 3 wanita.
          </h2>
          <p className="text-cream/40 font-sans text-sm md:text-base max-w-xl leading-relaxed mb-5">
            Setiap Sabtu kami host pertemuan kecil di Jakarta. Kami yang pilih tempatnya, kami yang kurasi tamunya.
            Kamu tinggal datang.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Welcome drinks', 'Snacks & fries', 'MC host', 'Kahoot & card games', 'Drawing game'].map((item) => (
              <span key={item} className="text-[11px] font-sans text-cognac/70 border border-cognac/20 px-3 py-1 tracking-wide">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Recent joins strip */}
        <div
          className={`mb-10 mt-8 flex items-center gap-5 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <span className="text-cream/20 text-xs font-sans flex-shrink-0">Baru daftar</span>
          <div className="flex items-center -space-x-2">
            {RECENT_JOINS.slice(0, 4).map((j) => (
              <div
                key={j.name}
                title={j.name}
                className="w-7 h-7 rounded-full border-2 border-espresso-light bg-cognac/20 flex items-center justify-center font-serif text-xs text-cognac flex-shrink-0"
              >
                {j.initial}
              </div>
            ))}
          </div>
          <span className="text-cream/35 text-xs font-sans">{RECENT_JOINS[0].name} dan {RECENT_JOINS.length - 1} lainnya bergabung minggu ini</span>
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((ev, i) => {
            const menLeft    = slotsLeft(ev.capacity, ev.signups_men)
            const womenLeft  = slotsLeft(ev.capacity, ev.signups_women)
            const totalLeft  = menLeft + womenLeft
            const isSoldOut  = totalLeft === 0
            const isAlmostFull = totalLeft <= 2 && !isSoldOut

            return (
              <div
                key={ev.id}
                className={`relative border flex flex-col overflow-hidden transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                } ${isSoldOut ? 'border-espresso-border' : 'border-cognac/25 hover:border-cognac/50'}`}
                style={{
                  background: 'linear-gradient(160deg, #1A110C 0%, #221610 100%)',
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent ${isSoldOut ? 'via-espresso-border' : 'via-cognac/40'}`} />

                {isAlmostFull && (
                  <div className="absolute top-4 right-4 bg-cognac/15 border border-cognac/30 px-2 py-1">
                    <span className="text-cognac text-[9px] tracking-[0.2em] uppercase font-sans">{totalLeft} slot tersisa</span>
                  </div>
                )}
                {isSoldOut && (
                  <div className="absolute top-4 right-4 bg-espresso-border px-2 py-1">
                    <span className="text-cream/30 text-[9px] tracking-[0.2em] uppercase font-sans">Penuh</span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="text-cognac text-xs tracking-[0.15em] uppercase font-sans mb-1">{ev.dateStr}</p>
                    <p className="text-cream/30 text-xs font-sans">{ev.time} WIB · {ev.type}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 border border-cognac/30 px-3 py-1 mb-4 w-fit">
                    <span className="text-cognac/70 text-[10px] tracking-[0.2em] uppercase font-sans">Open</span>
                    <span className="text-cognac text-sm font-serif font-light">23–36 tahun</span>
                  </div>

                  <h3 className={`font-serif font-light text-xl mb-1 ${isSoldOut ? 'text-cream/40' : 'text-cream'}`}>
                    {ev.name}
                  </h3>
                  <p className="text-cream/30 text-xs font-sans mb-5">{ev.address}</p>

                  <div className="mb-5 space-y-0">
                    {[
                      { time: ev.time,                  label: 'Ketemu & welcome drinks' },
                      { time: addMinutes(ev.time, 20),  label: 'Ice breaker — perkenalan singkat' },
                      { time: addMinutes(ev.time, 45),  label: 'Kahoot & card games bareng MC' },
                      { time: addMinutes(ev.time, 90),  label: 'Drawing game — tebak gambar' },
                      { time: addMinutes(ev.time, 120), label: 'Tukar kontak & wrap up' },
                    ].map((step, idx, arr) => (
                      <div key={idx} className="flex gap-3 items-stretch">
                        <div className="flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-cognac/50 mt-1.5 flex-shrink-0" />
                          {idx < arr.length - 1 && <div className="w-px flex-1 bg-espresso-border mt-1" />}
                        </div>
                        <div className={`pb-3 ${idx === arr.length - 1 ? 'pb-0' : ''}`}>
                          <span className="text-cognac/50 text-[10px] font-sans">{step.time} WIB</span>
                          <p className="text-cream/50 text-xs font-sans leading-snug">{step.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {(['Wanita', 'Pria'] as const).map((label) => {
                      const filled = label === 'Wanita' ? ev.signups_women : ev.signups_men
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-cream/25 text-[10px] font-sans w-12 tracking-wider">{label}</span>
                          <div className="flex gap-1 flex-1">
                            {Array.from({ length: ev.capacity }).map((_, idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 flex-1 transition-colors ${idx < filled ? 'bg-cognac' : 'bg-espresso-border'}`}
                              />
                            ))}
                          </div>
                          <span className="text-cream/25 text-[10px] font-sans w-12 text-right">
                            {ev.capacity - filled}/{ev.capacity} slot
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {SEED_ATTENDEES[ev.id] && (
                    <div className="mb-5 pt-4 border-t border-espresso-border">
                      <button
                        onClick={() => setExpandedEvent(expandedEvent === ev.id ? null : ev.id)}
                        className="w-full flex items-center justify-between group mb-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex -space-x-1.5">
                            {SEED_ATTENDEES[ev.id].map((a) => (
                              <div
                                key={a.name}
                                className="w-6 h-6 rounded-full border-2 border-espresso-light bg-cognac/25 flex items-center justify-center font-serif text-[10px] text-cognac overflow-hidden"
                              >
                                <img
                                  src={`/profiles/${a.name.split(' ')[0].toLowerCase()}.jpg`}
                                  alt={a.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none' }}
                                />
                                <span className="absolute font-serif text-[10px] text-cognac">{a.initial}</span>
                              </div>
                            ))}
                          </div>
                          <span className="text-cognac/70 text-xs font-sans tracking-wide group-hover:text-cognac transition-colors">
                            Siapa yang ikut ({SEED_ATTENDEES[ev.id].length}) →
                          </span>
                        </div>
                        <span className={`text-cognac/40 text-xs transition-transform duration-200 ${expandedEvent === ev.id ? 'rotate-180' : ''}`}>▾</span>
                      </button>

                      {expandedEvent === ev.id && (
                        <div className="mt-3 space-y-2">
                          {SEED_ATTENDEES[ev.id].map((a) => (
                            <div key={a.name} className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-cognac/20 flex items-center justify-center font-serif text-xs text-cognac overflow-hidden flex-shrink-0 border border-cognac/20">
                                <img
                                  src={`/profiles/${a.name.split(' ')[0].toLowerCase()}.jpg`}
                                  alt={a.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const el = e.currentTarget
                                    el.style.display = 'none'
                                    el.parentElement!.querySelector('span')?.removeAttribute('style')
                                  }}
                                />
                                <span style={{ display: 'none' }} className="font-serif text-xs text-cognac">{a.initial}</span>
                              </div>
                              <div>
                                <p className="text-cream/70 text-xs font-sans">{a.name}</p>
                                <p className="text-cream/25 text-[10px] font-sans capitalize">{a.gender === 'female' ? 'Wanita' : 'Pria'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-cream/70 text-base font-sans font-medium">
                          Rp {ev.price_idr.toLocaleString('id-ID')}
                        </span>
                        <span className="text-cream/25 text-xs font-sans ml-1">/ orang</span>
                      </div>
                      <span className="text-cream/20 text-[10px] font-sans tracking-wide">Termasuk drinks & snacks</span>
                    </div>
                    {signedUpEvents.has(ev.id) ? (
                      <div className="space-y-2">
                        <div className="block text-center w-full py-3 text-xs tracking-[0.15em] uppercase font-sans font-semibold border border-cognac/40 text-cognac bg-cognac/10">
                          ✓ Terdaftar — Menunggu Konfirmasi
                        </div>
                        <div className="border border-cognac/20 p-3 text-center" style={{ background: 'rgba(196,154,110,0.06)' }}>
                          <p className="text-cream/70 text-xs font-sans leading-relaxed mb-3">
                            Selamat! Kamu terdaftar untuk event ini.<br />
                            <span className="text-cognac">Bayar Rp 175.000 di hari H ya.</span>
                          </p>
                          <a
                            href={`https://wa.me/61400403294?text=${encodeURIComponent(`Halo Curated! Saya konfirmasi kehadiran saya di ${ev.name} pada ${ev.dateStr}. Nama: ${userProfile?.name ?? userEmail}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center w-full py-2 text-xs tracking-[0.1em] uppercase font-sans border border-green-600/40 text-green-400/80 hover:bg-green-600/10 transition-colors"
                          >
                            💬 Konfirmasi via WhatsApp
                          </a>
                        </div>
                      </div>
                    ) : showPhoneForm === ev.id ? (
                      <div className="space-y-2">
                        <p className="text-cream/40 text-[11px] font-sans">Nomor WhatsApp kamu</p>
                        <input
                          type="tel"
                          placeholder="08xx xxxx xxxx"
                          value={phoneInput[ev.id] ?? ''}
                          onChange={(e) => setPhoneInput(prev => ({ ...prev, [ev.id]: e.target.value }))}
                          className="w-full bg-transparent border border-espresso-border text-cream text-sm font-sans px-3 py-2.5 focus:outline-none focus:border-cognac/50 placeholder:text-cream/20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitSignup(ev)}
                            disabled={signingUp === ev.id}
                            className="flex-1 bg-cognac text-espresso py-2.5 text-xs tracking-[0.15em] uppercase font-sans font-semibold hover:bg-cognac-light disabled:opacity-50 transition-colors"
                          >
                            {signingUp === ev.id ? (
                              <span className="inline-flex items-center gap-2 justify-center">
                                <span className="w-3 h-3 border border-espresso/30 border-t-espresso rounded-full animate-spin" />
                                Mendaftar...
                              </span>
                            ) : 'Konfirmasi Daftar'}
                          </button>
                          <button
                            onClick={() => setShowPhoneForm(null)}
                            className="px-4 py-2.5 text-xs font-sans text-cream/30 border border-espresso-border hover:text-cream/60 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openSignup(ev)}
                        disabled={isSoldOut || signingUp === ev.id}
                        className={`block text-center w-full py-3 text-xs tracking-[0.15em] uppercase font-sans font-semibold transition-colors ${
                          isSoldOut
                            ? 'border border-espresso-border text-cream/20 cursor-not-allowed'
                            : 'bg-cognac text-espresso hover:bg-cognac-light disabled:opacity-50'
                        }`}
                      >
                        {isSoldOut ? 'Penuh' : 'Daftar Event'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {signupError && (
          <p className="text-red-400/70 text-xs font-sans text-center mt-4">{signupError}</p>
        )}
        <p className="text-cream/20 text-xs font-sans text-center mt-4">
          Semua peserta diverifikasi oleh Curated. Termasuk welcome drinks, snacks, MC, dan games. Slot terbatas — 3 pria & 3 wanita per acara.
        </p>
      </div>
    </section>
  )
}
