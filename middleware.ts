import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, cookieName } from '@/lib/auth'

type Jurisdiction = 'UK' | 'EU' | 'US'
type SubdomainType = { kind: 'region'; jurisdiction: Jurisdiction } | { kind: 'platform' } | null

const REGION_MAP: Record<string, Jurisdiction> = {
  'uk': 'UK',
  'eu': 'EU',
  'us': 'US',
}

function resolveSubdomain(hostname: string): SubdomainType {
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    const sub = parts[0]!.toLowerCase()
    if (sub === 'platform') return { kind: 'platform' }
    if (REGION_MAP[sub]) return { kind: 'region', jurisdiction: REGION_MAP[sub]! }
  }
  return null // main domain (regis.today / www.regis.today / localhost)
}

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl
  const subdomain = resolveSubdomain(hostname)

  // ── Main domain (regis.today) ───────────────────────────────────────────
  // Marketing only: landing, /get-started, /demo/*, /docs/*, static assets
  if (!subdomain) {
    const allowedOnMain =
      pathname === '/' ||
      pathname === '/get-started' ||
      pathname.startsWith('/demo/') ||
      pathname.startsWith('/docs/') ||
      pathname.startsWith('/api/demo/')

    // Block all auth and app routes — redirect to /get-started
    if (!allowedOnMain) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Use a region subdomain (uk/eu/us.regis.today)' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/get-started', request.url))
    }

    return NextResponse.next()
  }

  // ── Platform admin (platform.regis.today) ───────────────────────────────
  if (subdomain.kind === 'platform') {
    const isAdminPublic =
      pathname === '/login' ||
      pathname.startsWith('/api/auth/') ||
      pathname.startsWith('/auth/')

    // Verify admin session
    const sessionCookie = request.cookies.get('regis-session-platform')?.value ?? null
    let payload: { userId: string; email: string; role?: string } | null = null
    if (sessionCookie) {
      try {
        const decoded = await verifyToken(sessionCookie)
        if (decoded) payload = { userId: decoded.userId, email: decoded.email }
      } catch { /* ignore */ }
    }

    // Admin login page: let through
    if (isAdminPublic) {
      const headers = new Headers(request.headers)
      headers.set('x-platform', 'admin')
      if (payload) {
        headers.set('x-user-id', payload.userId)
        headers.set('x-user-email', payload.email)
      }
      return NextResponse.next({ request: { headers } })
    }

    // All other routes require admin session
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const headers = new Headers(request.headers)
    headers.set('x-platform', 'admin')
    headers.set('x-user-id', payload.userId)
    headers.set('x-user-email', payload.email)
    return NextResponse.next({ request: { headers } })
  }

  // ── Region subdomains (uk/eu/us.regis.today) ────────────────────────────
  const jurisdiction = subdomain.jurisdiction

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/audit') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/scenarios')

  const isApiRoute = pathname.startsWith('/api/')
  const isAuthRoute = pathname.startsWith('/api/auth/')
  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/demo/') ||
    pathname.startsWith('/docs/') ||
    pathname.startsWith('/get-started') ||
    pathname === '/'

  // Verify session
  const sessionCookie = request.cookies.get(cookieName(jurisdiction))?.value ?? null
  let payload: { userId: string; email: string; jurisdiction?: string } | null = null
  if (sessionCookie) {
    try { payload = await verifyToken(sessionCookie) } catch { /* invalid token */ }
  }

  // Protected routes: redirect to login if no session
  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logged-in user on login page: redirect to dashboard
  if (pathname === '/login' && payload) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // No cross-region enforcement needed — each subdomain reads only its own
  // region-scoped cookie (regis-session-uk, regis-session-eu, regis-session-us).
  // A UK cookie is invisible to eu.regis.today and vice versa.

  // Pass context headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-jurisdiction', jurisdiction)
  if (payload) {
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|video/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mp3)$).*)',
  ],
}
