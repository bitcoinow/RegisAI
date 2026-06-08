import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getSessionFromCookies } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const envKeys = Object.keys(process.env).filter(k => k.includes('JWT') || k.includes('SECRET'))
  const jwtSecret = process.env['JWT_SECRET']
  
  const cookieHeader = request.headers.get('cookie')
  const sessionToken = getSessionFromCookies(cookieHeader)
  
  let payload = null
  let error = null
  if (sessionToken) {
    try {
      payload = await verifyToken(sessionToken)
    } catch (e) {
      error = e instanceof Error ? e.message : String(e)
    }
  }
  
  return NextResponse.json({
    envKeysWithJWT: envKeys,
    jwtSecretAvailable: !!jwtSecret,
    jwtSecretLength: jwtSecret?.length ?? 0,
    cookiePresent: !!sessionToken,
    tokenPrefix: sessionToken?.slice(0, 20) ?? null,
    payload,
    error,
  })
}
