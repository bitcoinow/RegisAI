import { createBrowserClient } from '@supabase/ssr'

// Use in React components and client-side code only.
// For API routes and Server Components, use lib/supabase/server.ts instead.
export function createClient() {
  return createBrowserClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!
  )
}
