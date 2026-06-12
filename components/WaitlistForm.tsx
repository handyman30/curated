'use client'

import { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

type FormData = {
  name: string
  email: string
  age: string
  gender: string
  occupation: string
  linkedin: string
  instagram: string
  city: string
  goals: string
}

const EMPTY: FormData = {
  name: '', email: '', age: '', gender: '',
  occupation: '', linkedin: '', instagram: '', city: '', goals: '',
}


const inputClass =
  'w-full bg-transparent border border-espresso-border text-cream px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-cognac/50 transition-colors duration-200 placeholder-cream/15'

const selectClass =
  'w-full bg-espresso-light border border-espresso-border text-cream px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-cognac/50 transition-colors duration-200 appearance-none cursor-pointer'

const labelClass = 'block text-cream/35 text-[10px] tracking-[0.25em] uppercase mb-2 font-sans'

export default function WaitlistForm() {
  const [gender, setGender] = useState<'women' | 'men' | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { ref, isVisible } = useScrollAnimation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/.netlify/functions/waitlist-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, gender: gender ?? '' }),
      })
      if (form.email) sessionStorage.setItem('curated_email', form.email)
    } catch (err) {
      console.error('Submit error:', err)
    }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section id="waitlist" className="py-28 md:py-36 bg-espresso border-t border-espresso-border">
<div className="max-w-2xl mx-auto px-6">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-14 text-center">
            <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">
              Apply Now
            </p>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-cream mb-5">
              Join the Waitlist
            </h2>
            <p className="text-cream/45 font-sans leading-relaxed text-sm">
              Limited founding member spots. We review each application personally
              and follow up within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-16 border border-espresso-border px-8 text-center">
              <div className="font-serif text-4xl text-cognac mb-6">✓</div>
              <h3 className="font-serif font-light text-2xl text-cream mb-3">You&apos;re on the waitlist.</h3>
              <p className="text-cream/50 font-sans text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                While we review your application, you can already browse who&apos;s on Curated.
                If you want to reach out to someone, you&apos;ll need a membership — $5/month.
              </p>
              <a
                href="/dashboard"
                className="inline-block bg-cognac text-espresso px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors"
              >
                See Available Matches
              </a>
              <p className="text-cream/25 font-sans text-xs mt-6">
                Check your inbox (and junk folder) for a confirmation email.
              </p>
            </div>
          ) : !gender ? (
            <div>
              <p className="text-center text-cream/40 text-sm font-sans mb-8">
                I am joining as a...
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(['women', 'men'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className="group relative p-8 border border-espresso-border hover:border-cognac/50 transition-all duration-300 text-center"
                    style={{ background: 'linear-gradient(145deg, #1A110C, #221610)' }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cognac/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="font-serif font-light text-5xl text-cream/20 mb-4 select-none">
                      {g === 'women' ? '♀' : '♂'}
                    </div>
                    <p className="font-serif font-light text-2xl text-cream mb-2 capitalize">{g === 'women' ? 'Women' : 'Men'}</p>
                    <p className="text-cream/35 text-xs font-sans tracking-wide">
                      {g === 'women' ? 'I want curated introductions' : 'I want to be considered'}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-center text-cream/20 text-xs font-sans leading-relaxed">
                All male applicants are carefully verified. Priority given to female members.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-cognac/60 text-xs font-sans tracking-[0.2em] uppercase">
                  Applying as: <span className="text-cognac capitalize">{gender === 'women' ? 'Woman' : 'Man'}</span>
                </p>
                <button type="button" onClick={() => setGender(null)} className="text-cream/30 text-xs font-sans hover:text-cream/60 transition-colors">
                  Change
                </button>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name <span className="text-cream/20">*</span></label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email <span className="text-cream/20">*</span></label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
                </div>
              </div>

              {/* Age + Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Age <span className="text-cream/20">*</span></label>
                  <input type="number" name="age" required min="18" max="55" value={form.age} onChange={handleChange} placeholder="e.g. 28" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Occupation <span className="text-cream/20">*</span></label>
                  <input type="text" name="occupation" required value={form.occupation} onChange={handleChange} placeholder="e.g. Lawyer, Founder" className={inputClass} />
                </div>
              </div>

              {/* City + Goals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>City <span className="text-cream/20">*</span></label>
                  <input type="text" name="city" required value={form.city} onChange={handleChange} placeholder="e.g. Jakarta" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Relationship Goals <span className="text-cream/20">*</span></label>
                  <div className="relative">
                    <select name="goals" required value={form.goals} onChange={handleChange} className={selectClass}>
                      <option value="" disabled>Select</option>
                      <option value="serious">Serious Relationship</option>
                      <option value="marriage">Marriage</option>
                      <option value="open">Open to Both</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 text-xs pointer-events-none">↓</span>
                  </div>
                </div>
              </div>

              {/* LinkedIn + Instagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/you" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input type="text" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@handle" className={inputClass} />
                </div>
              </div>

              <p className="text-cream/20 text-xs font-sans leading-relaxed pt-1">
                Your information is only used for matching purposes and never shared without consent.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cognac text-espresso py-4 text-xs tracking-[0.15em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 border border-espresso/30 border-t-espresso rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Apply for Founding Membership'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
