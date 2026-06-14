import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ likes: [] })

  const admin = supabaseAdmin()

  // Get user's profile to derive their discover_profile name
  const { data: profile } = await admin
    .from('profiles')
    .select('name, status')
    .eq('email', email)
    .single()

  if (!profile || profile.status !== 'approved') {
    return NextResponse.json({ likes: [], status: profile?.status ?? null })
  }

  // Derive display name (e.g. "Jennifer Christiana" → "Jennifer C.")
  const parts = profile.name?.split(' ') ?? []
  const displayName = parts.length >= 2
    ? `${parts[0]} ${parts[1][0]}.`
    : parts[0] ?? ''

  // Find their discover_profile
  const { data: dp } = await admin
    .from('discover_profiles')
    .select('id')
    .eq('name', displayName)
    .single()

  if (!dp) return NextResponse.json({ likes: [], status: profile.status })

  // Fetch who liked them
  const { data: likeRows } = await admin
    .from('likes')
    .select('from_email, created_at')
    .eq('to_discover_id', dp.id)
    .order('created_at', { ascending: false })

  // Enrich with liker names
  const likerEmails = (likeRows ?? []).map((l: { from_email: string }) => l.from_email)
  const { data: likerProfiles } = likerEmails.length > 0
    ? await admin.from('profiles').select('email, name, occupation, age').in('email', likerEmails)
    : { data: [] }

  const emailToProfile: Record<string, { name: string; occupation: string; age: number }> = {}
  for (const p of likerProfiles ?? []) emailToProfile[p.email] = p

  const likes = (likeRows ?? []).map((l: { from_email: string; created_at: string }) => ({
    email: l.from_email,
    name: emailToProfile[l.from_email]?.name ?? l.from_email,
    occupation: emailToProfile[l.from_email]?.occupation ?? '',
    age: emailToProfile[l.from_email]?.age ?? null,
    created_at: l.created_at,
  }))

  return NextResponse.json({ likes, status: profile.status })
}
