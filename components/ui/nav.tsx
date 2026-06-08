'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RegisLogo } from '@/components/ui/logo'
import { SignOutButton } from '@/components/ui/sign-out-button'

interface NavProps {
  email: string
  firmName?: string
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

const bottomTabs = [
  { href: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { href: '/documents', label: 'Documents', Icon: DocIcon },
  { href: '/monitoring', label: 'Monitoring', Icon: BellIcon },
  { href: '/settings', label: 'Settings', Icon: SettingsIcon },
]

export function Nav({ email, firmName }: NavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Top bar */}
      <nav className="border-b border-rule bg-bg-2 print:hidden">
        <div className="max-w-content mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <RegisLogo className="text-xl" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/documents"
              className="text-sm text-ink-2 hover:text-ink transition-colors"
            >
              Documents
            </Link>
            <Link
              href="/monitoring"
              className="text-sm text-ink-2 hover:text-ink transition-colors"
            >
              Monitoring
            </Link>
            <Link
              href="/settings"
              className="text-sm text-ink-2 hover:text-ink transition-colors"
            >
              Settings
            </Link>
            <Link
              href="/audit/new"
              className="text-sm text-green hover:opacity-80 transition-colors"
            >
              New Audit
            </Link>
            <span className="text-ink-3 text-sm">{firmName ?? email}</span>
            <SignOutButton />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 text-ink-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="md:hidden border-t border-rule bg-bg-2 px-4 py-2 flex flex-col">
            <Link
              href="/dashboard"
              className="flex items-center min-h-[48px] text-sm text-ink-2 hover:text-ink transition-colors"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/documents"
              className="flex items-center min-h-[48px] text-sm text-ink-2 hover:text-ink transition-colors"
              onClick={() => setOpen(false)}
            >
              Documents
            </Link>
            <Link
              href="/monitoring"
              className="flex items-center min-h-[48px] text-sm text-ink-2 hover:text-ink transition-colors"
              onClick={() => setOpen(false)}
            >
              Monitoring
            </Link>
            <Link
              href="/settings"
              className="flex items-center min-h-[48px] text-sm text-ink-2 hover:text-ink transition-colors"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
            <Link
              href="/audit/new"
              className="flex items-center min-h-[48px] text-sm text-green hover:opacity-80 transition-colors"
              onClick={() => setOpen(false)}
            >
              New Audit
            </Link>
            <div className="border-t border-rule mt-1 pt-2 pb-1 flex items-center justify-between">
              <span className="text-ink-3 text-sm">{firmName ?? email}</span>
              <SignOutButton />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg border-t border-rule safe-bottom print:hidden z-50 flex">
        {bottomTabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center min-h-[56px] gap-0.5 text-xs transition-colors ${
                isActive ? 'text-green' : 'text-ink-3'
              }`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
