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

  const { data: profile } = await supabase
    .from('profiles')
    .select('firm_name')
    .eq('id', user.id)
    .single<Pick<Profile, 'firm_name'>>()

  if (!profile?.firm_name) {
    redirect('/onboarding')
  }

  return (
    <>
      <Nav email={user.email ?? ''} firmName={profile.firm_name} />
      <main>{children}</main>
    </>
  )
}
