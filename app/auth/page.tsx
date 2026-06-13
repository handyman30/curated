'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'register') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      sessionStorage.setItem('curated_email', email)
      // If email confirmation is disabled, session exists immediately → go straight to dashboard
      if (data.session) {
        router.push('/dashboard')
      } else {
        setDone(true)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      sessionStorage.setItem('curated_email', email)
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const inputClass = 'w-full bg-transparent border border-espresso-border text-cream px-4 py-3.5 text-sm font-sans focus:outline-none focus:border-cognac/50 transition-colors placeholder-cream/15'

  if (done) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="font-serif text-4xl text-cognac mb-6">✓</div>
          <h2 className="font-serif font-light text-2xl text-cream mb-4">Check your inbox</h2>
          <p className="text-cream/40 text-sm font-sans leading-relaxed mb-6">
            We sent a confirmation link to <span className="text-cream/70">{email}</span>.
            Click it to activate your account, then come back to log in.
          </p>
          <p className="text-cream/25 text-xs font-sans">Check junk/spam if you don&apos;t see it.</p>
          <button
            onClick={() => setMode('login')}
            className="mt-8 text-cognac text-xs tracking-[0.15em] uppercase font-sans underline-offset-4 hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <a href="/" className="block text-center font-serif font-light text-cream text-xl tracking-[0.25em] uppercase mb-12">
          Curated
        </a>

        {/* Toggle */}
        <div className="flex border border-espresso-border mb-8">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-sans transition-colors ${
                mode === m ? 'bg-cognac text-espresso font-semibold' : 'text-cream/40 hover:text-cream'
              }`}
            >
              {m === 'login' ? 'Log in' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cream/35 text-[10px] tracking-[0.25em] uppercase mb-2 font-sans">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-cream/35 text-[10px] tracking-[0.25em] uppercase mb-2 font-sans">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Min. 6 characters"
            />
          </div>

          {error && (
            <p className="text-red-400/80 text-xs font-sans py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cognac text-espresso py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-semibold hover:bg-cognac-light transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? '...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-cream/25 text-xs font-sans mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-cognac hover:underline underline-offset-4"
          >
            {mode === 'login' ? 'Register' : 'Log in'}
          </button>
        </p>

        <p className="text-center text-cream/15 text-xs font-sans mt-8">
          By registering, you confirm you have applied via the waitlist.
        </p>
      </div>
    </div>
  )
}
