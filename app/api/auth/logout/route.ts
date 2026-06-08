import { NextRequest, NextResponse } from 'next/server'
import { cookieName } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const jurisdiction = request.headers.get('x-jurisdiction') ?? 'uk'
  const response = NextResponse.json({ success: true })
  response.cookies.set(cookieName(jurisdiction), '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
