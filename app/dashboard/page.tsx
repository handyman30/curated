'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type DiscoverProfile = {
  id: string
  name: string
  age: number
  gender: string
  occupation: string
  company: string
  city: string
  education: string
  bio: string
  instagram: string
  linkedin: string
  avatar_initial: string
  photo_url?: string
}

const FREE_VISIBLE = 4

function displayName(name: string, isPaid: boolean, isBlurred: boolean) {
  if (isPaid || !isBlurred) return name
  // Show first name only, blur the surname
  return name.split(' ')[0]
}

export default function Dashboard() {
  const router = useRouter()
  type MyProfile = { id: string; name: string; status: string; occupation: string; age: number } | null

  const [profiles, setProfiles] = useState<DiscoverProfile[]>([])
  const [likes, setLikes] = useState<Set<string>>(new Set())
  const [isPaid] = useState(false)
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all')
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string>('')
  const [myProfile, setMyProfile] = useState<MyProfile>(undefined as unknown as MyProfile)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email || sessionStorage.getItem('curated_email') || ''
      setUserEmail(email)
      if (email) sessionStorage.setItem('curated_email', email)
      loadLikes(email)
      if (email) {
        fetch('/api/my-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }).then(r => r.json()).then(j => setMyProfile(j.profile ?? null))
      } else {
        setMyProfile(null)
      }
    })
    loadProfiles()
  }, [])

  async function loadProfiles() {
    const { data } = await supabase.from('discover_profiles').select('*').eq('is_active', true)
    setProfiles(data ?? [])
    setLoading(false)
  }

  async function loadLikes(email: string) {
    if (!email) return
    const { data } = await supabase.from('likes').select('to_discover_id').eq('from_email', email)
    setLikes(new Set((data ?? []).map((l: { to_discover_id: string }) => l.to_discover_id)))
  }

  async function toggleLike(profileId: string) {
    if (!userEmail) { router.push('/auth'); return }
    if (likes.has(profileId)) {
      await supabase.from('likes').delete().eq('from_email', userEmail).eq('to_discover_id', profileId)
      setLikes((prev) => { const s = new Set(prev); s.delete(profileId); return s })
    } else {
      await supabase.from('likes').insert({ from_email: userEmail, to_discover_id: profileId })
      setLikes((prev) => new Set([...prev, profileId]))
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    sessionStorage.removeItem('curated_email')
    router.push('/')
  }

  const filtered = filter === 'all' ? profiles : profiles.filter((p) => p.gender === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center">
        <div className="w-4 h-4 border border-cognac/40 border-t-cognac rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-espresso">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-espresso/95 backdrop-blur-sm border-b border-espresso-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-serif font-light text-cream text-lg tracking-[0.2em] uppercase">Curated</a>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 border border-espresso-border p-1">
              {(['all', 'female', 'male'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs tracking-[0.1em] uppercase font-sans transition-colors ${
                    filter === f ? 'bg-cognac text-espresso' : 'text-cream/40 hover:text-cream'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'female' ? 'Women' : 'Men'}
                </button>
              ))}
            </div>
            {!isPaid && (
              <a
                href="/subscribe"
                className="bg-cognac text-espresso text-xs tracking-[0.15em] uppercase font-sans font-semibold px-4 py-2 hover:bg-cognac-light transition-colors"
              >
                Unlock · Rp 75.000/bln
              </a>
            )}
            {userEmail ? (
              <button onClick={handleSignOut} className="text-cream/30 text-xs font-sans hover:text-cream/60 transition-colors hidden sm:block">
                Sign out
              </button>
            ) : (
              <a href="/auth" className="text-cream/30 text-xs font-sans hover:text-cream/60 transition-colors hidden sm:block">
                Log in
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* My application status */}
        {myProfile === null && userEmail && (
          <div className="mb-6 border border-cognac/25 p-4 flex items-center justify-between gap-4" style={{ background: 'rgba(196,154,110,0.05)' }}>
            <p className="text-cream/60 text-sm font-sans">Kamu belum daftar waitlist — lengkapi profilmu dulu.</p>
            <a href="/apply" className="flex-shrink-0 bg-cognac text-espresso text-xs tracking-[0.15em] uppercase font-sans font-semibold px-4 py-2 hover:bg-cognac-light transition-colors">
              Daftar Sekarang
            </a>
          </div>
        )}
        {myProfile?.status === 'waitlist' && (
          <div className="mb-6 border border-espresso-border p-4 flex items-center gap-3" style={{ background: '#1A110C' }}>
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cognac/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cognac/70" />
            </span>
            <p className="text-cream/50 text-sm font-sans">
              Aplikasimu sedang direview, {myProfile.name?.split(' ')[0]}. Biasanya 24–48 jam.
            </p>
          </div>
        )}
        {myProfile?.status === 'approved' && (
          <div className="mb-6 border border-cognac/30 p-4 flex items-center gap-3" style={{ background: 'rgba(196,154,110,0.08)' }}>
            <span className="text-cognac text-sm">✓</span>
            <p className="text-cognac/80 text-sm font-sans">
              Aplikasimu disetujui — selamat datang di Curated, {myProfile.name?.split(' ')[0]}!
            </p>
          </div>
        )}
        {myProfile?.status === 'rejected' && (
          <div className="mb-6 border border-espresso-border p-4">
            <p className="text-cream/30 text-sm font-sans">Aplikasimu tidak lolos seleksi kali ini. Kamu bisa coba lagi nanti.</p>
          </div>
        )}

        {/* Value prop banner */}
        <div className="mb-8 border border-cognac/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          style={{ background: 'linear-gradient(90deg, rgba(196,154,110,0.06), transparent)' }}>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cognac/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cognac" />
            </span>
            <p className="text-cream/70 text-sm font-sans">
              <span className="text-cognac font-medium">{filtered.length} {filtered.length === 1 ? 'person' : 'people'}</span>
              {filtered.length === 0
                ? ' — more joining soon. You\'ll be notified when there\'s a match.'
                : ' on Curated. We only charge when both sides say yes.'}
            </p>
          </div>
          <p className="text-cream/25 text-xs font-sans hidden md:block">No ghosting. Mutual interest confirmed first.</p>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-32">
            <p className="font-serif font-light text-cream/30 text-2xl mb-3">Segera hadir</p>
            <p className="text-cream/20 text-sm font-sans max-w-xs mx-auto leading-relaxed">
              Kami sedang mengumpulkan member perdana. Kamu akan dapat notifikasi email begitu ada profil yang cocok untukmu.
            </p>
          </div>
        )}

        {/* Profile grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((profile, index) => {
              const isLiked = likes.has(profile.id)
              const isBlurred = !isPaid && index >= FREE_VISIBLE
              const name = displayName(profile.name, isPaid, isBlurred)

              return (
                <div
                  key={profile.id}
                  className="relative border border-espresso-border flex flex-col overflow-hidden group"
                  style={{ background: 'linear-gradient(160deg, #1A110C 0%, #221610 100%)' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cognac/20 to-transparent group-hover:via-cognac/40 transition-all duration-300" />

                  {/* Card content — blurred when locked */}
                  <div className={`p-5 flex flex-col gap-4 flex-1 ${isBlurred ? 'blur-[20px] select-none pointer-events-none' : ''}`}>

                    {/* Avatar + name */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-serif text-xl text-espresso font-semibold overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #C49A6E, #9A7050)' }}
                      >
                        {profile.photo_url ? (
                          <img src={profile.photo_url} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          profile.avatar_initial
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-serif font-light text-cream text-lg leading-tight">{name}{isBlurred ? '' : `, ${profile.age}`}</p>
                          {!isBlurred && <span className="text-cream/30 text-xs font-sans">{profile.age}</span>}
                          {isBlurred && <span className="text-cream/20 text-xs font-sans blur-sm select-none">Surname hidden</span>}
                        </div>
                        <p className="text-cognac/60 text-xs font-sans truncate">{profile.occupation}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <p className="text-cream/50 text-xs font-sans">{profile.company} · {profile.city}</p>
                      <p className="text-cream/30 text-xs font-sans">{profile.education}</p>
                    </div>

                    {/* Bio */}
                    <p className="text-cream/45 text-sm font-serif font-light italic leading-relaxed flex-1">{profile.bio}</p>

                    {/* Locked contact details */}
                    <div className="space-y-1.5 pt-3 border-t border-espresso-border">
                      <div className="flex items-center gap-2">
                        <span className="text-cream/20 text-xs font-sans w-16">Instagram</span>
                        <span className={`text-xs font-sans ${isPaid ? 'text-cognac' : 'text-cream/20 blur-sm select-none'}`}>{profile.instagram}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cream/20 text-xs font-sans w-16">LinkedIn</span>
                        <span className={`text-xs font-sans ${isPaid ? 'text-cognac' : 'text-cream/20 blur-sm select-none'}`}>{profile.linkedin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Like button */}
                  {!isBlurred && (
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => toggleLike(profile.id)}
                        className={`w-full py-2.5 text-xs tracking-[0.15em] uppercase font-sans transition-all duration-200 ${
                          isLiked
                            ? 'bg-cognac/20 border border-cognac/40 text-cognac'
                            : 'border border-espresso-border text-cream/40 hover:border-cognac/40 hover:text-cognac'
                        }`}
                      >
                        {isLiked ? '♥ Interested' : '♡ I\'m interested'}
                      </button>
                    </div>
                  )}

                  {/* Lock overlay */}
                  {isBlurred && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(14,9,7,0.6)' }}>
                      <svg className="w-5 h-5 text-cognac/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <p className="text-cream/35 text-xs font-sans mb-4 tracking-widest uppercase">Locked</p>
                      <a
                        href="/subscribe"
                        className="bg-cognac text-espresso text-xs tracking-[0.15em] uppercase font-sans font-semibold px-5 py-2.5 hover:bg-cognac-light transition-colors"
                      >
                        Unlock · Rp 75.000/bln
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
