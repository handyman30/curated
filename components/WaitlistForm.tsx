'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function WaitlistForm() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="waitlist" className="py-28 md:py-36 bg-espresso border-t border-espresso-border">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-cognac/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">Apply Now</p>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-cream mb-5">
            Join the Waitlist
          </h2>
          <p className="text-cream/45 font-sans leading-relaxed text-sm mb-10 max-w-sm mx-auto">
            Buat akun, lengkapi profilmu, dan bergabung. Kami review setiap aplikasi secara personal dan kabari dalam 48 jam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/auth"
              className="inline-block bg-cognac text-espresso px-10 py-4 text-xs tracking-[0.2em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors"
            >
              Register & Apply →
            </a>
            <a
              href="/dashboard"
              className="inline-block border border-espresso-border text-cream/40 px-10 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:border-cognac/40 hover:text-cream/60 transition-colors"
            >
              Browse Member
            </a>
          </div>

          <p className="text-cream/20 text-xs font-sans mt-6">Gratis. Tidak perlu kartu kredit.</p>
        </div>
      </div>
    </section>
  )
}
