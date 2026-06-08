import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

export default async function SettingsPage() {
  const hdrs = await headers()
  const userId = hdrs.get('x-user-id')
  if (!userId) redirect('/login')

  await db.getProfile(userId)

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      <h1 className="font-serif text-2xl text-ink mb-1">Settings</h1>
      <p className="text-ink-3 text-sm mb-10">Manage your account and security preferences</p>

      <section className="border border-rule bg-bg-2 p-6 max-w-lg">
        <h2 className="text-ink text-base font-medium mb-1">Two-factor authentication</h2>
        <p className="text-ink-3 text-sm mb-6">
          Add an extra layer of security using an authenticator app (Google Authenticator, Authy,
          etc.)
        </p>
        <p className="text-ink-3 text-sm font-mono">Coming soon</p>
      </section>
    </div>
  )
}
