import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = supabaseAdmin()

  if (body.action === 'reject' && body.id) {
    const { error } = await admin.from('profiles').update({ status: 'rejected' }).eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'delete' && body.id) {
    // Get profile first so we can remove from discover_profiles too
    const { data: profile } = await admin.from('profiles').select('name').eq('id', body.id).single()
    if (profile?.name) {
      const firstName = profile.name.split(' ')[0]
      const lastInitial = profile.name.split(' ')[1]?.[0] ?? ''
      const displayName = lastInitial ? `${firstName} ${lastInitial}.` : firstName
      await admin.from('discover_profiles').delete().eq('name', displayName).eq('is_bot', false)
    }
    const { error } = await admin.from('profiles').delete().eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
