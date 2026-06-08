'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RegisLogo } from '@/components/ui/logo'
import { SignOutButton } from '@/components/ui/sign-out-button'

interface NavProps {
  email: string
  firmName?: string
}

export function Nav({ email, firmName }: NavProps) {
  const pathname = usePathname()

  function navLinkClass(href: string) {
    const active = pathname.startsWith(href)
    return [
      'text-sm px-2.5 py-1 rounded-md transition-all duration-200 ease-out',
      active
        ? 'bg-green-tint text-green font-medium'
        : 'text-ink-2 hover:bg-bg hover:text-ink',
    ].join(' ')
  }

  return (
    <nav className="border-b border-rule bg-bg-2 print:hidden">
      <div className="max-w-content mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
          <RegisLogo className="text-xl" />
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/documents" className={navLinkClass('/documents')}>
            Documents
          </Link>
          <Link href="/monitoring" className={navLinkClass('/monitoring')}>
            Monitoring
          </Link>
          <Link href="/settings" className={navLinkClass('/settings')}>
            Settings
          </Link>
          <Link
            href="/audit/new"
            className="text-sm px-2.5 py-1 rounded-md transition-all duration-200 ease-out text-green hover:bg-green-tint hover:text-green-2"
          >
            New Audit
          </Link>
          <span className="text-ink-3 text-sm hidden sm:block ml-4">{firmName ?? email}</span>
          <SignOutButton />
        </div>
      </div>
    </nav>
  )
}
