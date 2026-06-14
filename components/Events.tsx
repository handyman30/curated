'use client'

import { useMemo, useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const VENUES = [
  { name: 'Monolog', address: 'Plasa Senayan, Jakarta Selatan', time: '10:00', type: 'Coffee Morning' },
  { name: 'Tanamera Coffee', address: 'Jl. Wolter Monginsidi, Senopati', time: '10:30', type: 'Specialty Coffee' },
  { name: 'Common Grounds', address: 'Jl. Kemang Raya 72, Jakarta Selatan', time: '10:00', type: 'Brunch & Coffee' },
  { name: 'Kopi Tuku', address: 'Jl. Cipete Raya, Jakarta Selatan', time: '09:30', type: 'Morning Coffee' },
  { name: 'Simetri Coffee', address: 'Jl. Kemang Selatan, Jakarta Selatan', time: '10:00', type: 'Coffee & Chat' },
]

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

function nextSaturdays(count: number): Date[] {
  const result: Date[] = []
  const d = new Date()
  // Start from tomorrow to avoid today
  d.setDate(d.getDate() + 1)
  while (result.length < count) {
    if (d.getDay() === 6) result.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return result
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const hh = Math.floor(total / 60) % 24
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function fmt(date: Date, time: string) {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d
}

function formatDay(d: Date) {
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function slotsLeft(cap: number, filled: number) { return cap - filled }

export default function Events() {
  const { ref, isVisible } = useScrollAnimation()
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  const events = useMemo(() => {
    const saturdays = nextSaturdays(3)
    return saturdays.map((sat, i) => {
      const venue = VENUES[i % VENUES.length]
      const signups = SEED_SIGNUPS[i]
      return {
        id: `evt-${i}`,
        name: venue.name,
        address: venue.address,
        time: venue.time,
        type: venue.type,
        date: fmt(sat, venue.time),
        capacity: 3,
        signups_men: signups.men,
        signups_women: signups.women,
        price_idr: 175000,
      }
    })
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
          {/* What's included */}
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

                {/* Almost full badge */}
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
                  {/* Date & type */}
                  <div className="mb-4">
                    <p className="text-cognac text-xs tracking-[0.15em] uppercase font-sans mb-1">{formatDay(ev.date)}</p>
                    <p className="text-cream/30 text-xs font-sans">{ev.time} WIB · {ev.type}</p>
                  </div>

                  {/* Age badge */}
                  <div className="inline-flex items-center gap-2 border border-cognac/30 px-3 py-1 mb-4 w-fit">
                    <span className="text-cognac/70 text-[10px] tracking-[0.2em] uppercase font-sans">Open</span>
                    <span className="text-cognac text-sm font-serif font-light">23–36 tahun</span>
                  </div>

                  {/* Venue */}
                  <h3 className={`font-serif font-light text-xl mb-1 ${isSoldOut ? 'text-cream/40' : 'text-cream'}`}>
                    {ev.name}
                  </h3>
                  <p className="text-cream/30 text-xs font-sans mb-5">{ev.address}</p>

                  {/* Agenda timeline */}
                  <div className="mb-5 space-y-0">
                    {[
                      { time: ev.time,                         label: 'Ketemu & welcome drinks' },
                      { time: addMinutes(ev.time, 20),         label: 'Ice breaker — perkenalan singkat' },
                      { time: addMinutes(ev.time, 45),         label: 'Kahoot & card games bareng MC' },
                      { time: addMinutes(ev.time, 90),         label: 'Drawing game — tebak gambar' },
                      { time: addMinutes(ev.time, 120),        label: 'Tukar kontak & wrap up' },
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

                  {/* Capacity bars */}
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

                  {/* Who Joined toggle */}
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

                  {/* Price + CTA */}
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
                    <a
                      href="/auth"
                      className={`block text-center w-full py-3 text-xs tracking-[0.15em] uppercase font-sans font-semibold transition-colors ${
                        isSoldOut
                          ? 'border border-espresso-border text-cream/20 pointer-events-none'
                          : 'bg-cognac text-espresso hover:bg-cognac-light'
                      }`}
                    >
                      {isSoldOut ? 'Penuh' : 'Daftar Waitlist'}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-cream/20 text-xs font-sans text-center mt-8">
          Semua peserta diverifikasi oleh Curated. Termasuk welcome drinks, snacks, MC, dan games. Slot terbatas — 3 pria & 3 wanita per acara.
        </p>
      </div>
    </section>
  )
}
