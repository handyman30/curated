'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const BENEFITS = [
  {
    title: 'No Endless Swiping',
    description:
      'Skip the exhausting swipe culture. We do the matching work so you can focus on real conversations.',
  },
  {
    title: 'Verified Profiles',
    description:
      'Every member is verified for identity, education, and professional background before joining.',
  },
  {
    title: 'AI-Assisted Compatibility',
    description:
      'Our AI analyses deep compatibility signals — values, lifestyle, ambitions — not just a profile photo.',
  },
  {
    title: 'Exclusive Community',
    description:
      'Limited membership ensures quality. Ambitious, serious professionals only — no time-wasters.',
  },
  {
    title: 'Quality Introductions',
    description:
      'Every introduction is intentional. We only connect you when there is genuine potential.',
  },
  {
    title: 'Serious Relationships Only',
    description:
      'Everyone on Curated wants the same thing. No ambiguity — only people ready for commitment.',
  },
]

export default function WhyCurated() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="why-curated" className="py-28 md:py-36 bg-espresso">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
            Our Approach
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-cream max-w-lg leading-tight">
            Why Curated is Different
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-espresso-border">
          {BENEFITS.map((benefit, i) => (
            <div
              key={benefit.title}
              className={`bg-espresso p-8 md:p-10 group hover:bg-espresso-card transition-all duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-6 h-px bg-cognac/30 mb-8 group-hover:w-10 group-hover:bg-cognac/60 transition-all duration-300" />
              <h3 className="font-serif font-light text-xl text-cream mb-3">{benefit.title}</h3>
              <p className="text-cream/45 text-sm leading-relaxed font-sans">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
