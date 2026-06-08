import Link from 'next/link'
import { RegisLogo } from '@/components/ui/logo'

export default function MfaChallengePage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <RegisLogo />
        <h1 className="font-serif text-2xl text-ink">Multi-Factor Authentication</h1>
        <p className="text-sm text-ink-3">MFA support is coming soon.</p>
        <Link href="/dashboard" className="text-sm text-ink-2 hover:text-ink transition-colors">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
