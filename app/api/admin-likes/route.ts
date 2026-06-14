import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = supabaseAdmin()

  // Fetch all likes joined with discover_profiles (who was liked)
  const { data: likes, error } = await admin
    .from('likes')
    .select('from_email, created_at, discover_profiles(name, gender, age)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enrich liker names from profiles table
  const emails = [...new Set((likes ?? []).map((l: { from_email: string }) => l.from_email))]
  const { data: profileRows } = await admin
    .from('profiles')
    .select('email, name')
    .in('email', emails)

  const emailToName: Record<string, string> = {}
  for (const p of profileRows ?? []) emailToName[p.email] = p.name

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = (likes ?? []).map((l: any) => ({
    from_email: l.from_email,
    from_name: emailToName[l.from_email] ?? l.from_email,
    liked_profile: Array.isArray(l.discover_profiles) ? l.discover_profiles[0]?.name ?? '—' : l.discover_profiles?.name ?? '—',
    created_at: l.created_at,
  }))

  return NextResponse.json({ data: enriched })
}
