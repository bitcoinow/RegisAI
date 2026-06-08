import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { LandingPage } from '@/components/marketing/landing-page'
import { currencyForCountry } from '@/lib/currency'

export default async function RootPage() {
  const hdrs = await headers()
  const userId = hdrs.get('x-user-id')
  if (userId) redirect('/dashboard')

  // Default pricing currency from the visitor's location (Vercel geolocation).
  // Falls back to USD when the header is absent (e.g. local dev).
  const country = hdrs.get('x-vercel-ip-country')
  const currency = currencyForCountry(country)

  return <LandingPage defaultCurrency={currency} />
}
