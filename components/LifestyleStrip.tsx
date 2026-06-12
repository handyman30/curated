'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const CARDS = [
  {
    label: 'Ambitious',
    headline: "For women\nwho've outgrown\nthe apps.",
    sub: 'Curated is built for Jakarta professionals tired of wasting weekends on the wrong men.',
    gradient: 'linear-gradient(145deg, #1A110C 0%, #3D2416 60%, #1A110C 100%)',
    accent: true,
  },
  {
    label: 'Verified',
    headline: 'Every man\nis vetted\nbefore you meet.',
    sub: 'We verify identity, education, and career before any introduction.',
    gradient: 'linear-gradient(145deg, #221610 0%, #4A2E1A 50%, #221610 100%)',
    accent: false,
  },
  {
    label: 'Exclusive',
    headline: 'Your circle\nshould match\nyour ambition.',
    sub: 'Limited membership. Lawyers, founders, consultants, bankers — people who get it.',
    gradient: 'linear-gradient(145deg, #1A110C 0%, #2E1A0E 60%, #1A110C 100%)',
    accent: false,
  },
]

export default function LifestyleStrip() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-0 bg-espresso overflow-hidden">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARDS.map((card, i) => (
            <div
              key={card.label}
              className={`relative h-80 md:h-96 p-8 flex flex-col justify-between border border-espresso-border overflow-hidden group cursor-default transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                background: card.gradient,
                transitionDelay: `${i * 100}ms`,
                boxShadow: card.accent ? '0 0 60px rgba(196,154,110,0.07)' : 'none',
              }}
            >
              {/* Top line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-all duration-500 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(196,154,110,0.4), transparent)',
                  opacity: card.accent ? 1 : 0.3,
                }}
              />

              {/* Warm orb */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: 'radial-gradient(circle, rgba(196,154,110,0.08) 0%, transparent 70%)',
                }}
              />

              {/* Label */}
              <p className="text-cognac/70 text-xs tracking-[0.3em] uppercase font-sans">
                {card.label}
              </p>

              {/* Headline + sub */}
              <div>
                <h3 className="font-serif font-light text-cream text-3xl leading-tight mb-4 whitespace-pre-line">
                  {card.headline}
                </h3>
                <p className="text-cream/40 text-sm font-sans leading-relaxed">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
