import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { Nav } from '@/components/ui/nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')
  const email = headersList.get('x-user-email')

  if (!userId || !email) {
    redirect('/login')
  }

  const profile = await db.getProfile(userId)

  // Redirect to onboarding if profile has no firm_name
  if (!profile?.firm_name) {
    redirect('/onboarding')
  }

  return (
    <div style={{ viewTransitionName: 'root' }}>
      <Nav email={email} firmName={profile.firm_name ?? undefined} />
      <main>{children}</main>
    </div>
  )
}
