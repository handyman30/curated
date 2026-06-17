'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const BENEFITS = [
  {
    title: 'Tidak Ada Swipe Tanpa Henti',
    description:
      'Lewati budaya swipe yang melelahkan. Kami yang mencarikan match, kamu fokus pada percakapan nyata.',
  },
  {
    title: 'Profil Terverifikasi',
    description:
      'Setiap anggota diverifikasi identitas, pendidikan, dan latar belakang profesionalnya sebelum bergabung.',
  },
  {
    title: 'Kompatibilitas Berbantuan AI',
    description:
      'AI kami menganalisis sinyal kompatibilitas mendalam — nilai, gaya hidup, ambisi — bukan sekadar foto profil.',
  },
  {
    title: 'Komunitas Eksklusif',
    description:
      'Keanggotaan terbatas untuk menjaga kualitas. Hanya profesional serius dan ambisius — tidak ada yang buang waktu.',
  },
  {
    title: 'Perkenalan Berkualitas',
    description:
      'Setiap perkenalan disengaja. Kami hanya menghubungkanmu ketika ada potensi yang nyata.',
  },
  {
    title: 'Hanya untuk Hubungan Serius',
    description:
      'Semua orang di Cinta Kau Dan Dia menginginkan hal yang sama. Tidak ada ambiguitas — hanya mereka yang siap berkomitmen.',
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
            Pendekatan Kami
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-cream max-w-md leading-tight">
            Mengapa Cinta Kau Dan Dia Berbeda
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
