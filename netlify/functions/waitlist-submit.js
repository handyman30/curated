const { Resend } = require('resend')
const { createClient } = require('@supabase/supabase-js')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  let body
  try { body = JSON.parse(event.body) } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { name, email, age, gender, occupation, city, goals, linkedin, instagram } = body

  // Save to Supabase
  if (email) {
    const { error: dbErr } = await supabase.from('profiles').upsert({
      email, name, age: parseInt(age) || null, gender, occupation, city, goals, linkedin, instagram, status: 'waitlist'
    }, { onConflict: 'email' })
    if (dbErr) console.error('Supabase insert error:', dbErr.message)
  }

  const founderEmail = process.env.FOUNDER_EMAIL
  const sends = []

  if (founderEmail && name) {
    sends.push(resend.emails.send({
      from: 'Curated <onboarding@resend.dev>',
      to: founderEmail,
      subject: `New Application — ${name}, ${age || '?'} · ${occupation || ''}`,
      html: founderHtml({ name, email, age, gender, occupation, city, goals, linkedin, instagram }),
    }))
  }

  if (email && name) {
    sends.push(resend.emails.send({
      from: 'Curated <onboarding@resend.dev>',
      to: email,
      subject: 'Your Curated application was received',
      html: applicantHtml({ name }),
    }))
  }

  try { await Promise.all(sends) } catch (err) { console.error('Resend error:', err?.message) }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
}

function founderHtml({ name, email, age, gender, occupation, city, goals, linkedin, instagram }) {
  const row = (label, value) => value ? `<tr><td style="padding:10px 0;border-bottom:1px solid #2E1E14;color:#C49A6E;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;width:32%;vertical-align:top;">${label}</td><td style="padding:10px 0;border-bottom:1px solid #2E1E14;font-size:14px;color:#F0E6D6;">${value}</td></tr>` : ''
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:560px;margin:0 auto;"><div style="border-bottom:1px solid #2E1E14;padding-bottom:16px;margin-bottom:28px;"><p style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#C49A6E;margin:0;">Curated — New Application</p></div><h1 style="font-size:32px;font-weight:300;margin:0 0 6px;">${name}</h1><p style="font-size:13px;color:#C49A6E;margin:0 0 28px;">${occupation || ''}${city ? ' · ' + city : ''}</p><table style="width:100%;border-collapse:collapse;">${row('Email', email)}${row('Age', age)}${row('Gender', gender)}${row('City', city)}${row('Goals', goals)}${row('LinkedIn', linkedin ? `<a href="${linkedin}" style="color:#C49A6E;">${linkedin}</a>` : '')}${row('Instagram', instagram)}</table><div style="margin-top:32px;padding-top:20px;border-top:1px solid #2E1E14;"><p style="font-size:12px;color:#7A6558;margin:0;">Curated · Jakarta</p></div></body></html>`
}

function applicantHtml({ name }) {
  const dashboardUrl = 'https://join-curated.netlify.app/dashboard'
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:560px;margin:0 auto;">
  <div style="border-bottom:1px solid #2E1E14;padding-bottom:16px;margin-bottom:36px;">
    <p style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#C49A6E;margin:0;">Curated</p>
  </div>
  <h1 style="font-size:28px;font-weight:300;margin:0 0 16px;">Hi ${name},</h1>
  <p style="font-size:16px;color:#C4AD97;line-height:1.8;margin:0 0 12px;">You're on the waitlist.</p>
  <p style="font-size:15px;color:#C4AD97;line-height:1.8;margin:0 0 28px;">While we review your application, you can already browse who's on Curated. If you find someone you'd like to connect with, a membership unlocks everything — $5/month.</p>
  <a href="${dashboardUrl}" style="display:inline-block;background:#C49A6E;color:#0E0907;padding:14px 32px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-family:system-ui,sans-serif;font-weight:600;text-decoration:none;margin-bottom:32px;">
    See Available Matches →
  </a>
  <p style="font-size:13px;color:#7A6558;line-height:1.7;margin:0 0 28px;">Our emails sometimes land in junk. If you're waiting on your approval, check there first.</p>
  <div style="border-top:1px solid #2E1E14;padding-top:24px;">
    <p style="font-size:13px;color:#7A6558;margin:0 0 4px;">The Curated Team</p>
    <p style="font-size:12px;color:#4A3830;margin:0;">Jakarta · By Application Only</p>
  </div>
</body></html>`
}
