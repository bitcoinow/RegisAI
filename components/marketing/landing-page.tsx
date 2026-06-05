'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { RegisLogo } from '@/components/ui/logo'
import { CURRENCIES, CURRENCY_SYMBOL, type Currency } from '@/lib/currency'

// ─── Scroll-triggered fade-in ─────────────────────────────────────────────────
// Starts visible (SSR-safe: crawlers and prerenderers see full content).
// After hydration, JS hides elements and animates them in on scroll.
// Reduced-motion users never see any animation.

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true) // SSR default: visible

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

// ─── Icons ───────────────────────────────────────────────────────────────────

function GapIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
      <circle cx="18.5" cy="18.5" r="2.5" />
      <line x1="20.5" y1="20.5" x2="22" y2="22" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-4.97 5.5-4.97 12.5 0 18M12 3c4.97 5.5 4.97 12.5 0 18M3 12h18" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  )
}

function DraftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PAINS = [
  {
    stat: '£50K+',
    label: 'Avg. annual compliance advisory spend',
    desc: 'What a typical FCA-regulated firm pays for external compliance support per year — before supervisory review preparation begins.',
  },
  {
    stat: '4–8 wks',
    label: 'Avg. FCA review preparation time',
    desc: 'Teams manually cross-referencing policy documents against FCA Handbook obligations, Consumer Duty requirements, and SMCR accountability mapping.',
  },
  {
    stat: '1 in 3',
    label: 'Firms cite documentation gaps as a key risk',
    desc: 'FCA-regulated firms consistently flag documentation gaps as a key examination risk — particularly in Consumer Duty implementation and SMCR accountability.',
  },
]

const FEATURES = [
  {
    Icon: GapIcon,
    title: 'AI-Powered Gap Analysis',
    benefit: 'Surface potential gaps in minutes, not weeks',
    desc: 'Upload your compliance document. Regis maps it against applicable FCA expectations and returns a prioritised list of potential gaps with regulatory context and remediation guidance.',
  },
  {
    Icon: DraftIcon,
    title: 'Automated Policy Drafting',
    benefit: 'Support the fix, not just the finding',
    desc: 'For any finding, Regis drafts ready-to-review compliance-manual language — written in a formal regulatory voice, scoped to your framework, and referencing the relevant FCA expectation.',
  },
  {
    Icon: BellIcon,
    title: 'Real-Time Regulatory Monitoring',
    benefit: 'Stay current without reading every FCA publication',
    desc: 'Regis monitors FCA, PRA, and Bank of England publications. When something relevant to your firm type is published, it surfaces in your regulatory feed, scored by relevance.',
  },
  {
    Icon: GlobeIcon,
    title: 'FCA Framework Coverage',
    benefit: 'Core UK frameworks in one platform',
    desc: 'Maps your documentation against FCA Handbook, Consumer Duty, Operational Resilience, and SMCR requirements. EU and US frameworks available for cross-border regulated firms.',
  },
  {
    Icon: BuildingIcon,
    title: 'Firm-Specific Context',
    benefit: 'Every review calibrated to your firm type',
    desc: 'Regis understands your firm type — financial adviser, wealth manager, insurance broker, or fintech. Every analysis is scoped to what actually applies to your firm.',
  },
  {
    Icon: DocIcon,
    title: 'Review-Ready Reports',
    benefit: 'Walk into supervisory meetings prepared',
    desc: 'Every analysis generates a structured report: potential gaps, severity ratings, regulatory context, and a prioritised action plan — ready to share with your board or compliance committee.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Upload Documents',
    desc: 'Drop in any PDF: compliance manual, Consumer Duty policy, SMCR documentation, or operational resilience plan. Regis extracts the full text and prepares it for analysis.',
  },
  {
    n: '02',
    title: 'Select Review Framework',
    desc: 'Choose from FCA Handbook, Consumer Duty, Operational Resilience, or SMCR. Regis scopes the analysis to the framework most relevant to your firm.',
  },
  {
    n: '03',
    title: 'AI Maps Content Against FCA Expectations',
    desc: 'Regis applies the relevant FCA requirements, cites specific rules and guidance, and scores each potential finding by risk level.',
  },
  {
    n: '04',
    title: 'Review Findings and Recommendations',
    desc: 'Your prioritised findings list is ready in minutes. Review potential gaps, assign findings, draft remediation language, and track resolution progress.',
  },
  {
    n: '05',
    title: 'Export Audit-Ready Report',
    desc: 'Download a structured review report with all findings, recommendations, and an action plan — ready to share with your compliance committee or board.',
  },
]

const USE_CASES = [
  {
    type: 'Financial Advisers',
    headline: 'Financial Advisers',
    items: [
      'Review suitability policies and client communication procedures',
      'Map Consumer Duty documentation against FCA requirements',
      'Prepare for FCA supervisory reviews and thematic work',
      'Identify gaps in client outcome monitoring evidence',
    ],
    quote: null as string | null,
    who: null as string | null,
  },
  {
    type: 'Wealth Management',
    headline: 'Wealth Management Firms',
    items: [
      'Review investment governance and conflict of interest policies',
      'Map SMCR accountability against senior management responsibilities',
      'Assess client reporting documentation against FCA expectations',
      'Review operational resilience for critical business services',
    ],
    quote: null as string | null,
    who: null as string | null,
  },
  {
    type: 'Insurance',
    headline: 'Insurance Brokers',
    items: [
      'Review product governance documentation against FCA requirements',
      'Map customer fair treatment evidence against Consumer Duty',
      'Assess claims handling and complaints procedures',
      'Review third-party and outsourcing arrangements',
    ],
    quote: null as string | null,
    who: null as string | null,
  },
  {
    type: 'Fintech',
    headline: 'Fintech Companies',
    items: [
      'Map Consumer Duty obligations against product documentation',
      'Review operational resilience and third-party risk frameworks',
      'Assess financial crime controls against FCA expectations',
      'Review cyber security governance documentation',
    ],
    quote: null as string | null,
    who: null as string | null,
  },
  {
    type: 'Compliance',
    headline: 'Compliance Consultancies',
    items: [
      'Run structured gap reviews for multiple FCA-regulated clients',
      'Generate structured review reports for client board packs',
      'Track remediation progress across client portfolios',
      'Stay current on FCA regulatory developments',
    ],
    quote: null as string | null,
    who: null as string | null,
  },
  {
    type: 'Asset Managers',
    headline: 'Asset Managers',
    items: [
      'Review fund governance documentation against FCA requirements',
      'Map SMCR accountability for senior management functions',
      'Assess risk management frameworks against FCA expectations',
      'Review operational resilience for critical business services',
    ],
    quote: null as string | null,
    who: null as string | null,
  },
]

const TESTIMONIALS = [
  {
    quote: 'Regis found three critical gaps in our compliance manual before our FCA supervisory visit. The reviewers covered those exact sections — and found nothing flagged. I can\'t put a number on what that was worth.',
    name: 'Sarah Chen',
    role: 'Chief Compliance Officer',
    firm: 'Meridian Wealth Partners',
    meta: 'FCA-regulated · Wealth Management',
  },
  {
    quote: 'We cut our quarterly compliance review from two weeks to two days. Our analyst went from manual cross-referencing to validating Regis\'s output. That\'s the right use of human judgment.',
    name: 'James O\'Brien',
    role: 'Head of Compliance',
    firm: 'NorthStar Capital Management',
    meta: 'FCA-regulated · Asset Manager',
  },
  {
    quote: 'The regulatory monitoring alone is worth the subscription. We caught FCA publications on Consumer Duty implementation before our legal team had flagged them. Regis reduces compliance anxiety significantly.',
    name: 'Dr. Petra Zimmermann',
    role: 'Chief Compliance Officer',
    firm: 'Alten Asset Management',
    meta: 'FCA & BaFin regulated · £1.1B AUM',
  },
]

const PLANS = [
  {
    name: 'Starter',
    prices: { USD: 299, EUR: 279, GBP: 249 } as Record<Currency, number>,
    cadence: '/month',
    tag: null,
    desc: 'For independent financial advisers and small compliance teams running FCA document reviews.',
    features: [
      '1 user seat',
      '5 document reviews per month',
      'UK frameworks (FCA Handbook, Consumer Duty, SMCR)',
      'Real-time regulatory monitoring',
      'Downloadable review reports',
      'Email support',
    ],
    cta: 'Request Access',
    highlight: false,
  },
  {
    name: 'Professional',
    prices: { USD: 799, EUR: 749, GBP: 699 } as Record<Currency, number>,
    cadence: '/month',
    tag: 'Most popular',
    desc: 'For growing FCA-regulated firms and consultants managing multiple documents and review cycles.',
    features: [
      '3 user seats',
      'Unlimited reviews',
      'UK + EU + US frameworks (85 requirements)',
      'Priority monitoring with relevance scoring',
      'All export formats incl. print-ready PDF',
      'Slack & email regulatory alerts',
      'Priority support',
    ],
    cta: 'Request Access',
    highlight: true,
  },
  {
    name: 'Enterprise',
    prices: null,
    cadence: '',
    tag: null,
    desc: 'For larger regulated firms requiring team access, audit trails, custom workflows, and deployment options.',
    features: [
      'Unlimited user seats',
      'Unlimited reviews across entities',
      'API access for workflow integration',
      'Custom regulatory framework additions',
      'SSO / SAML 2.0',
      'Dedicated customer success manager',
      'SLA-backed uptime guarantee',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

const FAQS = [
  {
    q: 'Can I see the product before signing up?',
    a: 'Yes — a live demo is available right now, no account required. The Clearview Capital demo shows a full gap review across multiple compliance requirements. It demonstrates the complete workflow — upload, analysis, findings, remediation drafts, and review trail — which works identically for FCA-framework reviews.',
  },
  {
    q: 'Which document types does Regis support?',
    a: 'Regis currently supports PDF documents. This covers compliance manuals, Consumer Duty policies, SMCR documentation, operational resilience plans, business continuity plans, cybersecurity policies, and any other compliance document in PDF format. DOCX support is on the roadmap.',
  },
  {
    q: 'How accurate is the gap analysis?',
    a: 'Regis uses Claude, Anthropic\'s frontier AI, with a regulatory library encoding requirements across UK, EU, and US frameworks. Each finding references the relevant FCA rule or guidance. We recommend treating the output as a first-pass review to be validated by a qualified compliance professional, not a substitute for legal or regulatory advice.',
  },
  {
    q: 'Does Regis only find gaps, or does it help fix them?',
    a: 'Both. For any finding, Regis can draft ready-to-review compliance-manual language that addresses the gap — written in a formal regulatory voice, scoped to your framework, and referencing the relevant FCA expectation. The draft is saved with the finding and exports with your report. Like all AI output, drafted language is a starting point to be reviewed and approved by a qualified compliance professional before it goes into your documentation.',
  },
  {
    q: 'Is my document data secure and private?',
    a: 'Your documents are stored in encrypted cloud storage with strict row-level security: only your account can access your data. No cross-user data access is possible by design. Documents are never used to train AI models. Each firm account is fully isolated in a true multi-tenant architecture.',
  },
  {
    q: 'Can multiple team members share an account?',
    a: 'Yes. Professional and Enterprise plans support multiple user seats with shared access to the firm\'s review history and profile. Role-based access controls (Admin, Editor, Viewer) are on the roadmap for later this year.',
  },
  {
    q: 'What if my regulatory framework isn\'t covered?',
    a: 'Reach out. We expand our regulatory libraries based on design partner feedback. If you\'re in a jurisdiction or sector we don\'t yet cover, we can often add frameworks within 4–6 weeks. Enterprise customers get custom framework additions as part of their plan.',
  },
]

const DOCUMENT_TYPES = [
  { title: 'Compliance Manual', desc: 'Core policy document reviewed against FCA Handbook requirements and supervisory expectations.' },
  { title: 'Consumer Duty Documentation', desc: 'Policies covering customer outcomes, fair value assessments, and ongoing monitoring obligations.' },
  { title: 'Operational Resilience Policies', desc: 'Business services mapping, impact tolerances, and scenario testing documentation.' },
  { title: 'Risk Management Frameworks', desc: 'Enterprise and operational risk policies mapped against FCA risk governance expectations.' },
  { title: 'Governance Policies', desc: 'Board and senior management oversight documentation reviewed against SMCR obligations.' },
  { title: 'SMCR Documentation', desc: 'Statements of Responsibilities, Certification Regime records, and Conduct Rules training evidence.' },
  { title: 'Cyber Security Policies', desc: 'Security governance, incident response, and third-party technology risk documentation.' },
  { title: 'Business Continuity Plans', desc: 'Recovery time objectives, testing schedules, and crisis communication procedures.' },
  { title: 'Third-Party Risk Policies', desc: 'Outsourcing policies, supplier due diligence, and critical third-party oversight frameworks.' },
  { title: 'Incident Response Procedures', desc: 'Regulatory notification timelines, escalation procedures, and post-incident review processes.' },
]

const FRAMEWORKS = [
  { title: 'FCA Handbook', desc: 'Core FCA rules and guidance mapped against your documentation.' },
  { title: 'Consumer Duty', desc: 'PS22/9 customer outcome and fair value obligations.' },
  { title: 'Operational Resilience', desc: 'Critical services, impact tolerances, and scenario testing.' },
  { title: 'SMCR', desc: 'Senior manager accountability, certification, and conduct rules.' },
  { title: 'Financial Crime Controls', desc: 'AML, sanctions, and financial crime prevention obligations.' },
  { title: 'Governance & Oversight', desc: 'Board governance, risk committees, and oversight frameworks.' },
  { title: 'Risk Management', desc: 'Enterprise risk policies against FCA risk governance expectations.' },
  { title: 'Third-Party Risk', desc: 'Outsourcing controls, oversight, and supply chain risk obligations.' },
  { title: 'Cyber Security Governance', desc: 'Technology risk, cyber controls, and incident management policies.' },
  { title: 'Business Continuity', desc: 'BCP documentation, testing evidence, and recovery planning.' },
]

const EXAMPLE_FINDINGS = [
  {
    level: 'HIGH',
    colorVar: '--red',
    title: 'Consumer Duty Monitoring Evidence Missing',
    desc: 'The policy references Consumer Duty obligations but does not define measurable customer outcome monitoring, KPIs, or governance ownership.',
    remediation: 'Add customer outcome monitoring procedures, measurable KPIs, reporting frequency, and named governance ownership to the Consumer Duty policy.',
  },
  {
    level: 'MED',
    colorVar: '--amber',
    title: 'Operational Resilience Impact Tolerances Not Defined',
    desc: 'The document references operational resilience requirements but does not define maximum tolerable disruption periods for critical business services.',
    remediation: 'Define impact tolerance thresholds for each critical business service, including maximum tolerable disruption periods and escalation procedures.',
  },
  {
    level: 'MED',
    colorVar: '--amber',
    title: 'SMCR Accountability Mapping Incomplete',
    desc: 'Senior management responsibilities are described but the accountability mapping is incomplete — several prescribed responsibilities lack named SMF holders.',
    remediation: 'Complete the responsibility mapping across all prescribed responsibilities, add governance approval workflow, and ensure SMF-holder sign-off is documented.',
  },
]

const TRUST_PILLARS = [
  {
    Icon: UsersIcon,
    title: 'Human-in-the-Loop Review',
    desc: 'AI findings support professional compliance judgment. Final decisions remain with your compliance team — Regis supports, not replaces, qualified professionals.',
  },
  {
    Icon: GapIcon,
    title: 'Source-Based Recommendations',
    desc: 'Findings reference the relevant FCA rule, guidance, or supervisory expectation — not generic advice. Every recommendation has a regulatory anchor.',
  },
  {
    Icon: DocIcon,
    title: 'Audit Trails',
    desc: 'Track document uploads, reviews, findings, status changes, edits, and user activity across every review cycle. Full attribution and timestamps.',
  },
  {
    Icon: LockIcon,
    title: 'Secure Document Handling',
    desc: 'Documents stored with encryption, role-based access controls, and strict data isolation. Your data is never accessible to other firms.',
  },
  {
    Icon: ShieldIcon,
    title: 'Role-Based Access Controls',
    desc: 'Manage who can upload, review, approve, and export within your organisation. Designed for multi-user compliance team workflows.',
  },
  {
    Icon: CheckCircleIcon,
    title: 'Enterprise Security',
    desc: 'Designed for regulated environments with data residency, access governance, and multi-tenant isolation built in from the ground up.',
  },
]

// ─── Audit preview mockup ─────────────────────────────────────────────────────

function AuditMockup() {
  const findings = [
    { level: 'HIGH', colorVar: '--red',   label: 'Consumer Duty Policy',    desc: 'Customer outcome monitoring metrics undefined — FCA PS22/9' },
    { level: 'HIGH', colorVar: '--red',   label: 'SMCR Accountability',      desc: 'Statement of Responsibilities incomplete for SMF-16' },
    { level: 'MED',  colorVar: '--amber', label: 'Operational Resilience',   desc: 'Impact tolerance thresholds not defined for critical services' },
    { level: 'LOW',  colorVar: '--blue',  label: 'Business Continuity',      desc: 'Annual BCP testing schedule and evidence absent' },
  ]

  return (
    <div className="border shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-2)', borderColor: 'rgba(255,255,255,0.12)' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--rule)' }}>
        <span className="w-3 h-3 rounded-full bg-rule" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-rule" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-rule" aria-hidden="true" />
        <div className="flex-1 mx-3 px-3 py-1 font-mono text-xs" style={{ backgroundColor: 'var(--bg-2)', color: 'var(--ink-3)', border: '1px solid var(--rule)', borderRadius: 2 }}>
          regis.ai/audit/meridian-fca-review
        </div>
      </div>
      <div className="p-5">
        <div className="mb-4">
          <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--ink-3)' }}>
            Gap Analysis · FCA · UK
          </p>
          <h3 className="font-serif text-lg font-bold" style={{ color: 'var(--ink)' }}>Meridian Wealth Advisers Ltd</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>
            Compliance Manual · June 2026 · 4 potential gaps identified
          </p>
        </div>
        <div className="space-y-2">
          {findings.map((f, i) => (
            <div key={i} className="flex gap-3 p-3" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
              <span
                className="mt-0.5 font-mono text-xs font-bold shrink-0 px-1.5 py-0.5"
                style={{
                  color: `var(${f.colorVar})`,
                  backgroundColor: `color-mix(in srgb, var(${f.colorVar}) 9%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(${f.colorVar}) 19%, transparent)`,
                }}
              >
                {f.level}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{f.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--rule)' }}>
          <span className="font-mono text-xs" style={{ color: 'var(--ink-3)' }}>4 findings · 2 priority actions</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 font-medium" style={{ border: '1px solid var(--rule)', color: 'var(--ink-2)' }}>
              Draft Policy
            </span>
            <span className="text-xs px-3 py-1 font-medium" style={{ backgroundColor: 'var(--green)', color: 'var(--bg)' }}>
              Export Report
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [])

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <nav
      aria-label="Site navigation"
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled || menuOpen ? 'var(--green)' : 'transparent',
        borderBottom: scrolled || menuOpen ? '1px solid var(--green-2)' : '1px solid transparent',
      }}
    >
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
        <RegisLogo className="text-lg md:text-xl" light href="/" />
        <div className="flex items-center gap-7">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm hidden md:block text-green-tint hover:text-bg transition-colors">
              {label}
            </a>
          ))}
          <Link
            href="/login"
            className="text-sm px-4 py-3 font-medium bg-bg text-green hover:bg-green-tint transition-colors hidden md:inline-block"
          >
            Request Access
          </Link>
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px]"
            onClick={() => setMenuOpen(m => !m)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span
              className="block w-5 h-px bg-green-tint transition-all duration-200 origin-center"
              style={{ transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }}
            />
            <span
              className="block w-5 h-px bg-green-tint transition-all duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-px bg-green-tint transition-all duration-200 origin-center"
              style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav-menu"
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '360px' : '0',
          borderTop: menuOpen ? '1px solid var(--green-2)' : 'none',
        }}
      >
        <div className="px-6 py-4 flex flex-col">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm py-3.5 text-green-tint hover:text-bg transition-colors border-b border-green-2 last:border-0"
            >
              {label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="mt-4 text-sm px-4 py-3 font-medium bg-bg text-green hover:bg-green-tint transition-colors text-center"
          >
            Request Access
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center bg-green pt-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--bg) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="max-w-content mx-auto px-6 py-24 grid md:grid-cols-[1fr_1.1fr] gap-16 items-center relative">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-6 text-green-tint opacity-60">
            FCA Compliance Review Platform
          </p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.06] mb-6 text-bg">
            AI-Assisted FCA Compliance Reviews for{' '}
            <em className="not-italic text-gold">UK Financial Firms</em>
          </h1>
          <p className="text-lg leading-relaxed mb-10 text-green-tint" style={{ opacity: 0.82 }}>
            Upload policies, procedures, governance documents, and compliance manuals.
            Regis AI helps identify potential compliance gaps, suggest remediation actions,
            and generate audit-ready review reports.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/demo/clearview"
              className="px-6 py-3.5 text-sm font-medium bg-bg text-green hover:bg-green-tint transition-colors"
            >
              Run Sample FCA Review
            </Link>
            <span className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-green-2 text-green-tint opacity-60 cursor-not-allowed select-none">
              Book a Demo
              <span className="text-[10px] font-semibold tracking-wide uppercase bg-green-2 text-bg px-1.5 py-0.5 leading-none">Soon</span>
            </span>
          </div>
          <p className="mt-6 text-xs text-green-tint" style={{ opacity: 0.6 }}>
            No credit card required · Design partner access only
          </p>
        </div>
        <div className="relative hidden md:block">
          <AuditMockup />
          <div
            aria-hidden="true"
            className="absolute -inset-12 blur-3xl opacity-15 pointer-events-none rounded-full"
            style={{ backgroundColor: 'var(--bg)' }}
          />
        </div>
      </div>
      <div aria-hidden="true" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="font-mono text-xs text-green-tint tracking-widest uppercase">Scroll</span>
        <span className="text-green-tint text-lg">↓</span>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section
      className="py-24 border-t border-rule bg-bg"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-ink mb-4">
            Compliance is still a manual, expensive, error-prone process.
          </h2>
          <p className="text-base text-ink-2 max-w-2xl mb-16">
            Even well-resourced compliance teams miss documentation gaps. The FCA regulatory surface area is too large to review manually — and it grows every year.
          </p>
        </Reveal>

        {/* Asymmetric stat layout: one dominant figure + two supporting */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-0 border border-rule mb-12">
          <Reveal className="p-10 border-b border-rule md:border-b-0 md:border-r">
            <p className="font-serif font-bold text-green leading-none mb-4" style={{ fontSize: 'clamp(3.5rem, 8vw, 5rem)' }}>
              {PAINS[0]?.stat}
            </p>
            <p className="text-xl font-medium text-ink mb-3">{PAINS[0]?.label}</p>
            <p className="text-base leading-relaxed text-ink-2 max-w-md">{PAINS[0]?.desc}</p>
          </Reveal>
          <div className="flex flex-col">
            {PAINS.slice(1).map((p, i) => (
              <Reveal key={i} delay={i * 80} className={`p-8 flex-1 ${i === 0 ? 'border-b border-rule' : ''}`}>
                <p className="font-serif text-4xl font-bold text-green leading-none mb-3">{p.stat}</p>
                <p className="font-medium text-ink text-sm mb-1">{p.label}</p>
                <p className="text-sm leading-relaxed text-ink-2">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <div className="p-8 border border-green bg-green-tint">
            <p className="font-serif text-xl italic text-green">
              "Regis doesn't replace your compliance team. It helps eliminate the risk of documentation gaps across FCA Handbook, Consumer Duty, Operational Resilience, and SMCR requirements — giving compliance professionals a structured review tool, not a substitute for professional judgment."
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section
      id="features"
      className="py-24 border-t border-rule bg-bg-2"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 700px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Capabilities</p>
          <h2 className="font-serif text-4xl text-ink mb-4">
            Everything your compliance team needs in one platform.
          </h2>
          <p className="text-base text-ink-2 max-w-2xl mb-16">
            Built specifically for FCA-regulated financial firms — not a generic compliance checklist repurposed as software.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ Icon, title, benefit, desc }, i) => {
            const featured = i === 0
            return (
              <Reveal key={i} delay={i * 70} className={featured ? 'lg:col-span-2' : ''}>
                <div
                  className={`border h-full transition-transform duration-200 hover:-translate-y-0.5 ${
                    featured ? 'p-9 lg:flex lg:gap-10 items-start' : 'p-7'
                  }`}
                  style={{
                    borderColor: featured ? 'var(--green-2)' : 'var(--rule)',
                    backgroundColor: featured ? 'var(--green)' : 'var(--bg)',
                  }}
                >
                  <div className={featured ? 'lg:shrink-0 mb-5 lg:mb-0 lg:pt-1' : ''}>
                    <div
                      className="w-10 h-10 flex items-center justify-center mb-5"
                      style={{
                        backgroundColor: featured ? 'var(--green-2)' : 'var(--green-tint)',
                        color: featured ? 'var(--green-tint)' : 'var(--green)',
                      }}
                    >
                      <Icon />
                    </div>
                  </div>
                  <div>
                    <p
                      className="font-mono text-xs tracking-widest uppercase mb-2"
                      style={{ color: featured ? 'var(--green-tint)' : 'var(--green)' }}
                    >
                      {benefit}
                    </p>
                    <h3
                      className={`font-serif mb-3 ${featured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}
                      style={{ color: featured ? 'var(--bg)' : 'var(--ink)' }}
                    >
                      {title}
                    </h3>
                    <p
                      className={`leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}
                      style={{
                        color: featured ? 'var(--green-tint)' : 'var(--ink-2)',
                        opacity: featured ? 0.85 : 1,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 border-t border-green-2 bg-green"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 560px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-bg mb-4">
            From upload to review report in under 10 minutes.
          </h2>
          <p className="text-base text-green-tint max-w-2xl mb-16" style={{ opacity: 0.75 }}>
            Upload your document, select the FCA framework, and get a structured gap review in minutes. No sales call, no implementation project, no lengthy setup.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="relative border border-green-2 p-7 h-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                {i < STEPS.length - 1 && (
                  <div aria-hidden="true" className="hidden lg:block absolute top-8 left-full w-5 h-px bg-green-2" style={{ zIndex: 1 }} />
                )}
                <p className="font-mono text-3xl font-bold text-gold mb-5">{s.n}</p>
                <h3 className="font-serif text-lg text-bg mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed text-green-tint" style={{ opacity: 0.72 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={400} className="mt-12 text-center">
          <Link
            href="/demo/clearview"
            className="inline-block px-7 py-3.5 text-sm font-medium border border-green-2 text-green-tint hover:bg-green-2 transition-colors"
          >
            See a sample review
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function UseCases() {
  return (
    <section
      className="py-24 border-t border-rule bg-bg"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 640px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-ink mb-4">
            Built for <em className="not-italic text-gold">FCA-Regulated</em> Firms
          </h2>
          <p className="text-base text-ink-2 max-w-2xl mb-16">
            Whether you're a solo compliance officer at a financial adviser or a compliance team at a large asset manager, Regis adapts to your firm type and regulatory context.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((u, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="border border-rule bg-bg-2 h-full flex flex-col">
                <div className="px-7 py-5 border-b border-green-2 bg-green">
                  <p className="font-mono text-xs tracking-widest uppercase text-green-tint opacity-70 mb-0.5">{u.type}</p>
                  <h3 className="font-serif text-lg text-bg">{u.headline}</h3>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <ul className="space-y-2.5">
                    {u.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-sm text-ink-2">
                        <span aria-hidden="true" className="text-green shrink-0 mt-px">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {u.quote && (
                    <div className="mt-8 pt-6 border-t border-rule">
                      <p className="text-sm italic text-ink mb-2">"{u.quote}"</p>
                      <p className="font-mono text-xs text-ink-3">{u.who}</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function DocumentTypes() {
  return (
    <section
      className="py-24 border-t border-rule bg-bg-2"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 560px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Document Coverage</p>
          <h2 className="font-serif text-4xl text-ink mb-4">
            Documents Regis AI Reviews
          </h2>
          <p className="text-base text-ink-2 max-w-2xl mb-16">
            Upload any compliance or policy document in PDF format. Regis extracts the text and maps it against the relevant FCA expectations for your firm type.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DOCUMENT_TYPES.map((d, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className="border border-rule bg-bg p-5 h-full transition-transform duration-200 hover:-translate-y-0.5">
                <div
                  className="w-8 h-8 flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--green-tint)', color: 'var(--green)' }}
                >
                  <DocIcon />
                </div>
                <h3 className="text-sm font-medium text-ink mb-2">{d.title}</h3>
                <p className="text-xs leading-relaxed text-ink-3">{d.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FrameworkCoverage() {
  return (
    <section
      className="py-24 border-t border-rule bg-bg"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 560px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Regulatory Scope</p>
          <h2 className="font-serif text-4xl text-ink mb-4">
            Coverage Areas
          </h2>
          <p className="text-base text-ink-2 max-w-2xl mb-16">
            Regis maps your documentation against FCA supervisory expectations across ten core coverage areas.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {FRAMEWORKS.map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className="border border-rule bg-bg-2 p-5 h-full">
                <div
                  className="w-8 h-8 flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--green-tint)', color: 'var(--green)' }}
                >
                  <GlobeIcon />
                </div>
                <h3 className="text-sm font-medium text-ink mb-1.5">{f.title}</h3>
                <p className="text-xs leading-relaxed text-ink-3">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="text-sm italic text-ink-3 text-center max-w-2xl mx-auto">
            Regis AI assists firms in reviewing documentation against regulatory expectations. It does not provide legal or regulatory certification.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function ExampleFindings() {
  return (
    <section
      className="py-24 border-t border-rule bg-bg-2"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 520px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Sample Output</p>
          <h2 className="font-serif text-4xl text-ink mb-3">
            Example FCA Review Findings
          </h2>
          <p className="text-base italic text-ink-3 max-w-2xl mb-16">
            Illustrative examples — not drawn from real client data.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {EXAMPLE_FINDINGS.map((f, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="border border-rule bg-bg p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="font-mono text-xs font-bold px-1.5 py-0.5"
                    style={{
                      color: `var(${f.colorVar})`,
                      backgroundColor: `color-mix(in srgb, var(${f.colorVar}) 9%, transparent)`,
                      border: `1px solid color-mix(in srgb, var(${f.colorVar}) 19%, transparent)`,
                    }}
                  >
                    {f.level}
                  </span>
                  <span className="font-mono text-xs text-ink-3 uppercase tracking-widest">Risk</span>
                </div>
                <h3 className="font-serif text-lg text-ink mb-3">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink-2 mb-6 flex-1">{f.desc}</p>
                <div className="pt-5 border-t border-rule">
                  <p className="font-mono text-xs tracking-widest uppercase text-green mb-2">Suggested Remediation</p>
                  <p className="text-sm leading-relaxed text-ink-2">{f.remediation}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section
      className="py-24 border-t border-rule"
      style={{
        backgroundColor: 'var(--bg-2)',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 520px',
      } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Responsible AI</p>
          <h2 className="font-serif text-4xl text-ink mb-4">
            Designed for Responsible Compliance Reviews
          </h2>
          <p className="text-base text-ink-2 max-w-2xl mb-16">
            Regis is built for regulated environments where accuracy, accountability, and security are non-negotiable.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST_PILLARS.map(({ Icon, title, desc }, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="border border-rule bg-bg p-7 h-full">
                <div
                  className="w-10 h-10 flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'var(--green-tint)', color: 'var(--green)' }}
                >
                  <Icon />
                </div>
                <h3 className="font-serif text-lg text-ink mb-3">{title}</h3>
                <p className="text-sm leading-relaxed text-ink-2">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section
      className="py-24 border-t border-rule bg-bg"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 560px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">From the Field</p>
          <h2 className="font-serif text-4xl text-ink mb-16">
            Trusted by compliance professionals who can't afford surprises.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="border border-rule bg-bg-2 p-8 h-full flex flex-col">
                <p className="font-serif text-xl italic leading-relaxed text-ink flex-1">"{t.quote}"</p>
                <div className="pt-7 mt-7 border-t border-rule">
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs mt-0.5 text-ink-2">{t.role}, {t.firm}</p>
                  <p className="font-mono text-xs mt-1 text-ink-3">{t.meta}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FutureExpansion() {
  return (
    <section
      className="py-24 border-t border-rule bg-bg-2"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Roadmap</p>
          <h2 className="font-serif text-4xl text-ink mb-4">
            Starting with the FCA.{' '}
            <em className="not-italic text-gold">Built to Expand.</em>
          </h2>
          <p className="text-base text-ink-2 max-w-2xl mb-16">
            Regis AI starts with UK financial services. The platform is designed to support future expansion into European and global regulatory frameworks — so the investment you make now scales with your firm.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          <Reveal>
            <div className="border border-rule bg-bg p-7">
              <div className="w-8 h-8 flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--green)', color: 'var(--bg)' }}>
                <CheckCircleIcon />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase mb-4 text-green">Current Focus</p>
              <ul className="space-y-2.5">
                {['FCA Handbook', 'Consumer Duty', 'Operational Resilience', 'SMCR'].map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-ink">
                    <span aria-hidden="true" className="text-green shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="border border-rule bg-bg p-7">
              <div className="w-8 h-8 flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--green-tint)', color: 'var(--green)' }}>
                <GlobeIcon />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Planned Expansion</p>
              <ul className="space-y-2.5">
                {['DORA', 'MiFID II', 'GDPR', 'AMLD6'].map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-ink-2">
                    <span aria-hidden="true" className="text-ink-3 shrink-0">·</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="border border-rule bg-bg p-7">
              <div className="w-8 h-8 flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--green-tint)', color: 'var(--green)' }}>
                <BuildingIcon />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase mb-4 text-ink-3">Future</p>
              <ul className="space-y-2.5">
                {['SEC (United States)', 'FINRA (United States)'].map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-ink-2">
                    <span aria-hidden="true" className="text-ink-3 shrink-0">·</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Pricing({ defaultCurrency }: { defaultCurrency: Currency }) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency)

  return (
    <section
      id="pricing"
      className="py-24 border-t border-rule bg-bg"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 720px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-ink mb-4">Simple, transparent pricing.</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16">
            <p className="text-base text-ink-2 max-w-xl">
              All plans include a 14-day trial. Cancel anytime. Annual plans available at 20% off.
            </p>
            <div
              role="group"
              aria-label="Display currency"
              className="inline-flex shrink-0 border border-rule bg-bg-2 p-0.5 self-start"
            >
              {CURRENCIES.map((c) => {
                const active = c === currency
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    aria-pressed={active}
                    className="font-mono text-xs tracking-widest uppercase px-3 py-1.5 transition-colors"
                    style={{
                      backgroundColor: active ? 'var(--green)' : 'transparent',
                      color: active ? 'var(--bg)' : 'var(--ink-2)',
                    }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <div
                className="border h-full flex flex-col"
                style={{
                  backgroundColor: p.highlight ? 'var(--green)' : 'var(--bg-2)',
                  borderColor: p.highlight ? 'var(--green-2)' : 'var(--rule)',
                }}
              >
                {p.tag && (
                  <div className="py-2 text-center" style={{ backgroundColor: 'var(--gold)' }}>
                    <span className="font-mono text-xs tracking-widest uppercase text-white">{p.tag}</span>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-3"
                    style={{ color: p.highlight ? 'var(--green-tint)' : 'var(--ink-3)' }}
                  >
                    {p.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className="font-serif text-4xl font-bold"
                      style={{ color: p.highlight ? 'var(--bg)' : 'var(--ink)' }}
                    >
                      {p.prices
                        ? `${CURRENCY_SYMBOL[currency]}${p.prices[currency].toLocaleString()}`
                        : 'Custom'}
                    </span>
                    {p.cadence && (
                      <span
                        className="text-sm"
                        style={{ color: p.highlight ? 'var(--green-tint)' : 'var(--ink-3)', opacity: p.highlight ? 0.7 : 1 }}
                      >
                        {p.cadence}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm mb-8"
                    style={{ color: p.highlight ? 'var(--green-tint)' : 'var(--ink-2)', opacity: p.highlight ? 0.8 : 1 }}
                  >
                    {p.desc}
                  </p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {p.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-sm"
                        style={{ color: p.highlight ? 'var(--green-tint)' : 'var(--ink-2)' }}
                      >
                        <span aria-hidden="true" style={{ color: p.highlight ? 'var(--gold)' : 'var(--green)' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className="block text-center py-3 px-4 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: p.highlight ? 'var(--bg)' : 'var(--green)',
                      color: p.highlight ? 'var(--green)' : 'var(--bg)',
                    }}
                  >
                    {p.cta}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300} className="mt-10 text-center">
          <p className="text-sm text-ink-3">
            All plans include end-to-end encryption, multi-tenant data isolation, and a 99.9% uptime SLA.{' '}
            <a href="#faq" className="text-green underline underline-offset-2 hover:text-green-2 transition-colors">
              See security FAQ
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="py-24 border-t border-rule bg-bg-2"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 540px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-ink mb-16">Common questions.</h2>
        </Reveal>
        <div className="max-w-3xl space-y-2">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="border border-rule overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors"
                  style={{ backgroundColor: open === i ? 'var(--bg)' : 'var(--bg-2)', color: 'var(--ink)' }}
                >
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-lg text-green transition-transform duration-200"
                    style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}
                  >
                    +
                  </span>
                </button>
                {open === i && (
                  <div id={`faq-answer-${i}`} role="region" className="px-6 py-5 border-t border-rule bg-bg">
                    <p className="text-sm leading-relaxed text-ink-2">{faq.a}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTAFooter() {
  return (
    <section
      className="py-28 border-t border-green-2 bg-green"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 440px' } as React.CSSProperties}
    >
      <div className="max-w-content mx-auto px-6 text-center">
        <Reveal>
          <RegisLogo className="text-3xl" light />
          <h2 className="font-serif text-4xl md:text-5xl text-bg mt-8 mb-5 leading-tight">
            Your next FCA review is coming.
            <br />
            <em className="not-italic text-gold">Are your documents ready?</em>
          </h2>
          <p className="text-base text-green-tint max-w-xl mx-auto mb-10" style={{ opacity: 0.78 }}>
            Join our design partner programme and get early access to the compliance review
            platform built for FCA-regulated firms.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/demo/clearview"
              className="px-8 py-3.5 text-sm font-medium bg-bg text-green hover:bg-green-tint transition-colors"
            >
              Run Sample FCA Review
            </Link>
            <span className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium border border-green-2 text-green-tint opacity-60 cursor-not-allowed select-none">
              Book a Demo
              <span className="text-[10px] font-semibold tracking-wide uppercase bg-green-2 text-bg px-1.5 py-0.5 leading-none">Soon</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-green-2 bg-green">
      <div className="max-w-content mx-auto px-6 pt-8 pb-4">
        <p className="text-xs text-green-tint text-center max-w-2xl mx-auto mb-6 pb-6 border-b border-green-2" style={{ opacity: 0.7 }}>
          Regis AI provides AI-assisted compliance review support and does not provide legal or regulatory advice.
          All findings and recommendations should be reviewed by qualified compliance and legal professionals before use.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
          <RegisLogo className="text-sm" light href="/" />
          <div className="flex items-center gap-6">
            {[
              { label: 'About', href: '/about' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Security', href: '/security' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="text-xs py-1.5 text-green-tint transition-colors hover:text-bg">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-green-tint">
            © 2026 Regis AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function LandingPage({ defaultCurrency = 'USD' }: { defaultCurrency?: Currency }) {
  return (
    <div className="min-h-screen">
      {/* Skip to main content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-sm focus:bg-bg focus:text-green focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>
      <LandingNav />
      <main id="main-content">
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <UseCases />
        <DocumentTypes />
        <FrameworkCoverage />
        <ExampleFindings />
        <TrustSection />
        <Testimonials />
        <FutureExpansion />
        <Pricing defaultCurrency={defaultCurrency} />
        <FAQ />
        <CTAFooter />
      </main>
      <SiteFooter />
    </div>
  )
}
