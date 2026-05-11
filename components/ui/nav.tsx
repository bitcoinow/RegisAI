import Link from 'next/link'
import Image from 'next/image'
import { SignOutButton } from '@/components/ui/sign-out-button'

interface NavProps {
  email: string
}

export function Nav({ email }: NavProps) {
  return (
    <nav className="border-b border-rule bg-bg-2">
      <div className="max-w-content mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Regis" width={68} height={40} priority />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/audit/new"
            className="text-sm text-green hover:text-green-2 transition-colors"
          >
            New Audit
          </Link>
          <span className="text-ink-3 text-sm hidden sm:block">{email}</span>
          <SignOutButton />
        </div>
      </div>
    </nav>
  )
}
