'use client'

import { useState, useMemo, useEffect } from 'react'

type LikeRow = { from_email: string; from_name: string; liked_profile: string; created_at: string }

type Applicant = {
  id: string
  name: string
  email: string
  age: number
  gender: string
  occupation: string
  city: string
  goals: string
  linkedin: string
  instagram: string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'waitlist' | 'approved' | 'rejected' | 'events' | 'interests'>('waitlist')
  const [likes, setLikes] = useState<LikeRow[]>([])

  const demoEvents = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
    const dateStr = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    return [
      {
        id: 'evt-0',
        venue: 'Monolog',
        address: 'Plaza Senayan, Jakarta Selatan',
        ageGroup: 'Open · 23–36 tahun',
        date: `${dateStr} · 10:00 WIB`,
        capacity: 3,
        attendees: [
          { name: 'Dian Rachmanda', gender: 'male', age: 28, photo: '/profiles/dian.jpg' },
          { name: 'Jennifer Christiana', gender: 'female', age: 28, photo: '/profiles/jennifer.jpg' },
          { name: 'Handy Hasan', gender: 'male', age: 28, photo: '/profiles/handy.jpg' },
        ],
      },
    ]
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
      load(password)
    } else {
      alert('Wrong password')
    }
  }

  async function load(pwd = password) {
    setLoading(true)
    const [profilesRes, likesRes] = await Promise.all([
      fetch('/api/admin-profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) }),
      fetch('/api/admin-likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) }),
    ])
    const profilesJson = await profilesRes.json()
    const likesJson = await likesRes.json()
    setApplicants(profilesJson.data ?? [])
    setLikes(likesJson.data ?? [])
    setLoading(false)
  }

  async function approve(applicant: Applicant) {
    await fetch('/api/admin-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: applicant.id, email: applicant.email, name: applicant.name }),
    })
    load()
  }

  async function reject(id: string) {
    await fetch('/api/admin-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'reject', id }),
    })
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
  }

  async function deleteProfile(id: string) {
    if (!confirm('Delete this profile permanently? This removes them from the dashboard too.')) return
    await fetch('/api/admin-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'delete', id }),
    })
    setApplicants(prev => prev.filter(a => a.id !== id))
  }

  const filtered = applicants.filter((a) => a.status === tab)

  if (!authed) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm">
          <p className="font-serif font-light text-cream text-3xl mb-8 text-center">Admin</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border border-espresso-border text-cream px-4 py-3 mb-4 font-sans text-sm focus:outline-none focus:border-cognac/50"
          />
          <button type="submit" className="w-full bg-cognac text-espresso py-3 text-xs tracking-[0.15em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors">
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-espresso">
      <header className="sticky top-0 z-40 bg-espresso/95 backdrop-blur-sm border-b border-espresso-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <p className="font-serif font-light text-cream tracking-[0.2em] uppercase">Curated Admin</p>
          <div className="flex items-center gap-1 border border-espresso-border p-1 flex-wrap">
            {(['waitlist', 'approved', 'rejected'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs tracking-[0.1em] uppercase font-sans capitalize transition-colors ${
                  tab === t ? 'bg-cognac text-espresso' : 'text-cream/40 hover:text-cream'
                }`}
              >
                {t} ({applicants.filter((a) => a.status === t).length})
              </button>
            ))}
            <button
              onClick={() => setTab('events')}
              className={`px-3 py-1 text-xs tracking-[0.1em] uppercase font-sans capitalize transition-colors ${
                tab === 'events' ? 'bg-cognac text-espresso' : 'text-cream/40 hover:text-cream'
              }`}
            >
              Events ({demoEvents.length})
            </button>
            <button
              onClick={() => setTab('interests')}
              className={`px-3 py-1 text-xs tracking-[0.1em] uppercase font-sans capitalize transition-colors ${
                tab === 'interests' ? 'bg-cognac text-espresso' : 'text-cream/40 hover:text-cream'
              }`}
            >
              Interests ({likes.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {tab === 'events' ? (
          <div className="space-y-6">
            {demoEvents.map((ev) => (
              <div key={ev.id} className="border border-espresso-border p-6" style={{ background: '#1A110C' }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-cream font-serif font-light text-xl mb-1">{ev.venue}</p>
                    <p className="text-cream/40 text-xs font-sans">{ev.address}</p>
                    <p className="text-cognac/60 text-xs font-sans mt-1">{ev.date}</p>
                  </div>
                  <div className="border border-cognac/30 px-3 py-1">
                    <span className="text-cognac text-xs font-sans tracking-wide">{ev.ageGroup}</span>
                  </div>
                </div>
                <p className="text-cream/30 text-[10px] tracking-[0.2em] uppercase font-sans mb-3">
                  Peserta ({ev.attendees.length}/{ev.capacity * 2})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ev.attendees.map((a) => (
                    <div key={a.name} className="flex items-center gap-3 border border-espresso-border p-3" style={{ background: '#0E0907' }}>
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-cognac/20">
                        <img
                          src={a.photo}
                          alt={a.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const t = e.currentTarget
                            t.style.display = 'none'
                            if (t.parentElement) {
                              t.parentElement.innerHTML = `<span class="w-full h-full flex items-center justify-center font-serif text-cognac text-sm">${a.name[0]}</span>`
                            }
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-cream/80 font-sans text-sm">{a.name}</p>
                        <p className="text-cream/30 text-xs font-sans capitalize">{a.gender} · {a.age} tahun</p>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: ev.capacity * 2 - ev.attendees.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center gap-3 border border-espresso-border/40 border-dashed p-3">
                      <div className="w-10 h-10 rounded-full border border-espresso-border/50 border-dashed flex-shrink-0" />
                      <p className="text-cream/15 text-xs font-sans">Slot tersedia</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : tab === 'interests' ? (
          <div>
            {likes.length === 0 ? (
              <p className="text-center text-cream/30 py-20 font-sans text-sm">No interests yet</p>
            ) : (
              <div className="space-y-2">
                {likes.map((l, i) => (
                  <div key={i} className="border border-espresso-border p-4 flex items-center justify-between" style={{ background: '#1A110C' }}>
                    <div>
                      <p className="text-cream/80 font-sans text-sm">
                        <span className="text-cognac">{l.from_name}</span>
                        <span className="text-cream/40"> tertarik dengan </span>
                        <span className="text-cream">{l.liked_profile}</span>
                      </p>
                      <p className="text-cream/30 text-xs font-sans mt-0.5">{l.from_email}</p>
                    </div>
                    <p className="text-cream/20 text-xs font-sans">{new Date(l.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="w-4 h-4 border border-cognac/40 border-t-cognac rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-cream/30 py-20 font-sans text-sm">No {tab} applicants yet</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="border border-espresso-border p-5 flex flex-col md:flex-row md:items-center gap-4" style={{ background: '#1A110C' }}>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-cream/80 font-sans text-sm font-medium">{a.name}</p>
                    <p className="text-cream/40 text-xs font-sans">{a.email}</p>
                  </div>
                  <div>
                    <p className="text-cream/60 text-xs font-sans capitalize">{a.gender} · {a.age}</p>
                    <p className="text-cream/40 text-xs font-sans">{a.occupation}</p>
                  </div>
                  <div>
                    <p className="text-cream/60 text-xs font-sans">{a.city}</p>
                    <p className="text-cream/40 text-xs font-sans capitalize">{a.goals}</p>
                  </div>
                  <div>
                    {a.linkedin && <a href={a.linkedin} target="_blank" className="text-cognac/60 text-xs font-sans hover:text-cognac block truncate">LinkedIn →</a>}
                    {a.instagram && <p className="text-cream/40 text-xs font-sans">{a.instagram}</p>}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0 items-center">
                  {tab === 'waitlist' && (
                    <>
                      <button
                        onClick={() => approve(a)}
                        className="bg-cognac text-espresso px-4 py-2 text-xs tracking-[0.1em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reject(a.id)}
                        className="border border-espresso-border text-cream/40 px-4 py-2 text-xs tracking-[0.1em] uppercase font-sans hover:border-cream/20 hover:text-cream/60 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {tab === 'approved' && <span className="text-cognac text-xs font-sans tracking-wide">✓ Approved</span>}
                  {tab === 'rejected' && <span className="text-cream/30 text-xs font-sans tracking-wide">Rejected</span>}
                  <button
                    onClick={() => deleteProfile(a.id)}
                    className="border border-red-900/40 text-red-400/50 px-3 py-2 text-xs uppercase font-sans hover:border-red-400/50 hover:text-red-400 transition-all"
                    title="Delete permanently"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
