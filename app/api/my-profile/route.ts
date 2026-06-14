import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ profile: null })

  const admin = supabaseAdmin()
  const { data } = await admin
    .from('profiles')
    .select('id, name, age, gender, occupation, city, status, created_at')
    .eq('email', email)
    .single()

  return NextResponse.json({ profile: data ?? null })
}
