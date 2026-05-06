// Validates required environment variables at startup.
// Import this module in server-side code before making any external calls.

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

// Server-only variables — never expose to the browser
export const env = {
  ANTHROPIC_API_KEY: requireEnv('ANTHROPIC_API_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  RESEND_API_KEY: requireEnv('RESEND_API_KEY'),
} as const

// Public variables — safe for browser bundles
export const publicEnv = {
  SUPABASE_URL: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  APP_URL: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
} as const
