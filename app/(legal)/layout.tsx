import Link from 'next/link'
import { RegisLogo } from '@/components/ui/logo'

const LEGAL_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Security', href: '/security' },
]

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-rule bg-bg-2">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <RegisLogo className="text-lg sm:text-xl" href="/" />
          <nav className="flex items-center gap-6">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-xs tracking-widest uppercase text-ink-3 hover:text-ink transition-colors hidden sm:block"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">{children}</main>

      <footer className="border-t border-rule mt-16 py-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <RegisLogo className="text-sm" href="/" />
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs text-ink-3 hover:text-ink transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-ink-3">© 2026 Regis AI</p>
        </div>
      </footer>
    </div>
  )
}
