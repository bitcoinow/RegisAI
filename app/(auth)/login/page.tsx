'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RegisLogo } from '@/components/ui/logo'

// ── Region logos ────────────────────────────────────────────────────────────

function UKLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M28 25 L40 18 L52 25 L52 42 L40 49 L28 42Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 49 L40 58" stroke="currentColor" strokeWidth="1.5" />
      <path d="M33 58 L47 58" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="33" r="4" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

function EULogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x = 40 + 22 * Math.cos(angle)
        const y = 38 + 22 * Math.sin(angle)
        return <circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity="0.5" />
      })}
    </svg>
  )
}

function USLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="28" y="26" width="24" height="3" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="30" y="31" width="3" height="20" fill="currentColor" opacity="0.4" />
      <rect x="38.5" y="31" width="3" height="20" fill="currentColor" opacity="0.4" />
      <rect x="47" y="31" width="3" height="20" fill="currentColor" opacity="0.4" />
      <rect x="28" y="51" width="24" height="3" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

const REGIONS = [
  { code: 'UK', label: 'United Kingdom', sub: 'uk', frameworks: 'FCA · Bribery Act · UK GDPR · SMCR · Consumer Duty', color: '#b8820a', bg: 'rgba(184,130,10,0.06)', Logo: UKLogo },
  { code: 'EU', label: 'European Union', sub: 'eu', frameworks: 'MiFID II · GDPR · DORA · AMLD6 · SFDR · MAR', color: '#4a7ab5', bg: 'rgba(74,122,181,0.06)', Logo: EULogo },
  { code: 'US', label: 'United States', sub: 'us', frameworks: 'FINRA · SEC · AML/BSA · Reg BI · BCP', color: '#5a5248', bg: 'rgba(90,82,72,0.06)', Logo: USLogo },
] as const

// ── Detect context ──────────────────────────────────────────────────────────

function useHostContext() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const subMatch = hostname.match(/^(uk|eu|us)\./)
  if (subMatch) {
    const code = subMatch[1]!.toUpperCase()
    return { mode: 'customer' as const, region: REGIONS.find(r => r.code === code) ?? REGIONS[0] }
  }
  return { mode: 'admin' as const, region: null }
}

// ── Admin login (regis.today) ───────────────────────────────────────────────

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setErrorMsg(data.error ?? 'Sign in failed')
      setLoading(false)
    } else {
      router.push(data.redirect ?? '/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <RegisLogo className="text-4xl" />
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mt-1">
          Platform Administration
        </p>
      </div>

      <div className="border border-rule bg-bg-2 p-8">
        <h2 className="text-xl font-bold text-ink mb-1">Admin sign in</h2>
        <p className="text-sm text-ink-3 mb-6">Platform owner access only</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green"
              required autoComplete="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green"
              required autoComplete="current-password" />
          </div>
          {errorMsg && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{errorMsg}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-green text-white py-3 px-4 text-sm font-medium tracking-wide transition-colors disabled:opacity-40">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Customer login (uk/eu/us.regis.today) ───────────────────────────────────

function CustomerLogin({ region }: { region: typeof REGIONS[number] }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setErrorMsg(data.error ?? 'Sign in failed')
      setLoading(false)
    } else {
      router.push(data.redirect ?? '/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <RegisLogo className="text-4xl" />
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mt-1">
          Compliance Operations
        </p>
      </div>

      {/* Region badge */}
      <div className="mb-6 flex items-center justify-center gap-3 py-3 border border-rule bg-bg-2 px-5"
        style={{ borderLeftWidth: 4, borderLeftColor: region.color }}>
        <region.Logo className="w-12 h-12" style={{ color: region.color }} />
        <div>
          <span className="text-sm font-semibold" style={{ color: region.color }}>{region.label}</span>
          <span className="block text-[10px] text-ink-3 leading-relaxed">{region.frameworks}</span>
        </div>
      </div>

      <div className="border border-rule bg-bg-2 p-8">
        <h2 className="text-xl font-bold text-ink mb-1">Sign in</h2>
        <p className="text-sm text-ink-3 mb-6">Enter your credentials to continue</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green"
              required autoComplete="email" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-ink">Password</label>
              <Link href="/forgot-password" className="text-xs text-ink-3 hover:text-ink transition-colors">Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green"
              required autoComplete="current-password" />
          </div>
          {errorMsg && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{errorMsg}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 px-4 text-sm font-medium tracking-wide text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: region.color }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-ink-3">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-ink underline">Sign up</Link>
        {' · '}
        <Link href="https://regis.today" className="text-ink-3 underline">Wrong region?</Link>
      </p>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { mode, region } = useHostContext()

  if (mode === 'admin') return <AdminLogin />
  return <CustomerLogin region={region} />
}
