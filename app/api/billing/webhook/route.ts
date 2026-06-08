import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  try {
    const event = await constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.['userId']
        const plan = session.metadata?.['plan']
        if (userId && plan) {
          await db.updateProfile(userId, { plan })
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Downgrade to design_partner when subscription is cancelled
        const subscription = event.data.object
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.toString()
        // In production: look up userId by Stripe customerId
        // For now: log it
        console.log('Subscription cancelled for customer:', customerId)
        break
      }

      default:
        // Unhandled event type — ignore
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook failed'
    console.error('Stripe webhook error:', msg)
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
