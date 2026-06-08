import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, sendPasswordResetEmail } from '@/lib/auth'


export async function POST(request: NextRequest) {
  let body: { email?: string; token?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Execute reset: token + new password provided
  if (body.token && body.password) {
    if (body.password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const passwordHash = await hashPassword(body.password)
    const ok = await db.resetPassword(body.token, passwordHash)

    if (!ok) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Password updated' })
  }

  // Request reset: email provided
  if (body.email) {
    const user = await db.getUserByEmail(body.email)
    if (user) {
      const resetToken = crypto.randomUUID()
      await db.setResetToken(body.email, resetToken)
      const jurisdiction = request.headers.get('x-jurisdiction') ?? user.jurisdiction
      await sendPasswordResetEmail(body.email, resetToken, jurisdiction)
    }
    // Always respond with success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If that email exists, a reset link has been sent',
    })
  }

  return NextResponse.json(
    { error: 'Provide email to request a reset, or token + password to complete one' },
    { status: 400 },
  )
}
