// Validates required environment variables at startup.
// Import this module in server-side code before making any external calls.

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function optionalEnv(name: string): string {
  return process.env[name] ?? ''
}

// Server-only variables — never expose to the browser
// AI key is optional here; lib/claude.ts resolves the provider chain itself.
export const env = {
  ANTHROPIC_API_KEY: optionalEnv('ANTHROPIC_API_KEY'),
  RESEND_API_KEY: optionalEnv('RESEND_API_KEY'),
} as const

// Public variables — safe for browser bundles
export const publicEnv = {
  APP_URL: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
} as const
