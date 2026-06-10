'use client'

import { useState, useEffect, useRef, type ReactNode, type FormEvent, type ChangeEvent } from 'react'
import Link from 'next/link'
import { RegisLogo } from '@/components/ui/logo'

// ─── Scroll-triggered fade-in ─────────────────────────────────────────────────
// Starts visible (SSR-safe: crawlers and prerenderers see full content).
// After hydration, JS hides elements and animates them in on scroll.
// Reduced-motion users never see any animation.

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setVisible(false)
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(18px)',
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: visible ? 'auto' : 'transform, opacity',
    } as React.CSSProperties,
  }
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, style } = useFadeIn(delay)
  return <div ref={ref} style={style} className={className}>{children}</div>
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ScenarioIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  )
}

function PolicyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  )
}

function ReviewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function AuditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  )
}

function AlertIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── LandingNav ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Get Access', href: '#access' },
]

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = scrolled || menuOpen
    ? 'bg-[--bg] border-b border-[--rule] shadow-sm'
    : 'bg-[--bg] border-b border-[--rule]'

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <RegisLogo href="/" />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[--ink-2] hover:text-[--ink] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[--ink-2] hover:text-[--ink] transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-[--green] text-[--bg] px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden p-2 text-[--ink-2] hover:text-[--ink] transition-colors"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[--bg] border-t border-[--rule] px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm text-[--ink-2] hover:text-[--ink] border-b border-[--rule] last:border-0 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="py-2.5 text-sm text-center text-[--ink-2] border border-[--rule] rounded hover:border-[--ink-3] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-sm text-center font-medium bg-[--green] text-[--bg] rounded hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-[--green] pt-28 pb-20 md:pt-36 md:pb-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-widest text-[--gold] mb-5">
                UK Compliance Intelligence Platform
              </p>
              <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl text-[--bg] leading-tight mb-6">
                Assess UK compliance risks before they become problems.
              </h1>
              <p className="text-base md:text-lg text-[--bg] opacity-75 leading-relaxed mb-8 max-w-lg">
                Regis AI helps compliance, legal, risk, and governance teams analyse real-world business scenarios, review internal policies, identify potential gaps, and produce structured risk assessments with human oversight.
              </p>
              <div className="flex flex-col xs:flex-row gap-3 mb-5">
                <Link
                  href="/demo/gdpr"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[--gold] text-white font-medium text-sm rounded hover:opacity-90 transition-opacity"
                >
                  Analyse a Sample Scenario
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-[--bg] font-medium text-sm rounded hover:bg-white/10 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
              <p className="text-xs text-[--bg] opacity-45 max-w-sm leading-relaxed">
                AI-assisted guidance only. Final decisions remain with authorised compliance, legal, or risk professionals.
              </p>
            </Reveal>
          </div>

          {/* Scenario preview card */}
          <Reveal delay={150} className="w-full lg:max-w-md lg:justify-self-end">
            <div className="rounded border border-white/15 bg-white/5 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[--gold] mb-4">
                Sample scenario assessment
              </p>
              <p className="text-sm text-[--bg] opacity-85 leading-relaxed mb-5 pl-3 border-l-2 border-[--gold]">
                A team member takes a prospective client to dinner during a pitch process. The client later asks for monthly benefits before approving the company as a vendor.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[--bg] opacity-50">Risk level</span>
                  <span className="font-mono text-[10px] font-bold text-red-300 bg-red-950/40 border border-red-700/30 px-2.5 py-1 rounded uppercase tracking-wider">
                    ● Critical
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[--bg] opacity-50 mb-2">Risk areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Bribery', 'Gifts & Hospitality', 'Conflict of Interest', 'Reputational Risk'].map(tag => (
                      <span
                        key={tag}
                        className="text-xs text-[--bg] opacity-75 border border-white/20 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 flex items-start gap-2 text-[--bg] opacity-75">
                  <AlertIcon className="w-4 h-4 mt-0.5 shrink-0 text-red-300" />
                  <p className="text-xs leading-relaxed">
                    <span className="font-medium">Escalate to compliance/legal review.</span>{' '}
                    Human review required before any response to client.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    title: 'Grey-area decisions',
    text: 'Real-world scenarios often require judgement, context, and escalation — not a simple yes or no answer.',
  },
  {
    title: 'Inconsistent guidance',
    text: 'Different teams may interpret the same risk differently without a structured, repeatable process.',
  },
  {
    title: 'Weak audit trail',
    text: 'Decisions often live in email threads, spreadsheets, or verbal conversations instead of a reviewable compliance record.',
  },
]

function Problem() {
  return (
    <section className="bg-[--bg-2] py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">The problem</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[--ink] mb-6 max-w-2xl leading-tight">
            Compliance risk rarely arrives as a simple yes-or-no question.
          </h2>
          <p className="text-[--ink-2] leading-relaxed mb-12 max-w-2xl">
            Teams face practical situations where policy, law, and business pressure overlap. A client offers hospitality. A vendor has sanctions exposure. A policy is outdated. A business unit wants to know whether an activity is acceptable, risky, or requires escalation.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="border border-[--rule] bg-[--bg] rounded p-6 h-full">
                <h3 className="font-serif text-lg text-[--ink] mb-3">{p.title}</h3>
                <p className="text-sm text-[--ink-2] leading-relaxed">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── What Regis Does ──────────────────────────────────────────────────────────

const WHAT_REGIS_DOES = [
  {
    icon: <ScenarioIcon />,
    title: 'Analyse business scenarios',
    text: 'Enter a real-world scenario in plain English. Regis identifies key facts, missing information, risk categories, evidence needed, and next steps.',
  },
  {
    icon: <PolicyIcon />,
    title: 'Review internal policies',
    text: 'Upload or paste policies such as anti-bribery, gifts and hospitality, sanctions, GDPR, HR, fraud, vendor onboarding, and conflict of interest policies.',
  },
  {
    icon: <AuditIcon />,
    title: 'Create review-ready outputs',
    text: 'Generate structured assessments with risk ratings, rationale, escalation guidance, human review status, and exportable reports.',
  },
]

function WhatRegisDoes() {
  return (
    <section id="features" className="bg-[--bg] py-20 md:py-28 px-4 md:px-6 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">What Regis does</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[--ink] mb-16 max-w-xl leading-tight">
            From scenario to structured risk assessment.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHAT_REGIS_DOES.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded border border-[--rule] bg-[--bg-2] flex items-center justify-center text-[--green]">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl text-[--ink]">{item.title}</h3>
                <p className="text-sm text-[--ink-2] leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    title: 'Describe the scenario or upload a policy',
    text: 'Enter a real-world business situation in plain English, or upload your internal policy document for gap analysis.',
  },
  {
    num: '02',
    title: 'Regis analyses against UK compliance expectations',
    text: 'The AI identifies risk categories, potential gaps, missing information, relevant UK regulations, and required evidence.',
  },
  {
    num: '03',
    title: 'Review the draft risk assessment',
    text: 'A structured draft output is generated with risk ratings, rationale, escalation guidance, and recommended next steps — all marked as AI-assisted and requiring human review.',
  },
  {
    num: '04',
    title: 'Approve, escalate, or close — with full audit trail',
    text: 'Compliance reviewers edit, approve, reject, or escalate. Every action is timestamped and recorded in the audit history.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[--green] py-20 md:py-28 px-4 md:px-6 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[--gold] mb-4">How it works</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[--bg] mb-16 max-w-xl leading-tight">
            A consistent, reviewable process for every compliance question.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 70}>
              <div className="flex gap-5">
                <span className="font-mono text-2xl font-bold text-[--gold] shrink-0 leading-none mt-1">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-serif text-lg text-[--bg] mb-2">{step.title}</h3>
                  <p className="text-sm text-[--bg] opacity-70 leading-relaxed">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={320} className="mt-12">
          <Link
            href="/demo/gdpr"
            className="inline-flex items-center gap-2 text-sm font-medium text-[--bg] border border-white/30 px-5 py-2.5 rounded hover:bg-white/10 transition-colors"
          >
            See a sample review →
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Core MVP Modules ─────────────────────────────────────────────────────────

const MODULES = [
  {
    icon: <ScenarioIcon />,
    title: 'Scenario Risk Analyzer',
    text: 'Analyse grey-area scenarios involving bribery, hospitality, sanctions, data protection, HR, fraud, vendor onboarding, and reputational risk.',
    status: 'planned' as const,
  },
  {
    icon: <PolicyIcon />,
    title: 'Policy Gap Analyzer',
    text: 'Review internal policies against UK compliance expectations and identify missing clauses, weak wording, outdated language, and priority actions.',
    status: 'live' as const,
  },
  {
    icon: <ReviewIcon />,
    title: 'Human Review Workflow',
    text: 'Mark AI outputs as draft, review findings, edit recommendations, approve, reject, escalate, and close assessments.',
    status: 'live' as const,
  },
  {
    icon: <DashboardIcon />,
    title: 'Compliance Dashboard',
    text: 'Track open assessments, high-risk cases, pending reviews, policy gaps, recent activity, and risk by category.',
    status: 'live' as const,
  },
  {
    icon: <AuditIcon />,
    title: 'Audit Trail & Reporting',
    text: 'Maintain a record of user inputs, AI outputs, reviewer edits, decisions, timestamps, escalation history, and exported reports.',
    status: 'live' as const,
  },
]

function ModuleStatusBadge({ status }: { status: 'live' | 'planned' }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[--green] border border-[--green]/30 bg-[--green-tint] px-2 py-0.5 rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-[--green] inline-block" />
        Live
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[--amber] border border-[--amber]/30 bg-amber-50 px-2 py-0.5 rounded">
      Coming soon
    </span>
  )
}

function CoreModules() {
  return (
    <section className="bg-[--bg-2] py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">Core MVP modules</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[--ink] mb-4 max-w-xl leading-tight">
            Built around the work compliance teams actually do.
          </h2>
          <p className="text-sm text-[--ink-3] mb-12 max-w-lg leading-relaxed">
            Modules marked <span className="font-medium text-[--ink-2]">Live</span> are available now. Modules marked <span className="font-medium text-[--ink-2]">Coming soon</span> are planned for the MVP.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m, i) => (
            <Reveal key={m.title} delay={i * 60}>
              <div className="border border-[--rule] bg-[--bg] rounded p-6 flex flex-col gap-4 h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-9 h-9 rounded border border-[--rule] bg-[--bg-2] flex items-center justify-center text-[--green] shrink-0">
                    {m.icon}
                  </div>
                  <ModuleStatusBadge status={m.status} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[--ink] mb-2">{m.title}</h3>
                  <p className="text-sm text-[--ink-2] leading-relaxed">{m.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Example Scenarios ────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    title: 'Hospitality during a pitch process',
    text: 'A prospective client is taken to dinner and a hotel during a live pitch, then asks for recurring monthly benefits before approving the vendor relationship.',
    tags: ['Bribery risk', 'Gifts & hospitality', 'Conflict of interest', 'Escalation required'],
    risk: 'High',
  },
  {
    title: 'Monthly alcohol supply from a client',
    text: "A client offers to fill the company's office fridge with alcohol every month as part of an ongoing commercial relationship.",
    tags: ['Excessive hospitality', 'Business justification', 'Approval required', 'Human review'],
    risk: 'Medium',
  },
  {
    title: 'Vendor linked to a sanctioned person',
    text: 'A supplier is not directly sanctioned, but one of its directors is connected to a sanctioned individual or a sanctioned country.',
    tags: ['Sanctions exposure', 'Enhanced due diligence', 'Legal escalation', 'Critical review'],
    risk: 'Critical',
  },
]

const RISK_STYLE: Record<string, string> = {
  Critical: 'text-[--red] border-[--red]/30 bg-red-50',
  High: 'text-[--red] border-[--red]/30 bg-red-50',
  Medium: 'text-[--amber] border-[--amber]/30 bg-amber-50',
}

function ExampleScenarios() {
  return (
    <section id="use-cases" className="bg-[--bg] py-20 md:py-28 px-4 md:px-6 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">Example scenarios</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[--ink] mb-16 max-w-xl leading-tight">
            Designed for real-world compliance questions.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIOS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="border border-[--rule] bg-[--bg-2] rounded p-6 flex flex-col gap-4 h-full">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg text-[--ink] leading-snug">{s.title}</h3>
                  <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded ${RISK_STYLE[s.risk] ?? ''}`}>
                    {s.risk}
                  </span>
                </div>
                <p className="text-sm text-[--ink-2] leading-relaxed flex-1">{s.text}</p>
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[--rule]">
                  {s.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-wider text-[--ink-3] border border-[--rule] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Industry Focus ───────────────────────────────────────────────────────────

const MEDIA_AD_AREAS = [
  'Client pitches and entertainment',
  'Hospitality, gifts and events',
  'Agency and vendor relationships',
  'Vendor onboarding and due diligence',
  'Personal data handling (UK GDPR)',
  'Employee-related obligations',
  'Global parent-company exposure',
  'Sanctions and anti-bribery risk',
  'Contractual compliance obligations',
]

function IndustryFocus() {
  return (
    <section className="bg-[--green] py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-widest text-[--gold] mb-4">Initial focus</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[--bg] mb-6 leading-tight">
              Starting with UK media and advertising compliance. Built to expand.
            </h2>
            <p className="text-[--bg] opacity-75 leading-relaxed mb-6">
              Regis AI is initially focused on UK-based media and advertising companies because this sector regularly deals with client pitches, hospitality, gifts and entertainment, agency relationships, vendor onboarding, personal data handling, employee-related obligations, sanctions exposure, and anti-bribery risk.
            </p>
            <p className="text-sm text-[--bg] opacity-50 leading-relaxed border-t border-white/10 pt-5">
              Future sectors may include financial services, banking, investment management, technology, healthcare, education, public sector, and professional services.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-mono text-xs uppercase tracking-widest text-[--gold] mb-5">
              Common compliance areas in this sector
            </p>
            <ul className="space-y-2.5">
              {MEDIA_AD_AREAS.map(area => (
                <li key={area} className="flex items-start gap-3 text-sm text-[--bg] opacity-80">
                  <span className="mt-1 shrink-0 text-[--gold]">
                    <CheckIcon />
                  </span>
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Compliance Areas ─────────────────────────────────────────────────────────

const COMPLIANCE_AREAS = [
  'Bribery and corruption',
  'Gifts and hospitality',
  'UK sanctions exposure',
  'UK GDPR and data protection',
  'HR and employment compliance',
  'Fraud risk',
  'Financial governance',
  'Vendor / client onboarding',
  'Conflict of interest',
  'Reputational risk',
]

const POLICY_TYPES = [
  'Anti-bribery and corruption policy',
  'Gifts and hospitality policy',
  'Sanctions policy',
  'Data protection / GDPR policy',
  'HR policy',
  'Fraud policy',
  'Whistleblowing policy',
  'Vendor onboarding policy',
  'Conflict of interest policy',
]

function ComplianceAndPolicySection() {
  return (
    <section className="bg-[--bg-2] py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">Compliance coverage</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[--ink] mb-8 leading-tight">
                UK compliance areas covered in the MVP.
              </h2>
              <div className="flex flex-wrap gap-2">
                {COMPLIANCE_AREAS.map(area => (
                  <span
                    key={area}
                    className="text-sm text-[--ink-2] border border-[--rule] bg-[--bg] px-3 py-1.5 rounded"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal delay={100}>
              <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">Policy review</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[--ink] mb-8 leading-tight">
                Review the policies your teams already rely on.
              </h2>
              <div className="flex flex-wrap gap-2">
                {POLICY_TYPES.map(policy => (
                  <span
                    key={policy}
                    className="text-sm text-[--ink-2] border border-[--rule] bg-[--bg] px-3 py-1.5 rounded"
                  >
                    {policy}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Responsible AI ───────────────────────────────────────────────────────────

const RESPONSIBLE_POINTS = [
  'AI outputs are marked as draft and require human review',
  'Risk ratings include rationale and are not final determinations',
  'Missing facts and information gaps are highlighted',
  'Escalation guidance is provided, not compliance decisions',
  'Audit history records inputs, outputs, edits, and decisions',
  'No output should be acted upon without authorised review',
]

function ResponsibleAI() {
  return (
    <section className="bg-[--bg] py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">Responsible AI</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[--ink] mb-6 leading-tight">
              AI-assisted. Human-reviewed. Audit-ready.
            </h2>
            <p className="text-[--ink-2] leading-relaxed">
              Regis AI does not provide legal advice and does not replace compliance professionals. It creates structured draft assessments that must be reviewed by authorised compliance, legal, or risk professionals before decisions are made.
            </p>
            <p className="text-sm text-[--ink-3] leading-relaxed mt-4">
              All outputs use careful language: <em>potential risk</em>, <em>consider</em>, <em>requires review</em>. Regis never states that an activity is compliant, approved, safe, or legal.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ul className="space-y-4">
              {RESPONSIBLE_POINTS.map(point => (
                <li key={point} className="flex items-start gap-3 text-sm text-[--ink-2] leading-relaxed">
                  <span className="mt-0.5 shrink-0 text-[--green]">
                    <CheckIcon />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Early Access Form ────────────────────────────────────────────────────────

type FormFields = {
  name: string
  email: string
  company: string
  role: string
  industry: string
  challenge: string
  scenarioType: string
  policyType: string
  ukBased: string
  complianceTeam: string
  consent: boolean
}

const EMPTY_FORM: FormFields = {
  name: '',
  email: '',
  company: '',
  role: '',
  industry: '',
  challenge: '',
  scenarioType: '',
  policyType: '',
  ukBased: '',
  complianceTeam: '',
  consent: false,
}

const INDUSTRIES = [
  'Media and advertising',
  'Financial services',
  'Technology',
  'Healthcare',
  'Legal and professional services',
  'Education',
  'Public sector',
  'Other',
]

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs text-[--red] mt-1" role="alert">{msg}</p>
}

function EarlyAccessForm() {
  const [form, setForm] = useState<FormFields>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormFields, string>> = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!form.email.trim()) {
      next.email = 'Work email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.'
    }
    if (!form.company.trim()) next.company = 'Company name is required.'
    if (!form.role.trim()) next.role = 'Role is required.'
    if (!form.consent) next.consent = 'You must confirm this before submitting.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    setServerError('')

    try {
      const res = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setServerError(json.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setServerError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const inputClass = (field: keyof FormFields) =>
    `w-full border rounded px-3 py-2.5 text-sm bg-[--bg] text-[--ink] placeholder-[--ink-3] focus:outline-none focus:ring-2 focus:ring-[--green] transition-shadow ${
      errors[field] ? 'border-[--red]' : 'border-[--rule]'
    }`

  if (status === 'success') {
    return (
      <section id="access" className="bg-[--bg-2] py-20 md:py-28 px-4 md:px-6 scroll-mt-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[--green-tint] border border-[--green]/20 flex items-center justify-center mx-auto mb-6 text-[--green]">
            <CheckIcon />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-[--ink] mb-4">Request received.</h2>
          <p className="text-[--ink-2] leading-relaxed">
            Thank you. Your request has been received. We'll contact you about early access to Regis AI.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="access" className="bg-[--bg-2] py-20 md:py-28 px-4 md:px-6 scroll-mt-16">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[--ink-3] mb-4">Early access</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[--ink] mb-4 leading-tight">
            Get early access to Regis AI.
          </h2>
          <p className="text-[--ink-2] leading-relaxed mb-10">
            Tell us about your team and what you're looking to solve. We'll get you set up with access to the platform.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                  Full name <span aria-hidden="true" className="text-[--red]">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={inputClass('name')}
                  placeholder="Jane Smith"
                />
                <FieldError msg={errors.name} />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                  Work email <span aria-hidden="true" className="text-[--red]">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={inputClass('email')}
                  placeholder="jane@company.com"
                />
                <FieldError msg={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                  Company name <span aria-hidden="true" className="text-[--red]">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={handleChange}
                  aria-required="true"
                  className={inputClass('company')}
                  placeholder="Acme Media Ltd"
                />
                <FieldError msg={errors.company} />
              </div>
              <div>
                <label htmlFor="role" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                  Role <span aria-hidden="true" className="text-[--red]">*</span>
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  autoComplete="organization-title"
                  value={form.role}
                  onChange={handleChange}
                  aria-required="true"
                  className={inputClass('role')}
                  placeholder="Head of Compliance"
                />
                <FieldError msg={errors.role} />
              </div>
            </div>

            <div>
              <label htmlFor="industry" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className={inputClass('industry')}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="challenge" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                Primary compliance challenge
              </label>
              <textarea
                id="challenge"
                name="challenge"
                rows={3}
                value={form.challenge}
                onChange={handleChange}
                className={`${inputClass('challenge')} resize-none`}
                placeholder="Briefly describe the compliance challenge you're trying to solve..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="scenarioType" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                  Main scenario type you want to assess
                </label>
                <input
                  id="scenarioType"
                  name="scenarioType"
                  type="text"
                  value={form.scenarioType}
                  onChange={handleChange}
                  className={inputClass('scenarioType')}
                  placeholder="e.g. Gifts and hospitality"
                />
              </div>
              <div>
                <label htmlFor="policyType" className="block text-xs font-medium text-[--ink-2] mb-1.5 uppercase tracking-wide font-mono">
                  Main policy type you want to review
                </label>
                <input
                  id="policyType"
                  name="policyType"
                  type="text"
                  value={form.policyType}
                  onChange={handleChange}
                  className={inputClass('policyType')}
                  placeholder="e.g. Anti-bribery policy"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <fieldset>
                <legend className="block text-xs font-medium text-[--ink-2] mb-2 uppercase tracking-wide font-mono">
                  Are you UK-based?
                </legend>
                <div className="flex gap-6">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-[--ink-2] cursor-pointer">
                      <input
                        type="radio"
                        name="ukBased"
                        value={opt}
                        checked={form.ukBased === opt}
                        onChange={handleChange}
                        className="accent-[--green]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block text-xs font-medium text-[--ink-2] mb-2 uppercase tracking-wide font-mono">
                  Part of a compliance, legal, risk, or governance team?
                </legend>
                <div className="flex gap-6">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-[--ink-2] cursor-pointer">
                      <input
                        type="radio"
                        name="complianceTeam"
                        value={opt}
                        checked={form.complianceTeam === opt}
                        onChange={handleChange}
                        className="accent-[--green]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="border-t border-[--rule] pt-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  aria-required="true"
                  className="mt-0.5 accent-[--green] shrink-0"
                />
                <span className="text-sm text-[--ink-2] leading-relaxed">
                  I understand Regis AI provides AI-assisted compliance review support only and does not provide legal or regulatory advice.
                  <span aria-hidden="true" className="text-[--red] ml-1">*</span>
                </span>
              </label>
              <FieldError msg={errors.consent} />
            </div>

            {status === 'error' && serverError && (
              <p className="text-sm text-[--red] bg-red-50 border border-[--red]/20 rounded px-4 py-3" role="alert">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto px-8 py-3 bg-[--green] text-[--bg] font-medium text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending…' : 'Request Early Access'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Site Footer ──────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Security', href: '/security' },
  { label: 'Contact', href: '#access' },
]

function SiteFooter() {
  return (
    <footer className="bg-[--green] py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <RegisLogo href="/" light />
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(l => (
              l.href.startsWith('/') ? (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-xs text-[--bg] opacity-60 hover:opacity-100 transition-opacity"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-xs text-[--bg] opacity-60 hover:opacity-100 transition-opacity"
                >
                  {l.label}
                </a>
              )
            ))}
          </nav>
        </div>
        <div className="border-t border-white/10 pt-8">
          <p className="text-xs text-[--bg] opacity-45 leading-relaxed max-w-3xl mb-4">
            Regis AI provides AI-assisted compliance review support and internal risk assessment guidance only. It does not provide legal or regulatory advice. All findings and recommendations should be reviewed by authorised compliance, legal, or risk professionals before use.
          </p>
          <p className="text-xs text-[--bg] opacity-30">
            © {new Date().getFullYear()} Regis AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function LandingPage({ defaultCurrency: _ = 'USD' }: { defaultCurrency?: string }) {
  return (
    <div className="min-h-screen">
      {/* Skip to main content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-sm focus:bg-[--bg] focus:text-[--green] focus:font-medium focus:shadow-lg focus:rounded"
      >
        Skip to main content
      </a>
      <LandingNav />
      <main id="main-content">
        <Hero />
        <Problem />
        <WhatRegisDoes />
        <HowItWorks />
        <CoreModules />
        <ExampleScenarios />
        <IndustryFocus />
        <ComplianceAndPolicySection />
        <ResponsibleAI />
        <EarlyAccessForm />
      </main>
      <SiteFooter />
    </div>
  )
}
