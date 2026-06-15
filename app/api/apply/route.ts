import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, age, gender, occupation, city, goals, linkedin, instagram, auth_user_id, photo_url } = body

  if (!email || !name || !gender || !age || !occupation || !city || !goals) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const admin = supabaseAdmin()

  // Try with auth_user_id first, fall back without it if column doesn't exist yet
  let { error } = await admin.from('profiles').upsert({
    email, name, age: parseInt(age) || null, gender, occupation, city, goals,
    linkedin: linkedin || null, instagram: instagram || null,
    photo_url: photo_url || null,
    status: 'waitlist', auth_user_id: auth_user_id || null,
  }, { onConflict: 'email' })

  if (error?.message?.includes('auth_user_id')) {
    const result = await admin.from('profiles').upsert({
      email, name, age: parseInt(age) || null, gender, occupation, city, goals,
      linkedin: linkedin || null, instagram: instagram || null,
      photo_url: photo_url || null,
      status: 'waitlist',
    }, { onConflict: 'email' })
    error = result.error
  }

  if (error?.message?.includes('photo_url')) {
    const result = await admin.from('profiles').upsert({
      email, name, age: parseInt(age) || null, gender, occupation, city, goals,
      linkedin: linkedin || null, instagram: instagram || null,
      status: 'waitlist',
    }, { onConflict: 'email' })
    error = result.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send emails
  const resend = new Resend(process.env.RESEND_API_KEY)
  const founderEmail = process.env.FOUNDER_EMAIL

  const sends = []
  if (founderEmail) {
    sends.push(resend.emails.send({
      from: 'Curated <onboarding@resend.dev>',
      to: founderEmail,
      subject: `New Application — ${name}, ${age} · ${occupation}`,
      html: founderHtml({ name, email, age, gender, occupation, city, goals, linkedin, instagram }),
    }))
  }
  sends.push(resend.emails.send({
    from: 'Curated <onboarding@resend.dev>',
    to: email,
    subject: 'Your Curated application was received',
    html: applicantHtml({ name }),
  }))
  try { await Promise.all(sends) } catch { /* emails are best-effort */ }

  return NextResponse.json({ success: true })
}

function founderHtml({ name, email, age, gender, occupation, city, goals, linkedin, instagram }: Record<string, string>) {
  const row = (label: string, value: string) => value ? `<tr><td style="padding:10px 0;border-bottom:1px solid #2E1E14;color:#C49A6E;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;width:32%;vertical-align:top;">${label}</td><td style="padding:10px 0;border-bottom:1px solid #2E1E14;font-size:14px;color:#F0E6D6;">${value}</td></tr>` : ''
  return `<!DOCTYPE html><html><body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:560px;margin:0 auto;"><p style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#C49A6E;">Curated — New Application</p><h1 style="font-size:32px;font-weight:300;">${name}</h1><table style="width:100%;border-collapse:collapse;">${row('Email', email)}${row('Age', age)}${row('Gender', gender)}${row('Occupation', occupation)}${row('City', city)}${row('Goals', goals)}${row('LinkedIn', linkedin)}${row('Instagram', instagram)}</table></body></html>`
}

function applicantHtml({ name }: { name: string }) {
  return `<!DOCTYPE html><html><body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:560px;margin:0 auto;"><p style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#C49A6E;">Curated</p><h1 style="font-size:28px;font-weight:300;">Hi ${name},</h1><p style="font-size:16px;color:#C4AD97;line-height:1.8;">Kamu sudah di waitlist.</p><p style="font-size:15px;color:#C4AD97;line-height:1.8;">Kami review aplikasimu dan kabari dalam 24–48 jam. Sementara itu kamu sudah bisa browse member di dashboard.</p><a href="https://join-curated.netlify.app/dashboard" style="display:inline-block;background:#C49A6E;color:#0E0907;padding:14px 32px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;text-decoration:none;">Lihat Member →</a><p style="font-size:12px;color:#7A6558;margin-top:32px;">The Curated Team · Jakarta</p></body></html>`
}
