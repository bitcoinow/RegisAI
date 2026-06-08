import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createToken, cookieName } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const userId = await db.confirmUser(token)
  if (!userId) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }

  const user = await db.getUser(userId)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 })
  }

  const jwtToken = await createToken(user.id, user.email, user.jurisdiction)

  // Set session cookie and redirect to onboarding
  const response = NextResponse.redirect(new URL('/onboarding', request.url))
  response.cookies.set(cookieName(user.jurisdiction), jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
