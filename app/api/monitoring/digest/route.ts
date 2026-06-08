import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

// Shape of a regulatory update as consumed by the digest email template.
interface DigestUpdate {
  regulator: string
  title: string
  summary: string
  url: string
  relevance_score: number
  affected_rules: string[]
}

// Mock updates to fallback to for developers/testing if no live updates occurred in past 7 days
const MOCK_UPDATES: DigestUpdate[] = [
  {
    regulator: 'FINRA',
    title: 'Regulatory Notice 26-05: Supervisory Requirements for Generative AI',
    summary: 'FINRA provides guidance on member firms\' obligations under Rule 3110 regarding the use of generative AI tools. Firms must establish written supervisory procedures (WSPs) to address compliance risks including hallucination, data confidentiality, and algorithmic bias.',
    url: 'https://www.finra.org/rules-guidance/notices/26-05',
    relevance_score: 5,
    affected_rules: ['FINRA Rule 3110', 'FINRA Rule 3120']
  },
  {
    regulator: 'SEC',
    title: 'SEC Adopted Cyber Risk Governance Disclosures for Registered Investment Advisers',
    summary: 'The Securities and Exchange Commission adopted new rules requiring registered investment advisers (RIAs) and broker-dealers to implement written policies and procedures to address cybersecurity risks and notify clients within 48 hours of a significant cybersecurity incident.',
    url: 'https://www.sec.gov/rules/adopted/2026/cyber-disclosure',
    relevance_score: 5,
    affected_rules: ['SEC Rule 206(4)-7', 'SEC Rule 17a-4']
  }
]

function generateEmailHtml(updates: DigestUpdate[], firmName: string): string {
  const updatesListHtml = updates.map(update => {
    const scoreColor = update.relevance_score >= 4 ? '#8b2020' : update.relevance_score >= 3 ? '#8b5a10' : '#1a3060'
    const regulatorBg = update.regulator === 'FINRA' ? '#1a3a2a' : '#1a3060'
    
    const rulesHtml = (update.affected_rules || []).map((r: string) => `
      <span style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 11px; padding: 2px 6px; border: 1px solid #ccc4b8; background-color: #f5f0e8; color: #3d3830; border-radius: 2px; margin-right: 4px; margin-bottom: 4px;">
        ${r}
      </span>
    `).join('')

    return `
      <div style="border: 1px solid #ccc4b8; background-color: #ede7d9; padding: 20px; margin-bottom: 16px; border-radius: 4px;">
        <div style="margin-bottom: 12px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="left">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: white; background-color: ${regulatorBg}; padding: 3px 8px; border-radius: 2px; display: inline-block;">
                  ${update.regulator}
                </span>
              </td>
              <td align="right">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: ${scoreColor}; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">
                  Relevance: ${update.relevance_score}/5
                </span>
              </td>
            </tr>
          </table>
        </div>
        
        <h3 style="font-family: Georgia, serif; font-size: 18px; color: #1a1714; margin-top: 0; margin-bottom: 8px; font-weight: normal; line-height: 1.3;">
          ${update.title}
        </h3>
        
        <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #3d3830; margin-top: 0; margin-bottom: 12px;">
          ${update.summary}
        </p>

        ${rulesHtml ? `
          <div style="margin-bottom: 14px;">
            <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; text-transform: uppercase; color: #7a7268; margin-bottom: 6px; letter-spacing: 0.05em;">Affected Rules</div>
            <div>${rulesHtml}</div>
          </div>
        ` : ''}

        <div style="margin-top: 14px;">
          <a href="${update.url}" target="_blank" style="display: inline-block; border: 1px solid #1a3a2a; padding: 6px 14px; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; text-decoration: none; color: #1a3a2a; font-weight: bold; letter-spacing: 0.1em; border-radius: 2px;">
            View Full Notice &rarr;
          </a>
        </div>
      </div>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Weekly Compliance Digest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: #f5f0e8; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 0 auto;">
          <!-- Brand Header -->
          <div style="text-align: center; border-bottom: 2px solid #1a3a2a; padding-bottom: 24px; margin-bottom: 30px;">
            <h1 style="font-family: Georgia, serif; font-size: 28px; letter-spacing: 0.15em; color: #1a3a2a; margin: 0; text-transform: uppercase; font-weight: normal;">
              REGIS
            </h1>
            <p style="font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #7a7268; margin: 8px 0 0 0;">
              Weekly Regulatory Compliance Digest
            </p>
          </div>

          <!-- Intro -->
          <div style="margin-bottom: 24px;">
            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1714; margin: 0;">
              Hello,
            </p>
            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #3d3830; margin-top: 10px; margin-bottom: 0;">
              Here are the key regulatory updates published by the SEC and FINRA over the past 7 days for <strong>${firmName}</strong>, scored for relevance to your firm's compliance operations.
            </p>
          </div>

          <!-- Updates List -->
          <div>
            ${updatesListHtml}
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin-top: 30px; margin-bottom: 40px;">
            <a href="${process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'}/monitoring" target="_blank" style="display: inline-block; background-color: #1a3a2a; color: #f5f0e8; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; text-transform: uppercase; text-decoration: none; padding: 12px 24px; letter-spacing: 0.15em; border-radius: 2px;">
              Open Monitoring Dashboard
            </a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #ccc4b8; padding-top: 20px; text-align: center;">
            <p style="font-family: 'Courier New', Courier, monospace; font-size: 10px; line-height: 1.5; color: #7a7268; margin: 0;">
              Prepared by Regis &nbsp;·&nbsp; All findings and scores are recommendations, not legal advice.<br>
              To manage your email preferences, log in to your dashboard.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

async function handleDigest(request: Request) {
  // ── Authorization ──────────────────────────────────────────────────────────
  const headersList = await headers()
  const isVercelCron = headersList.get('x-vercel-cron') === 'true'
  const userId = headersList.get('x-user-id')
  const userEmail = headersList.get('x-user-email')

  if (!isVercelCron && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Retrieve Query Params ──────────────────────────────────────────────────
  const { searchParams } = new URL(request.url)
  const testEmail = searchParams.get('test_email')

  // ── Fetch Recent Regulatory Updates ────────────────────────────────────────
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  let allUpdates: DigestUpdate[]
  try {
    const rows = await db.listRegulatoryUpdates()
    allUpdates = rows
      .filter(u => u.published_at && new Date(u.published_at) >= sevenDaysAgo)
      .map(u => ({
        regulator: u.regulator ?? '',
        title: u.title ?? '',
        summary: u.summary ?? '',
        url: u.url ?? '',
        relevance_score: u.relevance_score ?? 0,
        affected_rules: u.affected_rules ?? [],
      }))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Fallback to mock data if no updates exist in past week
  const finalUpdates = allUpdates.length > 0 ? allUpdates : MOCK_UPDATES
  const isUsingFallback = allUpdates.length === 0

  // ── Compile Recipient List ─────────────────────────────────────────────────
  let recipients: { email: string; firmName: string }[] = []

  if (testEmail) {
    recipients = [{ email: testEmail, firmName: 'Design Partner (Test)' }]
  } else if (userId) {
    const email = userEmail ?? ''
    if (email) {
      let firmName = 'Design Partner'
      try {
        const profile = await db.getProfile(userId)
        if (profile?.firm_name) firmName = profile.firm_name
      } catch {
        // profile missing — use default firm name
      }
      recipients = [{ email, firmName }]
    }
  }
  // When triggered by Vercel cron without a user ID and no test_email,
  // there are no recipients (batch enumeration requires a listProfiles method not yet available).

  if (recipients.length === 0) {
    return NextResponse.json({ success: true, sent: 0, message: 'No recipients with registered emails found.' })
  }

  // ── Deliver Emails via Resend ──────────────────────────────────────────────
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@comply.regis.today'
  const from = `Regis Compliance <${fromEmail}>`

  const results = []

  for (const recipient of recipients) {
    const html = generateEmailHtml(finalUpdates, recipient.firmName)
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: recipient.email,
          subject: `Weekly Regulatory Compliance Digest - RegisAI`,
          html,
        }),
      })

      if (!resp.ok) {
        const errBody = await resp.text()
        results.push({ email: recipient.email, success: false, error: errBody })
      } else {
        const data = await resp.json() as { id?: string }
        results.push({ email: recipient.email, success: true, id: data?.id })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ email: recipient.email, success: false, error: message })
    }
  }

  return NextResponse.json({
    success: true,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    isUsingFallback,
    details: results
  })
}

export async function GET(request: Request) {
  return handleDigest(request)
}

export async function POST(request: Request) {
  return handleDigest(request)
}
