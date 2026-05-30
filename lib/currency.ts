// Currency selection for pricing display.
// Regis serves three jurisdictions (US, EU, UK), mapped to three currencies.
// The default is derived from the visitor's country (Vercel geolocation header),
// and can be overridden manually in the pricing UI.

export type Currency = 'USD' | 'EUR' | 'GBP'

export const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP']

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}

// ISO 3166-1 alpha-2 codes routed to EUR: Eurozone members plus the wider
// EU/EEA, where the euro is the closest regional currency we list.
const EUR_COUNTRIES = new Set([
  // Eurozone
  'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES', 'HR',
  // Non-euro EU / EEA — default to EUR over USD
  'BG', 'CZ', 'DK', 'HU', 'PL', 'RO', 'SE', 'IS', 'LI', 'NO',
])

/**
 * Maps an ISO 3166-1 alpha-2 country code to a display currency.
 * GB → GBP, EU/EEA → EUR, everything else (incl. unknown) → USD.
 */
export function currencyForCountry(country: string | null | undefined): Currency {
  if (!country) return 'USD'
  const cc = country.toUpperCase()
  if (cc === 'GB' || cc === 'UK') return 'GBP'
  if (EUR_COUNTRIES.has(cc)) return 'EUR'
  return 'USD'
}
