'use client'

import { useEffect, useState } from 'react'

const MATCH = {
  initial: 'A',
  name: 'Aryo S.',
  age: 30,
  role: 'Senior Associate',
  company: 'McKinsey Jakarta',
  city: 'South Jakarta',
  edu: 'NUS, Singapore',
  score: 94,
  bio: '"Family-oriented, intellectually curious, and genuinely looking for his person."',
}

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<null | 'interested' | 'passed'>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center bg-espresso overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_70%_50%,rgba(196,154,110,0.06)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cognac/20 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-20 items-center min-h-[calc(100vh-6rem)]">

          {/* Left — Copy */}
          <div className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-6 h-px bg-cognac/50" />
              <p className="text-cognac/80 text-xs tracking-[0.35em] uppercase font-sans">Jakarta · Private · By Application</p>
            </div>

            <h1 className="font-serif font-light text-[clamp(3rem,6.5vw,5rem)] text-cream leading-[1.05] tracking-tight mb-7">
              Private introductions
              <br />
              <span className="text-cream/40 italic">for ambitious professionals.</span>
            </h1>

            <p className="text-cream/55 text-lg md:text-xl max-w-xl mb-10 font-sans leading-relaxed">
              No swiping. No public profiles. We introduce verified Jakarta professionals — contact details only revealed after both sides confirm interest.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
              <a href="/join" className="group inline-flex items-center gap-2.5 bg-cognac text-espresso px-9 py-4 text-xs tracking-[0.15em] uppercase font-sans font-semibold hover:bg-cognac-light transition-all duration-200">
                Apply to Join
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
              <a href="#how-it-works" className="inline-flex items-center border border-cream/15 text-cream/50 px-9 py-4 text-xs tracking-[0.15em] uppercase font-sans hover:border-cream/30 hover:text-cream/80 transition-all duration-200">
                How It Works
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-cream/30">
              {['Private Introductions', 'Verified Members', 'Invite-Only · Jakarta'].map((item, i) => (
                <span key={item} className="flex items-center gap-6">
                  <span className="text-xs tracking-wider font-sans">{item}</span>
                  {i < 2 && <span className="w-px h-3 bg-cream/15" />}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Match UI mockup */}
          <div className={`hidden lg:flex flex-col gap-3 transition-all duration-1000 ease-out delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Notification bar */}
            <div
              className="flex items-center justify-between px-4 py-3 border border-cognac/25"
              style={{ background: 'linear-gradient(90deg, rgba(196,154,110,0.08), transparent)' }}
            >
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cognac/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cognac" />
                </span>
                <span className="text-cognac text-xs font-sans tracking-wide">3 new matches found</span>
              </div>
              <a href="/join" className="text-cream/30 text-xs font-sans hover:text-cognac transition-colors">See all →</a>
            </div>

            {/* Primary match card */}
            <div
              className="border border-espresso-border p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #221610 0%, #2E1A0E 100%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cognac/30 to-transparent" />

              {/* Profile row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-serif text-xl text-espresso font-semibold"
                  style={{ background: 'linear-gradient(135deg, #C49A6E, #9A7050)' }}
                >
                  {MATCH.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-light text-cream text-lg leading-tight">{MATCH.name}, {MATCH.age}</p>
                  <p className="text-cognac/70 text-xs font-sans truncate">{MATCH.role} · {MATCH.company}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-serif text-cognac text-xl leading-none">{MATCH.score}%</p>
                  <p className="text-cream/25 text-[10px] font-sans tracking-wide">match</p>
                </div>
              </div>

              {/* Compatibility bar */}
              <div className="h-px bg-espresso-border mb-1">
                <div className="h-px bg-gradient-to-r from-cognac to-cognac/20 transition-all duration-1000" style={{ width: `${MATCH.score}%` }} />
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-cream/20 text-[10px] font-sans">Compatibility</span>
                <span className="text-cognac/60 text-[10px] font-sans">{MATCH.city} · {MATCH.edu}</span>
              </div>

              {/* Bio */}
              <p className="text-cream/45 text-sm font-serif font-light italic leading-relaxed mb-5">{MATCH.bio}</p>

              {/* Actions */}
              {action === null ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setAction('interested')}
                    className="flex-1 bg-cognac text-espresso py-2.5 text-xs tracking-[0.15em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors"
                  >
                    Interested
                  </button>
                  <button
                    onClick={() => setAction('passed')}
                    className="flex-1 border border-espresso-border text-cream/40 py-2.5 text-xs tracking-[0.15em] uppercase font-sans hover:border-cream/20 hover:text-cream/60 transition-all"
                  >
                    Pass
                  </button>
                </div>
              ) : (
                <div className={`text-center py-2.5 text-xs font-sans tracking-wider ${action === 'interested' ? 'text-cognac border border-cognac/30' : 'text-cream/30 border border-espresso-border'}`}>
                  {action === 'interested' ? '✓ Introduction requested — we\'ll be in touch' : 'Passed · Next match coming soon'}
                </div>
              )}
            </div>

            {/* Locked cards row */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { initial: 'A', role: 'Associate Partner', company: 'BCG', score: 89 },
                { initial: 'D', role: 'Co-Founder', company: 'Series A', score: 86 },
              ].map((p) => (
                <div
                  key={p.initial}
                  className="relative border border-espresso-border p-4 overflow-hidden"
                  style={{ background: '#1A110C' }}
                >
                  {/* Blurred content */}
                  <div className="filter blur-[3px] select-none pointer-events-none">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-espresso-border flex items-center justify-center font-serif text-cream/20 text-sm">{p.initial}</div>
                      <div>
                        <div className="h-2 w-16 bg-cream/10 rounded mb-1" />
                        <div className="h-1.5 w-10 bg-cream/5 rounded" />
                      </div>
                    </div>
                    <div className="h-px bg-espresso-border mb-2">
                      <div className="h-px bg-cognac/30" style={{ width: `${p.score}%` }} />
                    </div>
                    <div className="h-1.5 w-full bg-cream/5 rounded mb-1" />
                    <div className="h-1.5 w-3/4 bg-cream/5 rounded" />
                  </div>

                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-espresso/70 backdrop-blur-[1px]">
                    <p className="text-cream/40 text-lg mb-1">🔒</p>
                    <a href="/join" className="text-cognac/70 text-[10px] font-sans tracking-wide hover:text-cognac transition-colors">
                      Mutual interest required
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <p className="text-center text-cream/20 text-[11px] font-sans tracking-wide">
              +1 more match waiting · <a href="/auth" className="text-cognac/50 hover:text-cognac transition-colors">Join to see yours</a>
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
