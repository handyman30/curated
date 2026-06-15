'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const STEPS = [
  {
    number: '01',
    title: 'Apply',
    description:
      'Submit a private application. Every profile is reviewed manually — no auto-approvals, no random signups.',
  },
  {
    number: '02',
    title: 'Verify',
    description:
      'Your profile is never shown publicly. Identity and professional background are checked before you are introduced to anyone.',
  },
  {
    number: '03',
    title: 'Match',
    description:
      'We identify compatibility on both sides. Contact details stay hidden until both parties confirm interest — privately.',
  },
  {
    number: '04',
    title: 'Meet',
    description:
      'Once both sides say yes, we make the introduction. No guessing, no ghosting, no cold messages out of nowhere.',
  },
]

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="how-it-works" className="py-28 md:py-36 bg-espresso-light">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
            The Process
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-cream">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-espresso-border">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`p-8 md:p-10 border-b border-espresso-border lg:border-b-0 lg:border-r last:border-r-0 transition-all duration-700 group hover:bg-espresso-card`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div
                className={`font-serif font-light text-6xl text-cognac/15 mb-7 leading-none select-none transition-colors duration-300 group-hover:text-cognac/25 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {step.number}
              </div>
              <h3 className="font-serif font-light text-2xl text-cream mb-4">{step.title}</h3>
              <p className="text-cream/45 text-sm leading-relaxed font-sans">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
