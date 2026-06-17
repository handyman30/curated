import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { email, name, phone, occupation, education, religion } = await req.json()

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  let admin
  try { admin = supabaseAdmin() } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  let { error } = await admin.from('profiles').upsert({
    email,
    name: name || null,
    phone: phone || null,
    occupation: occupation || null,
    education: education || null,
    religion: religion || null,
    status: 'waitlist',
  }, { onConflict: 'email' })

  // Fall back if education/religion columns don't exist yet
  if (error?.message?.includes('education') || error?.message?.includes('religion')) {
    const result = await admin.from('profiles').upsert({
      email,
      name: name || null,
      phone: phone || null,
      occupation: occupation || null,
      status: 'waitlist',
    }, { onConflict: 'email' })
    error = result.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const founderEmail = process.env.FOUNDER_EMAIL
    const sends = []
    if (founderEmail) {
      sends.push(resend.emails.send({
        from: 'Curated <onboarding@resend.dev>',
        to: founderEmail,
        subject: `Waitlist — ${name || email}`,
        html: `<body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;"><p style="color:#C49A6E;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">New Waitlist Signup</p><h2 style="font-weight:300;">${name || '—'}</h2><p style="color:#C4AD97;">${email}</p>${phone ? `<p style="color:#C4AD97;">📱 ${phone}</p>` : ''}${occupation ? `<p style="color:#C4AD97;">💼 ${occupation}</p>` : ''}${education ? `<p style="color:#C4AD97;">🎓 ${education}</p>` : ''}${religion ? `<p style="color:#C4AD97;">🕌 ${religion}</p>` : ''}</body>`,
      }))
    }
    sends.push(resend.emails.send({
      from: 'Curated <onboarding@resend.dev>',
      to: email,
      subject: 'Kamu masuk waitlist Curated',
      html: `<body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:520px;"><p style="color:#C49A6E;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;">Curated</p><h1 style="font-size:26px;font-weight:300;">Hi${name ? ` ${name.split(' ')[0]}` : ''},</h1><p style="font-size:15px;color:#C4AD97;line-height:1.8;">Kamu sudah masuk waitlist. Kami akan review dan kabari kamu via email dalam waktu dekat.</p><p style="font-size:12px;color:#7A6558;margin-top:32px;">The Curated Team · Jakarta</p></body>`,
    }))
    await Promise.all(sends)
  } catch { /* best-effort */ }

  return NextResponse.json({ success: true })
}
