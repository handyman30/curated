import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = supabaseAdmin()

  if (body.action === 'approve' && body.id) {
    await admin.from('event_signups').update({ status: 'approved' }).eq('id', body.id)
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'reject' && body.id) {
    await admin.from('event_signups').update({ status: 'rejected' }).eq('id', body.id)
    return NextResponse.json({ ok: true })
  }

  const { data, error } = await admin
    .from('event_signups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    if (error.message.includes('event_signups')) {
      return NextResponse.json({ data: [], missing_table: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}
