'use client'

import { useState } from 'react'

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
  const [tab, setTab] = useState<'waitlist' | 'approved' | 'rejected'>('waitlist')

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
    const res = await fetch('/api/admin-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    })
    const json = await res.json()
    setApplicants(json.data ?? [])
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
    // optimistic update
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
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
          <div className="flex items-center gap-1 border border-espresso-border p-1">
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
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

                {tab === 'waitlist' && (
                  <div className="flex gap-2 flex-shrink-0">
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
                  </div>
                )}
                {tab === 'approved' && <span className="text-cognac text-xs font-sans tracking-wide flex-shrink-0">✓ Approved</span>}
                {tab === 'rejected' && <span className="text-cream/30 text-xs font-sans tracking-wide flex-shrink-0">Rejected</span>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
