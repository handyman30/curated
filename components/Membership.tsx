'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const TIERS = [
  {
    name: 'Event',
    price: 'Rp 175.000',
    period: '/acara',
    tag: 'Mulai Di Sini',
    description: 'Gathering Sabtu — 3 pria, 3 wanita, satu venue premium. MC, games, drinks & snacks sudah termasuk.',
    features: [
      'Welcome drinks & snacks (fries)',
      'MC host + games (Kahoot, kartu, drawing)',
      'Venue premium di Jakarta',
      'Tamu diverifikasi Cinta Kau Dan Dia — bukan sembarang orang',
    ],
    cta: 'Lihat Acara',
    href: '#events',
    inverted: false,
  },
  {
    name: 'Matchmaking',
    price: 'Rp 75.000',
    period: '/bulan',
    tag: 'Paling Populer',
    description: 'Kami temukan match kamu, konfirmasi minat kedua pihak, lalu perkenalkan — tidak ada ghosting.',
    features: [
      'Profil terverifikasi sepenuhnya',
      'Perkenalan personal oleh Cinta Kau Dan Dia',
      'Minat kedua pihak dikonfirmasi dahulu',
      'Akses Instagram & LinkedIn match',
    ],
    cta: 'Daftar Sekarang',
    href: '/join',
    inverted: true,
  },
  {
    name: 'Concierge',
    price: 'Custom',
    period: '',
    tag: 'Segera Hadir',
    description: 'Layanan matchmaking penuh dengan personal matchmaker dan perkenalan eksklusif.',
    features: [
      'Personal matchmaker',
      'Perkenalan bespoke',
      'Konsultasi profil',
      'Akses acara VIP',
    ],
    cta: 'Hubungi Kami',
    href: '/join',
    inverted: false,
  },
]

export default function Membership() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="membership" className="py-28 md:py-36 bg-espresso-light">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
            Anggota Pendiri
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-cream">Keanggotaan</h2>
        </div>

        <div
          className={`mb-14 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '150ms' }}
        >
          <div className="inline-flex items-center gap-3 border border-cognac/25 px-4 py-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cognac/50 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cognac/70" />
            </span>
            <span className="text-cream/50 text-xs font-sans tracking-wider">
              Gratis selama beta — anggota pendiri mendapat harga terkunci selamanya
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-espresso-border">
          {TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative p-8 md:p-10 flex flex-col transition-all duration-700 ${
                tier.inverted
                  ? 'bg-cognac'
                  : 'bg-espresso-light hover:bg-espresso-card'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mb-8">
                <p className={`text-[10px] tracking-[0.25em] uppercase font-sans mb-3 ${tier.inverted ? 'text-espresso/50' : 'text-cognac/60'}`}>
                  {tier.tag}
                </p>
                <h3 className={`font-serif font-light text-3xl mb-2 ${tier.inverted ? 'text-espresso' : 'text-cream'}`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`font-serif text-4xl font-light ${tier.inverted ? 'text-espresso' : 'text-cream'}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={`text-sm font-sans ${tier.inverted ? 'text-espresso/50' : 'text-cream/40'}`}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed font-sans ${tier.inverted ? 'text-espresso/60' : 'text-cream/45'}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-3 text-sm font-sans ${tier.inverted ? 'text-espresso/65' : 'text-cream/45'}`}>
                    <span className={`mt-0.5 text-xs flex-shrink-0 ${tier.inverted ? 'text-espresso/35' : 'text-cognac/40'}`}>—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={`block text-center py-3 text-xs tracking-[0.15em] uppercase font-sans font-semibold transition-all duration-200 ${
                  tier.inverted
                    ? 'bg-espresso text-cognac hover:bg-espresso-light'
                    : 'border border-cognac/40 text-cognac hover:bg-cognac hover:text-espresso'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <p className="text-cream/25 text-xs font-sans tracking-wide">
            Gratis selama beta. Tidak perlu kartu kredit untuk daftar waitlist.
          </p>
        </div>
      </div>
    </section>
  )
}
