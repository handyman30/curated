import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { id, email, name } = await req.json()
  const admin = supabaseAdmin()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Get full profile so we can copy it to discover_profiles
  const { data: profile } = await admin.from('profiles').select('*').eq('id', id).single()

  // Update status
  await admin.from('profiles').update({ status: 'approved' }).eq('id', id)

  // Add to discover_profiles so they appear in the dashboard
  if (profile) {
    const firstName = (profile.name || '').split(' ')[0]
    const lastInitial = (profile.name || '').split(' ')[1]?.[0] ?? ''
    const displayName = lastInitial ? `${firstName} ${lastInitial}.` : firstName

    await admin.from('discover_profiles').insert({
      name: displayName,
      age: profile.age,
      gender: profile.gender,
      occupation: profile.occupation,
      city: profile.city,
      bio: profile.goals ?? '',
      instagram: profile.instagram ?? '',
      linkedin: profile.linkedin ?? '',
      avatar_initial: firstName[0]?.toUpperCase() ?? '?',
      is_bot: false,
      is_active: true,
    })
  }

  // Send approval email with dashboard link
  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://join-curated.netlify.app'}/dashboard`

  await resend.emails.send({
    from: 'Curated <onboarding@resend.dev>',
    to: email,
    subject: 'You\'ve been approved — your matches are waiting',
    html: approvalHtml({ name, dashboardUrl }),
  })

  return NextResponse.json({ ok: true })
}

function approvalHtml({ name, dashboardUrl }: { name: string; dashboardUrl: string }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:560px;margin:0 auto;">
  <div style="border-bottom:1px solid #2E1E14;padding-bottom:16px;margin-bottom:36px;">
    <p style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#C49A6E;margin:0;">Curated</p>
  </div>
  <h1 style="font-size:28px;font-weight:300;margin:0 0 20px;">Hi ${name},</h1>
  <p style="font-size:16px;color:#C4AD97;line-height:1.8;margin:0 0 16px;">
    You've been approved. Your matches are waiting.
  </p>
  <p style="font-size:15px;color:#C4AD97;line-height:1.8;margin:0 0 32px;">
    Browse verified profiles, like the ones you're interested in, and our team will personally handle your introduction.
  </p>
  <a href="${dashboardUrl}" style="display:inline-block;background:#C49A6E;color:#0E0907;padding:14px 32px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-family:system-ui,sans-serif;font-weight:600;text-decoration:none;">
    View Your Matches →
  </a>
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #2E1E14;">
    <p style="font-size:12px;color:#7A6558;margin:0;">The Curated Team · Jakarta</p>
  </div>
</body></html>`
}
