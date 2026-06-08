import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createToken, cookieName } from '@/lib/auth'


export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const user = await db.getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (!user.email_confirmed_at) {
    return NextResponse.json({ error: 'Email not confirmed' }, { status: 403 })
  }

  // Check jurisdiction matches the subdomain they're logging into
  const requestedJurisdiction = request.headers.get('x-jurisdiction')
  if (requestedJurisdiction && user.jurisdiction !== requestedJurisdiction) {
    return NextResponse.json(
      { error: `This account is registered for ${user.jurisdiction} compliance. Please use ${user.jurisdiction.toLowerCase()}.regis.today` },
      { status: 403 }
    )
  }

  const jurisdiction = request.headers.get('x-jurisdiction') ?? user.jurisdiction
  const token = await createToken(user.id, user.email, jurisdiction)
  const response = NextResponse.json({ success: true, redirect: '/dashboard' })
  response.cookies.set(cookieName(jurisdiction), token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
