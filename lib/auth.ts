import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

// ── Helpers ───────────────────────────────────────────────────────────────────

// APP_URL is read at runtime from the CF Workers env (not NEXT_PUBLIC_ which is build-time inlined)
const APP_URL = process.env['APP_URL'] ?? process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://regis.today'

function getJwtSecret(): Uint8Array {
  const secret = process.env['JWT_SECRET']
  if (!secret) throw new Error('Missing required environment variable: JWT_SECRET')
  return new TextEncoder().encode(secret)
}

function getResendKey(): string {
  const key = process.env['RESEND_API_KEY']
  if (!key) throw new Error('Missing required environment variable: RESEND_API_KEY')
  return key
}

// ── Password ──────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ── JWT ───────────────────────────────────────────────────────────────────────

export async function createToken(userId: string, email: string, jurisdiction?: string): Promise<string> {
  const secret = getJwtSecret()
  return new SignJWT({ userId, email, jurisdiction: jurisdiction ?? 'UK' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(
  token: string,
): Promise<{ userId: string; email: string; jurisdiction?: string } | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)
    const userId = payload['userId']
    const email = payload['email']
    const jurisdiction = payload['jurisdiction']
    if (typeof userId !== 'string' || typeof email !== 'string') return null
    return { userId, email, jurisdiction: typeof jurisdiction === 'string' ? jurisdiction : undefined }
  } catch {
    return null
  }
}

// ── Session cookies ───────────────────────────────────────────────────────────
// Region-scoped cookie names: regis-session-uk, regis-session-eu, regis-session-us
// This allows a user to be logged into multiple regions simultaneously in the same browser.

const SEVEN_DAYS = 60 * 60 * 24 * 7

export function cookieName(jurisdiction?: string): string {
  const region = (jurisdiction ?? 'uk').toLowerCase()
  return `regis-session-${region}`
}

export function setSessionCookie(headers: Headers, token: string, jurisdiction?: string): void {
  headers.set(
    'Set-Cookie',
    `${cookieName(jurisdiction)}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SEVEN_DAYS}`,
  )
}

export function clearSessionCookie(headers: Headers, jurisdiction?: string): void {
  headers.set(
    'Set-Cookie',
    `${cookieName(jurisdiction)}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  )
}

export function getSessionFromCookies(cookieHeader: string | null, jurisdiction?: string): string | null {
  if (!cookieHeader) return null
  const name = cookieName(jurisdiction)
  for (const part of cookieHeader.split(';')) {
    const eqIdx = part.indexOf('=')
    if (eqIdx === -1) continue
    const key = part.slice(0, eqIdx).trim()
    if (key === name) {
      return part.slice(eqIdx + 1).trim()
    }
  }
  return null
}

// ── Email ─────────────────────────────────────────────────────────────────────

const FROM = 'Regis AI <notifications@comply.regis.today>'

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const key = getResendKey()
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend API error ${res.status}: ${body}`)
  }
}

function emailShell(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#1a3a2a;padding:28px 40px;">
              <span style="color:#f5f0e8;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Regis AI</span>
              <span style="color:#4caf82;font-size:13px;margin-left:8px;font-weight:500;">Compliance Platform</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #e8e3d9;">
              <p style="margin:0;color:#8a7f72;font-size:12px;line-height:1.5;">
                You received this email because an account action was initiated on Regis AI.<br />
                If you did not request this, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendConfirmationEmail(email: string, token: string, jurisdiction?: string): Promise<void> {
  // Build link dynamically — subdomain derived from jurisdiction, base domain from APP_URL
  const baseDomain = APP_URL.replace(/^https?:\/\//, '').replace(/^www\./, '')
  const sub = (jurisdiction ?? 'uk').toLowerCase()
  const confirmUrl = `https://${sub}.${baseDomain}/auth/confirm?token=${encodeURIComponent(token)}`
  const link = confirmUrl
  const body = `
    <h2 style="margin:0 0 8px;color:#1a3a2a;font-size:24px;font-weight:700;">Confirm your email</h2>
    <p style="margin:0 0 28px;color:#4a4237;font-size:15px;line-height:1.6;">
      Welcome to Regis AI. Click the button below to confirm your email address and activate your account.
    </p>
    <a href="${link}"
       style="display:inline-block;background:#1a3a2a;color:#f5f0e8;text-decoration:none;
              font-size:15px;font-weight:600;padding:13px 28px;border-radius:6px;letter-spacing:0.1px;">
      Confirm Email
    </a>
    <p style="margin:24px 0 0;color:#8a7f72;font-size:13px;line-height:1.5;">
      Or copy and paste this URL into your browser:<br />
      <a href="${link}" style="color:#1a3a2a;word-break:break-all;">${link}</a>
    </p>
    <p style="margin:16px 0 0;color:#8a7f72;font-size:12px;">This link expires in 24 hours.</p>`

  await sendEmail(email, 'Confirm your Regis AI account', emailShell('Confirm your email', body))
}

export async function sendPasswordResetEmail(email: string, token: string, jurisdiction?: string): Promise<void> {
  const baseDomain = APP_URL.replace(/^https?:\/\//, '').replace(/^www\./, '')
  const sub = (jurisdiction ?? 'uk').toLowerCase()
  const link = `https://${sub}.${baseDomain}/auth/reset-password?token=${encodeURIComponent(token)}`
  const body = `
    <h2 style="margin:0 0 8px;color:#1a3a2a;font-size:24px;font-weight:700;">Reset your password</h2>
    <p style="margin:0 0 28px;color:#4a4237;font-size:15px;line-height:1.6;">
      We received a request to reset the password for your Regis AI account. Click the button below to choose a new password.
    </p>
    <a href="${link}"
       style="display:inline-block;background:#1a3a2a;color:#f5f0e8;text-decoration:none;
              font-size:15px;font-weight:600;padding:13px 28px;border-radius:6px;letter-spacing:0.1px;">
      Reset Password
    </a>
    <p style="margin:24px 0 0;color:#8a7f72;font-size:13px;line-height:1.5;">
      Or copy and paste this URL into your browser:<br />
      <a href="${link}" style="color:#1a3a2a;word-break:break-all;">${link}</a>
    </p>
    <p style="margin:16px 0 0;color:#8a7f72;font-size:12px;">This link expires in 1 hour. If you did not request a password reset, no action is required.</p>`

  await sendEmail(
    email,
    'Reset your Regis AI password',
    emailShell('Reset your password', body),
  )
}

// ── Admin OTP (platform.regis.today) ─────────────────────────────────────────

export function generateOtp(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return String(array[0]! % 1000000).padStart(6, '0')
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const body = `
    <h2 style="margin:0 0 8px;color:#1a3a2a;font-size:24px;font-weight:700;">Admin Login Code</h2>
    <p style="margin:0 0 28px;color:#4a4237;font-size:15px;line-height:1.6;">
      Use this code to sign in to the Regis AI platform administration panel.
    </p>
    <div style="background:#1a3a2a;color:#f5f0e8;font-family:monospace;font-size:32px;
                font-weight:700;letter-spacing:8px;text-align:center;padding:20px 0;
                border-radius:6px;margin:0 0 24px;">
      ${code}
    </div>
    <p style="margin:0;color:#8a7f72;font-size:13px;line-height:1.5;">
      This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
    </p>
    <p style="margin:16px 0 0;color:#8a7f72;font-size:12px;">
      If you did not request this code, someone may be attempting to access your admin account.
      Please secure your email immediately.
    </p>`

  await sendEmail(
    email,
    `${code} — Regis AI Admin Login Code`,
    emailShell('Admin Login', body),
  )
}
