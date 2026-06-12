'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const FREE_PROFILE = {
  initial: 'R',
  name: 'Rania K., 27',
  role: 'Strategy Consultant',
  company: 'McKinsey Jakarta',
  city: 'South Jakarta',
  education: 'LSE, London',
  match: '94',
  about: '"Loves long-form conversations, hikes on weekends, and makes a mean rendang."',
}

const LOCKED_PROFILES = [
  { initial: 'A', role: 'Senior Associate', company: 'Goldman Sachs', match: '89' },
  { initial: 'D', role: 'Co-Founder', company: 'Series A Startup', match: '86' },
  { initial: 'P', role: 'Associate Partner', company: 'BCG Jakarta', match: '82' },
]

export default function MatchPreview() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-28 md:py-36 bg-espresso-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
            Your Matches
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-serif font-light text-4xl md:text-5xl text-cream max-w-lg leading-tight">
              We introduce you.
              <br />
              <span className="text-cream/45 italic">You decide.</span>
            </h2>
            <p className="text-cream/40 text-sm font-sans max-w-xs leading-relaxed">
              After your application is reviewed, we send you curated matches.
              One free preview — subscribe to unlock the rest.
            </p>
          </div>
        </div>

        {/* Profile cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* FREE card — full visible */}
          <div
            className="md:col-span-2 relative border border-espresso-border p-7 flex flex-col gap-5"
            style={{ background: 'linear-gradient(160deg, #221610 0%, #3D2416 60%, #1A110C 100%)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cognac/40 to-transparent" />

            {/* Match badge */}
            <div className="flex items-center justify-between">
              <span className="text-cognac/60 text-[10px] tracking-[0.3em] uppercase font-sans">
                Your Match
              </span>
              <div className="flex items-center gap-1.5 border border-cognac/25 px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cognac/60" />
                <span className="text-cognac text-xs font-sans">{FREE_PROFILE.match}% Compatible</span>
              </div>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-serif text-2xl font-light text-espresso"
                style={{ background: 'linear-gradient(135deg, #C49A6E, #9A7050)' }}
              >
                {FREE_PROFILE.initial}
              </div>
              <div>
                <p className="font-serif font-light text-xl text-cream">{FREE_PROFILE.name}</p>
                <p className="text-cognac/70 text-xs font-sans">{FREE_PROFILE.role} · {FREE_PROFILE.company}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              {[
                { label: 'City', value: FREE_PROFILE.city },
                { label: 'Education', value: FREE_PROFILE.education },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-espresso-border pb-2">
                  <span className="text-cream/30 text-xs font-sans tracking-wide">{item.label}</span>
                  <span className="text-cream/70 text-xs font-sans">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <p className="text-cream/50 text-sm font-serif font-light italic leading-relaxed">
              {FREE_PROFILE.about}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <a
                href="#waitlist"
                className="flex-1 bg-cognac text-espresso text-center py-3 text-xs tracking-[0.15em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors"
              >
                I'm Interested
              </a>
              <a
                href="#waitlist"
                className="flex-1 border border-espresso-border text-cream/50 text-center py-3 text-xs tracking-[0.15em] uppercase font-sans hover:border-cream/30 hover:text-cream/80 transition-all"
              >
                Pass
              </a>
            </div>
          </div>

          {/* LOCKED cards */}
          <div className="md:col-span-2 grid grid-cols-1 gap-4">
            {LOCKED_PROFILES.map((p, i) => (
              <div
                key={p.initial}
                className="relative border border-espresso-border p-6 overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1A110C, #221610)' }}
              >
                {/* Blurred content */}
                <div className="filter blur-sm select-none pointer-events-none">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-cognac/40 text-[10px] tracking-[0.3em] uppercase font-sans">Match #{i + 2}</span>
                    <span className="text-cognac/60 text-xs font-sans border border-cognac/15 px-2 py-0.5">{p.match}% Compatible</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg text-espresso/60"
                      style={{ background: 'linear-gradient(135deg, #9A7050, #7A5040)' }}
                    >
                      {p.initial}
                    </div>
                    <div>
                      <p className="font-serif font-light text-lg text-cream/60">{p.initial}●●●●●●, 2●</p>
                      <p className="text-cream/40 text-xs font-sans">{p.role} · {p.company}</p>
                    </div>
                  </div>
                </div>

                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-espresso-light/80 backdrop-blur-[1px]">
                  <div className="text-center">
                    <div className="text-cognac/50 text-2xl mb-2">🔒</div>
                    <p className="text-cream/60 text-xs font-sans tracking-wide mb-3">Profile locked</p>
                    <a
                      href="#waitlist"
                      className="inline-block bg-cognac/10 border border-cognac/30 text-cognac text-xs tracking-[0.15em] uppercase font-sans px-4 py-2 hover:bg-cognac/20 transition-colors"
                    >
                      Unlock · $5/mo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div
          className={`mt-10 text-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '400ms' }}
        >
          <p className="text-cream/25 text-xs font-sans">
            Profiles are illustrative. Real matches are personally reviewed before introduction.
          </p>
        </div>
      </div>
    </section>
  )
}
