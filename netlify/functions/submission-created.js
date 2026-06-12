const { Resend } = require('resend')

exports.handler = async (event) => {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const founderEmail = process.env.FOUNDER_EMAIL

  let payload
  try {
    payload = JSON.parse(event.body)
  } catch {
    return { statusCode: 400 }
  }

  const d = payload?.payload?.data ?? {}
  const { name, email, age, gender, occupation, city, goals, linkedin, instagram } = d

  const sends = []

  // Founder notification
  if (founderEmail && name) {
    sends.push(
      resend.emails.send({
        from: 'Curated <onboarding@resend.dev>',
        to: founderEmail,
        subject: `New Application — ${name}, ${age || '?'} — ${occupation || ''}`,
        html: founderHtml({ name, email, age, gender, occupation, city, goals, linkedin, instagram }),
      })
    )
  }

  // Applicant confirmation
  if (email && name) {
    sends.push(
      resend.emails.send({
        from: 'Curated <onboarding@resend.dev>',
        to: email,
        subject: 'Your Curated application was received',
        html: applicantHtml({ name }),
      })
    )
  }

  try {
    await Promise.all(sends)
  } catch (err) {
    console.error('Resend error:', err)
  }

  return { statusCode: 200 }
}

function founderHtml({ name, email, age, gender, occupation, city, goals, linkedin, instagram }) {
  const row = (label, value) =>
    value
      ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #2E1E14;color:#C49A6E;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;width:35%;vertical-align:top;">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid #2E1E14;font-size:14px;color:#F0E6D6;">${value}</td>
        </tr>`
      : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:560px;margin:0 auto;">
  <div style="border-bottom:1px solid #2E1E14;padding-bottom:16px;margin-bottom:28px;">
    <p style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#C49A6E;margin:0;">Curated — New Application</p>
  </div>

  <h1 style="font-size:32px;font-weight:300;margin:0 0 6px;color:#F0E6D6;">${name}</h1>
  <p style="font-size:13px;color:#C49A6E;margin:0 0 28px;letter-spacing:0.05em;">${occupation || ''}${city ? ' · ' + city : ''}</p>

  <table style="width:100%;border-collapse:collapse;">
    ${row('Email', email)}
    ${row('Age', age)}
    ${row('Gender', gender)}
    ${row('City', city)}
    ${row('Goals', goals)}
    ${row('LinkedIn', linkedin ? `<a href="${linkedin}" style="color:#C49A6E;">${linkedin}</a>` : '')}
    ${row('Instagram', instagram)}
  </table>

  <div style="margin-top:32px;padding-top:20px;border-top:1px solid #2E1E14;">
    <p style="font-size:12px;color:#7A6558;margin:0;">Curated · Jakarta</p>
  </div>
</body>
</html>`
}

function applicantHtml({ name }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0E0907;color:#F0E6D6;font-family:Georgia,serif;padding:40px 24px;max-width:560px;margin:0 auto;">
  <div style="border-bottom:1px solid #2E1E14;padding-bottom:16px;margin-bottom:36px;">
    <p style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#C49A6E;margin:0;">Curated</p>
  </div>

  <h1 style="font-size:28px;font-weight:300;margin:0 0 20px;color:#F0E6D6;">Hi ${name},</h1>

  <p style="font-size:16px;color:#C4AD97;line-height:1.8;margin:0 0 16px;">
    Thank you for applying to Curated.
  </p>
  <p style="font-size:15px;color:#C4AD97;line-height:1.8;margin:0 0 16px;">
    We personally review every application. If you're a strong fit, our founder will be in touch within 48 hours with next steps.
  </p>
  <p style="font-size:15px;color:#C4AD97;line-height:1.8;margin:0 0 36px;">
    In the meantime — no endless swiping, no wasted weekends. That's the whole point.
  </p>

  <div style="border-top:1px solid #2E1E14;padding-top:24px;">
    <p style="font-size:13px;color:#7A6558;margin:0 0 4px;">The Curated Team</p>
    <p style="font-size:12px;color:#4A3830;margin:0;">Jakarta · By Application Only</p>
  </div>
</body>
</html>`
}
