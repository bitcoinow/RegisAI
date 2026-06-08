import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, sendConfirmationEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const jurisdiction = request.headers.get('x-jurisdiction') ?? 'UK'

    let body: { email?: string; password?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await db.getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const confirmationToken = crypto.randomUUID()
    const passwordHash = await hashPassword(password)

    await db.createUser(email, passwordHash, confirmationToken, jurisdiction)
    await sendConfirmationEmail(email, confirmationToken, jurisdiction)

    return NextResponse.json({ success: true, message: 'Check your email to confirm your account' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Signup error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
