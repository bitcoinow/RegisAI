import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env['STRIPE_SECRET_KEY']
  if (!key) throw new Error('STRIPE_SECRET_KEY not set')
  _stripe = new Stripe(key, { apiVersion: '2026-05-27.dahlia' })
  return _stripe
}

// ── Plan configuration ──────────────────────────────────────────────────────

export const PLANS = {
  starter: {
    name: 'Starter',
    priceMonthly: { GBP: 699, EUR: 749, USD: 799 },
    features: ['1 user seat', '5 document reviews/month', 'Single jurisdiction', 'Downloadable reports', 'Email support'],
  },
  professional: {
    name: 'Professional',
    priceMonthly: { GBP: 1799, EUR: 1999, USD: 2199 },
    features: ['3 user seats', 'Unlimited reviews', 'All jurisdictions', 'Priority monitoring', 'PDF + print-ready export', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: null, // Contact sales
    features: ['Unlimited seats', 'API access', 'Custom frameworks', 'SSO/SAML', 'Dedicated CSM', 'SLA guarantee'],
  },
} as const

export type PlanId = keyof typeof PLANS

// ── Checkout ────────────────────────────────────────────────────────────────

export async function createCheckoutSession(opts: {
  userId: string
  email: string
  plan: PlanId
  jurisdiction: string
  successUrl: string
  cancelUrl: string
}): Promise<string> {
  const stripe = getStripe()
  const planData = PLANS[opts.plan]
  if (!planData || !planData.priceMonthly) throw new Error('Invalid plan or enterprise (contact sales)')

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: opts.email,
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: planData.priceMonthly.GBP * 100,
          recurring: { interval: 'month' },
          product_data: {
            name: `Regis AI — ${planData.name}`,
            description: `${opts.jurisdiction} compliance platform`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: opts.userId,
      plan: opts.plan,
      jurisdiction: opts.jurisdiction,
    },
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  return session.url
}

// ── Portal ──────────────────────────────────────────────────────────────────

export async function createPortalSession(customerId: string, returnUrl: string): Promise<string> {
  const stripe = getStripe()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session.url
}

// ── Webhook helpers ─────────────────────────────────────────────────────────

export async function constructWebhookEvent(body: string, signature: string): Promise<Stripe.Event> {
  const stripe = getStripe()
  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']
  if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not set')
  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}
