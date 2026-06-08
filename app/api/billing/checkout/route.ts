import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, type PlanId } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const email = request.headers.get('x-user-email')
  const jurisdiction = request.headers.get('x-jurisdiction') ?? 'UK'

  if (!userId || !email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { plan?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const plan = body.plan as PlanId
  if (!plan || !['starter', 'professional'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan. Choose starter or professional.' }, { status: 400 })
  }

  try {
    const appUrl = process.env['APP_URL'] ?? 'https://regis.today'
    const sub = jurisdiction.toLowerCase()
    const baseUrl = `https://${sub}.${appUrl.replace('https://', '')}`

    const url = await createCheckoutSession({
      userId,
      email,
      plan,
      jurisdiction,
      successUrl: `${baseUrl}/dashboard?billing=success`,
      cancelUrl: `${baseUrl}/dashboard?billing=cancelled`,
    })

    return NextResponse.json({ url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Checkout failed'
    console.error('Stripe checkout error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
