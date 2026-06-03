import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/ui/nav'
import type { Profile } from '@/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aal?.nextLevel === 'aal2' && aal?.currentLevel !== 'aal2') {
    redirect('/auth/mfa')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('firm_name')
    .eq('id', user.id)
    .single<Pick<Profile, 'firm_name'>>()

  // Only redirect to onboarding when the query succeeded but firm_name is absent.
  // If the query errored (e.g. mobile network failure) we fall through so the
  // user reaches their dashboard rather than cascading into /onboarding → /login.
  if (!profileError && !profile?.firm_name) {
    redirect('/onboarding')
  }

  return (
    <>
      <Nav email={user.email ?? ''} firmName={profile?.firm_name ?? undefined} />
      <main>{children}</main>
    </>
  )
}
