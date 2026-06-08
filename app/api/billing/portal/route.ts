import { NextRequest, NextResponse } from 'next/server'
import { createPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { customerId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }

  try {
    const jurisdiction = request.headers.get('x-jurisdiction') ?? 'uk'
    const appUrl = process.env['APP_URL'] ?? 'https://regis.today'
    const returnUrl = `https://${jurisdiction.toLowerCase()}.${appUrl.replace('https://', '')}/settings`

    const url = await createPortalSession(body.customerId, returnUrl)
    return NextResponse.json({ url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Portal failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
