'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const TESTIMONIALS = [
  {
    quote:
      "Dua tahun buang waktu di app ketemu orang yang tidak serius. Beberapa minggu di Cinta Kau Dan Dia, aku langsung dikenalkan dengan seseorang yang benar-benar cocok.",
    name: 'Anindya R.',
    role: 'Strategy Consultant, Jakarta',
    initial: 'A',
  },
  {
    quote:
      "Proses verifikasinya bikin aku merasa aman. Setiap perkenalan terasa disengaja, bukan asal-asalan. Seperti inilah seharusnya kenalan.",
    name: 'Priscilla M.',
    role: 'Associate, Firma Hukum Terkemuka',
    initial: 'P',
  },
  {
    quote:
      "Sebagai orang yang sering traveling untuk kerja, aku butuh sesuatu yang menghargai waktuku. Cinta Kau Dan Dia memberikan perkenalan yang benar-benar worth it.",
    name: 'Dinda S.',
    role: 'VP Finance, Jakarta',
    initial: 'D',
  },
]

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-28 md:py-36 bg-espresso border-t border-espresso-border">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
            Cerita
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-cream">
            Kata Mereka
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-espresso-border">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`bg-espresso p-8 md:p-10 flex flex-col gap-8 transition-all duration-700 hover:bg-espresso-card ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Quote mark */}
              <div className="font-serif text-5xl text-cognac/20 leading-none select-none">"</div>

              <blockquote className="font-serif font-light text-cream/80 text-lg leading-relaxed italic flex-1">
                {t.quote}
              </blockquote>

              {/* Profile */}
              <div className="flex items-center gap-4 pt-4 border-t border-espresso-border">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-serif text-espresso font-semibold"
                  style={{ background: 'linear-gradient(135deg, #C49A6E, #9A7050)' }}
                >
                  {t.initial}
                </div>
                <div>
                  <p className="text-cream/80 text-sm font-sans font-medium">{t.name}</p>
                  <p className="text-cream/35 text-xs font-sans">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-cream/20 text-xs font-sans tracking-wide">
          Nama diubah untuk privasi. Testimoni mewakili feedback anggota pendiri.
        </p>
      </div>
    </section>
  )
}
