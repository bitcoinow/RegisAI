import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { env } from '@/lib/env'

interface RequestBody {
  name: string
  email: string
  company: string
  role: string
  industry?: string
  challenge?: string
  scenarioType?: string
  policyType?: string
  ukBased?: string
  complianceTeam?: string
  consent: boolean
}

function generateEmailHtml(data: RequestBody): string {
  const row = (label: string, value: string | undefined) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#7a7268;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;font-family:-apple-system,sans-serif;font-size:14px;color:#1a1714;line-height:1.5;">${value}</td></tr>` : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Early Access Request — Regis AI</title></head>
<body style="background:#f5f0e8;margin:0;padding:40px 20px;-webkit-font-smoothing:antialiased;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="border-bottom:2px solid #1a3a2a;padding-bottom:20px;margin-bottom:28px;">
      <h1 style="font-family:Georgia,serif;font-size:24px;letter-spacing:.15em;color:#1a3a2a;margin:0;text-transform:uppercase;font-weight:normal;">REGIS AI</h1>
      <p style="font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:#7a7268;margin:6px 0 0;">Early Access Request</p>
    </div>
    <table border="0" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #ccc4b8;background:#ede7d9;border-radius:4px;padding:20px;">
      <tbody>
        ${row('Name', data.name)}
        ${row('Email', data.email)}
        ${row('Company', data.company)}
        ${row('Role', data.role)}
        ${row('Industry', data.industry)}
        ${row('UK-based', data.ukBased)}
        ${row('Compliance team', data.complianceTeam)}
        ${row('Challenge', data.challenge)}
        ${row('Scenario type', data.scenarioType)}
        ${row('Policy type', data.policyType)}
      </tbody>
    </table>
    <p style="font-family:'Courier New',monospace;font-size:10px;color:#7a7268;margin-top:24px;text-align:center;">Regis AI · Early Access Programme</p>
  </div>
</body>
</html>`
}

export async function POST(request: Request) {
  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, company, role, consent } = body

  if (!name?.trim() || !email?.trim() || !company?.trim() || !role?.trim() || !consent) {
    return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const fromEmail = process.env['RESEND_FROM_EMAIL'] || 'onboarding@resend.dev'

    await resend.emails.send({
      from: `Regis AI <${fromEmail}>`,
      to: 'wordroom33@gmail.com',
      subject: `Early Access Request — ${company} (${role})`,
      html: generateEmailHtml(body),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send request. Please try again.' }, { status: 500 })
  }
}
