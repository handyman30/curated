import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  let admin
  try {
    admin = supabaseAdmin()
  } catch {
    return NextResponse.json({ counts: {}, attendees: {} })
  }

  const { data: signups } = await admin
    .from('event_signups')
    .select('event_id, gender, name, status, email')
    .in('status', ['approved', 'pending'])

  const approved = (signups ?? []).filter(r => r.status === 'approved')

  // Fetch profile photos for approved attendees
  const emails = approved.map(r => r.email).filter(Boolean)
  const { data: profiles } = emails.length
    ? await admin.from('profiles').select('email, photo_url').in('email', emails)
    : { data: [] }

  const photoMap: Record<string, string> = {}
  for (const p of profiles ?? []) {
    if (p.photo_url) photoMap[p.email] = p.photo_url
  }

  const counts: Record<string, { men: number; women: number }> = {}
  const attendees: Record<string, Array<{ initial: string; name: string; gender: string; photo_url?: string }>> = {}

  for (const row of approved) {
    if (!counts[row.event_id]) counts[row.event_id] = { men: 0, women: 0 }
    if (row.gender === 'male') counts[row.event_id].men++
    else counts[row.event_id].women++

    if (!attendees[row.event_id]) attendees[row.event_id] = []
    const parts = (row.name || '?').split(' ')
    const display = parts.length > 1
      ? `${parts[0]} ${parts[parts.length - 1][0]}.`
      : parts[0]
    attendees[row.event_id].push({
      initial: (row.name || '?')[0].toUpperCase(),
      name: display,
      gender: row.gender,
      photo_url: photoMap[row.email],
    })
  }

  return NextResponse.json({ counts, attendees })
}
