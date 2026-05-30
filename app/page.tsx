import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { LandingPage } from '@/components/marketing/landing-page'
import { currencyForCountry } from '@/lib/currency'

export default async function RootPage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) redirect('/dashboard')
  } catch {
    // Auth check failed — show landing page rather than crash
  }

  // Default pricing currency from the visitor's location (Vercel geolocation).
  // Falls back to USD when the header is absent (e.g. local dev).
  const country = (await headers()).get('x-vercel-ip-country')
  const currency = currencyForCountry(country)

  return <LandingPage defaultCurrency={currency} />
}
