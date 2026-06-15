import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ profile: null })

  const admin = supabaseAdmin()
  const { data } = await admin
    .from('profiles')
    .select('id, name, age, gender, occupation, city, status, phone, created_at')
    .eq('email', email)
    .single()

  if (!data) return NextResponse.json({ profile: null })

  // Waitlist position = count of people who applied before them + 1
  const { count } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .lt('created_at', data.created_at)

  return NextResponse.json({ profile: { ...data, position: (count ?? 0) + 1 } })
}
