import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, event_id, event_name, event_date, gender, age, name } = body

  if (!email || !event_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let admin
  try {
    admin = supabaseAdmin()
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  const { error } = await admin.from('event_signups').upsert({
    email, event_id, event_name, event_date, gender, age, name, status: 'pending',
  }, { onConflict: 'email,event_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ signups: [] })

  let admin
  try {
    admin = supabaseAdmin()
  } catch (e) {
    return NextResponse.json({ signups: [] })
  }

  const { data } = await admin
    .from('event_signups')
    .select('event_id')
    .eq('email', email)

  return NextResponse.json({ signups: (data ?? []).map((r: { event_id: string }) => r.event_id) })
}
