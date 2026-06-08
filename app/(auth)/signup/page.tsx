'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RegisLogo } from '@/components/ui/logo'

// ── Region logos ──────────────────────────────────────────────────────────

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

// ── Region data ───────────────────────────────────────────────────────────

const REGIONS = [
  {
    code: 'UK',
    label: 'United Kingdom',
    sub: 'uk',
    frameworks: 'FCA · Bribery Act · UK GDPR · SMCR · Consumer Duty',
    color: '#b8820a',
    Logo: UKLogo,
  },
  {
    code: 'EU',
    label: 'European Union',
    sub: 'eu',
    frameworks: 'MiFID II · GDPR · DORA · AMLD6 · SFDR · MAR',
    color: '#4a7ab5',
    Logo: EULogo,
  },
  {
    code: 'US',
    label: 'United States',
    sub: 'us',
    frameworks: 'FINRA · SEC · AML/BSA · Reg BI · BCP',
    color: '#5a5248',
    Logo: USLogo,
  },
] as const

type Region = (typeof REGIONS)[number]

// ── Subdomain detection ───────────────────────────────────────────────────

function detectRegion(): Region | null {
  if (typeof window === 'undefined') return null
  const match = window.location.hostname.match(/^(uk|eu|us)\./)
  if (!match) return null
  const code = match[1]!.toUpperCase()
  return REGIONS.find((r) => r.code === code) ?? null
}

// ── Signup form ───────────────────────────────────────────────────────────

function SignupForm({ region }: { region: Region }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      setState('error')
      return
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters')
      setState('error')
      return
    }

    setState('loading')
    setErrorMsg(null)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setState('error')
      setErrorMsg(data.error ?? 'Something went wrong')
    } else {
      setState('sent')
    }
  }

  if (state === 'sent') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-10">
          <RegisLogo className="text-4xl" href="/" />
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mt-1">
            Compliance Operations
          </p>
        </div>
        <div className="border border-rule bg-bg-2 p-10">
          <p className="text-ink text-lg mb-2">Check your email</p>
          <p className="text-ink-3 text-sm">
            We sent a confirmation link to{' '}
            <span className="text-ink-2">{email}</span>. Click it to activate your account.
          </p>
        </div>
        <button
          onClick={() => setState('idle')}
          className="mt-4 text-ink-3 text-sm hover:text-ink underline-offset-2 hover:underline"
        >
          Use a different email
        </button>
      </div>
    )
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
      <div
        className="mb-6 flex items-center gap-3 py-3 border border-rule bg-bg-2 px-5"
        style={{ borderLeftWidth: 4, borderLeftColor: region.color }}
      >
        <region.Logo className="w-12 h-12 flex-shrink-0" style={{ color: region.color }} />
        <div>
          <span className="text-sm font-semibold" style={{ color: region.color }}>
            {region.label}
          </span>
          <span className="block text-[10px] text-ink-3 leading-relaxed">{region.frameworks}</span>
        </div>
      </div>

      <div className="border border-rule bg-bg-2 p-8">
        <h2 className="text-xl font-bold text-ink mb-1">Create account</h2>
        <p className="text-sm text-ink-3 mb-6">Start your compliance audit workflow</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@firm.com"
              className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
              autoComplete="new-password"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-risk-high bg-red-50 border border-red-200 px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full py-3 px-4 text-sm font-medium tracking-wide text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: region.color }}
          >
            {state === 'loading' ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-ink-3">
        Already have an account?{' '}
        <Link href="/login" className="text-ink underline underline-offset-2">
          Sign in
        </Link>
        {' · '}
        <a
          href="https://regis.today/get-started"
          className="text-ink-3 underline underline-offset-2 hover:text-ink-2 transition-colors"
        >
          Wrong region?
        </a>
      </p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter()
  const [region, setRegion] = useState<Region | null | undefined>(undefined)

  useEffect(() => {
    const detected = detectRegion()
    if (detected === null) {
      // Main domain — customers must pick a region first
      router.replace('/get-started')
    } else {
      setRegion(detected)
    }
  }, [router])

  // undefined = not yet mounted; null = redirecting; Region = ready
  if (!region) return null

  return <SignupForm region={region} />
}
