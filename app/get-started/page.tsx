'use client'

import { useState } from 'react'
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
    frameworks: ['FCA', 'Bribery Act', 'UK GDPR', 'SMCR', 'Consumer Duty'],
    color: '#b8820a',
    bg: 'rgba(184,130,10,0.06)',
    Logo: UKLogo,
  },
  {
    code: 'EU',
    label: 'European Union',
    sub: 'eu',
    frameworks: ['MiFID II', 'GDPR', 'DORA', 'AMLD6', 'SFDR', 'MAR'],
    color: '#4a7ab5',
    bg: 'rgba(74,122,181,0.06)',
    Logo: EULogo,
  },
  {
    code: 'US',
    label: 'United States',
    sub: 'us',
    frameworks: ['FINRA', 'SEC', 'AML/BSA', 'Reg BI', 'BCP'],
    color: '#5a5248',
    bg: 'rgba(90,82,72,0.06)',
    Logo: USLogo,
  },
] as const

// ── Page ─────────────────────────────────────────────────────────────────

export default function GetStartedPage() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="mb-12 text-center">
        <RegisLogo className="text-5xl" href="/" />
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mt-2">
          Compliance Operations
        </p>
      </div>

      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-semibold text-ink mb-3">
          Choose your compliance region
        </h1>
        <p className="text-sm text-ink-3 max-w-md leading-relaxed">
          Each region provides specialised regulatory frameworks and operates independently.
        </p>
      </div>

      {/* Region cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
        {REGIONS.map((region) => {
          const isHovered = hovered === region.code
          return (
            <a
              key={region.code}
              href={`https://${region.sub}.regis.today/signup`}
              onMouseEnter={() => setHovered(region.code)}
              onMouseLeave={() => setHovered(null)}
              className="block p-7 border border-rule bg-bg-2 transition-colors duration-150 no-underline"
              style={{
                borderColor: isHovered ? region.color : undefined,
                backgroundColor: isHovered ? region.bg : undefined,
              }}
            >
              <region.Logo
                className="w-14 h-14 mb-5"
                style={{ color: region.color }}
              />

              <h2
                className="text-lg font-semibold mb-2"
                style={{ color: region.color }}
              >
                {region.label}
              </h2>

              <ul className="mb-7 space-y-1">
                {region.frameworks.map((fw) => (
                  <li key={fw} className="flex items-center gap-2 text-xs text-ink-3">
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: region.color, opacity: 0.5 }}
                    />
                    {fw}
                  </li>
                ))}
              </ul>

              <span
                className="text-sm font-medium"
                style={{ color: region.color }}
              >
                Get Started →
              </span>
            </a>
          )
        })}
      </div>

      {/* Already have account */}
      <p className="mt-10 text-sm text-ink-3">
        Already have an account?{' '}
        Sign in at your region:{' '}
        <a
          href="https://uk.regis.today/login"
          className="text-ink-2 underline underline-offset-2 hover:text-ink transition-colors"
        >
          UK
        </a>
        {' · '}
        <a
          href="https://eu.regis.today/login"
          className="text-ink-2 underline underline-offset-2 hover:text-ink transition-colors"
        >
          EU
        </a>
        {' · '}
        <a
          href="https://us.regis.today/login"
          className="text-ink-2 underline underline-offset-2 hover:text-ink transition-colors"
        >
          US
        </a>
      </p>

      {/* Footer note */}
      <p className="mt-4 text-xs text-ink-3 text-center max-w-sm">
        Accounts are region-specific. A UK account cannot access EU or US data.
      </p>
    </div>
  )
}
