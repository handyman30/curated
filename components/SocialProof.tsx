'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const COMPANIES = [
  'McKinsey', 'Goldman Sachs', 'BCG', 'Gojek', 'Tokopedia',
  'Grab', 'Bank Mandiri', 'BCA', 'Bain', 'Pertamina',
]

const STATS = [
  { value: '< 48hrs', label: 'Average response to application' },
  { value: '94%', label: 'Member satisfaction with introductions' },
  { value: 'Verified', label: 'Every single profile' },
]

export default function SocialProof() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-28 md:py-36 bg-espresso-light border-t border-espresso-border">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-espresso-border mb-16">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`bg-espresso-light p-8 md:p-10 text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-serif font-light text-4xl md:text-5xl text-cognac mb-3">
                  {stat.value}
                </div>
                <p className="text-cream/40 text-xs tracking-[0.15em] uppercase font-sans">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Central quote */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <blockquote className="font-serif font-light text-3xl md:text-4xl text-cream leading-snug">
              "Join professionals from Jakarta&rsquo;s{' '}
              <span className="text-cream/45 italic">leading companies and startups.</span>"
            </blockquote>
          </div>

          {/* Company names */}
          <div
            className={`transition-all duration-700 text-center ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <p className="text-cream/15 text-[10px] tracking-[0.4em] uppercase mb-7 font-sans">
              Members from
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {COMPANIES.map((company) => (
                <span key={company} className="text-cream/20 text-sm font-sans tracking-wide hover:text-cognac/50 transition-colors duration-200 cursor-default">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
