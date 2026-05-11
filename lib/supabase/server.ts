import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Use in API routes, Server Components, and Server Actions.
// For client components, use lib/supabase/client.ts instead.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookie mutation is a no-op here.
            // Middleware handles session refresh in that case.
          }
        },
      },
    }
  )
}

// Service role client — bypasses RLS. Uses the base supabase-js client (no cookie
// handling) so the service role JWT is sent as-is and never overridden by a session cookie.
export function createServiceClient() {
  return createSupabaseClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!
  )
}
