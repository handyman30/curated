'use client'

import { useMemo } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const VENUES = [
  { name: 'Osteria Gia', address: 'Jl. Gunawarman, Kebayoran Baru', time: '18:30', type: 'Dinner' },
  { name: 'Union Jakarta', address: 'Grand Indonesia, Jakarta Pusat', time: '19:00', type: 'Coffee & Drinks' },
  { name: 'Roemah Koffie', address: 'Puri Indah Mall, Jakarta Barat', time: '10:00', type: 'Brunch' },
  { name: 'GBK Walk', address: 'Gelora Bung Karno, Senayan', time: '07:00', type: 'Morning Walk' },
  { name: 'Lara Djonggrang', address: 'Jl. Teuku Cik Di Tiro, Menteng', time: '19:30', type: 'Dinner' },
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
  { men: 2, women: 2 },
  { men: 1, women: 2 },
  { men: 0, women: 0 },
]

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

  const events = useMemo(() => {
    const saturdays = nextSaturdays(3)
    return saturdays.map((sat, i) => {
      const venue = VENUES[i % VENUES.length]
      const signups = SEED_SIGNUPS[i]
      return {
        id: `evt-${i}`,
        ...venue,
        date: fmt(sat, venue.time),
        capacity: 3,
        signups_men: signups.men,
        signups_women: signups.women,
        price_idr: 50000,
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
          <p className="text-cream/40 font-sans text-sm md:text-base max-w-xl leading-relaxed">
            Setiap Sabtu kami host pertemuan kecil di Jakarta. Kami yang pilih tempatnya, kami yang kurasi tamunya.
            Kamu tinggal datang.
          </p>
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
                  <div className="mb-5">
                    <p className="text-cognac text-xs tracking-[0.15em] uppercase font-sans mb-1">{formatDay(ev.date)}</p>
                    <p className="text-cream/30 text-xs font-sans">{ev.time} WIB · {ev.type}</p>
                  </div>

                  {/* Venue */}
                  <h3 className={`font-serif font-light text-xl mb-1 ${isSoldOut ? 'text-cream/40' : 'text-cream'}`}>
                    {ev.name}
                  </h3>
                  <p className="text-cream/30 text-xs font-sans mb-6">{ev.address}</p>

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

                  {/* Price + CTA */}
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-cream/50 text-sm font-sans">
                        Rp {ev.price_idr.toLocaleString('id-ID')}
                      </span>
                      <span className="text-cream/20 text-xs font-sans">per orang</span>
                    </div>
                    <a
                      href="#waitlist"
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
          Semua peserta diverifikasi oleh Curated. Slot terbatas — 3 pria & 3 wanita per acara.
        </p>
      </div>
    </section>
  )
}
