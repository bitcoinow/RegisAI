'use client'

import { useState } from 'react'
import type { Audit, Finding, FindingStatus, RiskLevel } from '@/types'
import { RiskBadge } from '@/components/ui/risk-badge'

const RISK_ORDER: Record<RiskLevel, number> = { High: 0, Medium: 1, Low: 2 }

const JURISDICTION_FRAMEWORKS: Record<string, string> = {
  US: 'FINRA · SEC · AML/BSA · Reg BI · BCP',
  EU: 'MiFID II · GDPR · AMLD6 · DORA · SFDR · MAR',
  UK: 'FCA Rules · UK AML · UK GDPR · SM&CR · FCA OpRes',
}

const STATUS_CONFIG: Record<FindingStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'text-ink-3' },
  in_progress: { label: 'In Progress', color: 'text-amber' },
  resolved: { label: 'Resolved', color: 'text-green' },
}

function StatusBadge({ status }: { status: FindingStatus }) {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <span className={`font-mono text-[10px] tracking-widest uppercase ${color}`}>{label}</span>
  )
}

function StatusToggle({
  status,
  onUpdate,
  disabled,
}: {
  status: FindingStatus
  onUpdate: (s: FindingStatus) => void
  disabled: boolean
}) {
  return (
    <div className="flex border border-rule divide-x divide-rule">
      {(Object.keys(STATUS_CONFIG) as FindingStatus[]).map((s) => {
        const { label, color } = STATUS_CONFIG[s]
        const active = s === status
        return (
          <button
            key={s}
            disabled={disabled}
            onClick={() => onUpdate(s)}
            className={`px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors disabled:opacity-50
              ${active ? `bg-bg ${color}` : 'text-ink-3/50 hover:text-ink-3 hover:bg-bg'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function StatBox({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="border border-rule p-6 bg-bg-2 text-center">
      <div className="font-serif text-4xl mb-1" style={{ color }}>
        {value}
      </div>
      <div className="font-mono text-xs tracking-widest uppercase text-ink-3">{label}</div>
    </div>
  )
}

function FindingCard({ finding, isDemo }: { finding: Finding; isDemo: boolean }) {
  const [status, setStatus] = useState<FindingStatus>(finding.status ?? 'open')
  const [saving, setSaving] = useState(false)

  async function updateStatus(next: FindingStatus) {
    if (next === status || saving || !finding.id) return
    const prev = status
    setStatus(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/findings/${finding.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) setStatus(prev)
    } catch {
      setStatus(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <details className="border border-rule bg-bg-2 group">
      <summary className="flex items-start justify-between gap-4 px-6 py-4 cursor-pointer list-none">
        <div className="min-w-0">
          <p className="font-mono text-xs text-ink-3 mb-1">{finding.rule}</p>
          <p className="text-ink text-sm font-medium">{finding.requirement}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
          <StatusBadge status={status} />
          <RiskBadge risk={finding.risk} />
          <span className="text-ink-3 text-xs group-open:rotate-180 transition-transform select-none">
            ▾
          </span>
        </div>
      </summary>

      <div className="border-t border-rule px-6 py-5 space-y-4 text-sm">
        {!isDemo && (
          <div className="print:hidden">
            <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2">Status</p>
            <StatusToggle status={status} onUpdate={updateStatus} disabled={saving} />
          </div>
        )}
        <Section label="Policy says" content={finding.policy_says} />
        <Section label="Gap" content={finding.gap} />
        <Section label="Recommendation" content={finding.recommendation} />
      </div>
    </details>
  )
}

function Section({ label, content }: { label: string; content: string }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-1">{label}</p>
      <p className="text-ink-2 leading-relaxed">{content}</p>
    </div>
  )
}

interface AuditReportProps {
  audit: Audit
  isDemo?: boolean
}

export function AuditReport({ audit, isDemo = false }: AuditReportProps) {
  const jurisdictionColor =
    audit.jurisdiction === 'EU' ? 'var(--blue)'
    : audit.jurisdiction === 'UK' ? 'var(--gold)'
    : 'var(--ink-3)'
  const sortedFindings = [...audit.findings].sort(
    (a, b) => RISK_ORDER[a.risk]! - RISK_ORDER[b.risk]!
  )

  const formattedDate = new Date(audit.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-content mx-auto px-6 py-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10 pb-8 border-b border-rule flex justify-between items-start">
        <div>
          {isDemo && (
            <div className="inline-block font-mono text-xs tracking-widest uppercase border border-gold px-3 py-1 text-gold mb-4">
              Demo Report
            </div>
          )}
          <span
            className="inline-block font-mono text-xs tracking-widest uppercase px-3 py-1 border mb-4"
            style={{ color: jurisdictionColor, borderColor: jurisdictionColor }}
          >
            {audit.jurisdiction ?? 'US'}
          </span>
          <h1 className="font-serif text-4xl text-ink mb-2">{audit.firm_name}</h1>
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
            Regulatory Gap Analysis &nbsp;·&nbsp; {formattedDate}
          </p>
          <p className="font-mono text-xs text-ink-3 mt-1">
            {JURISDICTION_FRAMEWORKS[audit.jurisdiction ?? 'US'] ?? JURISDICTION_FRAMEWORKS.US}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden border border-rule px-4 py-2 font-mono text-xs tracking-widest uppercase text-ink hover:bg-bg-2 transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* ── Executive Summary ──────────────────────────────────────────────── */}
      <section className="mb-10">
        <SectionHeading>Executive Summary</SectionHeading>
        <div className="border-l-2 border-green pl-6 py-1">
          <p className="text-ink-2 leading-relaxed">{audit.exec_summary}</p>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <SectionHeading>Compliance Overview</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox value={audit.total_gaps} label="Total Gaps" color="var(--ink)" />
          <StatBox value={audit.high_risk} label="High Risk" color="var(--red)" />
          <StatBox value={audit.medium_risk} label="Medium Risk" color="var(--amber)" />
          <StatBox value={audit.low_risk} label="Low Risk" color="var(--blue)" />
        </div>
      </section>

      {/* ── Priority Actions ───────────────────────────────────────────────── */}
      {audit.priority_actions.length > 0 && (
        <section className="mb-10">
          <SectionHeading>Priority Actions</SectionHeading>
          <div className="border border-rule bg-bg-2 p-6 space-y-3">
            {audit.priority_actions.map((action, i) => (
              <div key={i} className="flex gap-4">
                <span className="font-mono text-xs text-green mt-1 flex-shrink-0 w-5">
                  {i + 1}.
                </span>
                <p className="text-ink-2 text-sm leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Findings ───────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <SectionHeading>
          Findings{' '}
          <span className="font-mono text-base text-ink-3 font-normal">
            ({audit.total_gaps})
          </span>
        </SectionHeading>
        <div className="space-y-2">
          {sortedFindings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} isDemo={isDemo} />
          ))}
        </div>
      </section>

      {/* ── Strengths ──────────────────────────────────────────────────────── */}
      {audit.strengths.length > 0 && (
        <section className="mb-10">
          <SectionHeading>Areas of Compliance</SectionHeading>
          <div className="border border-rule bg-bg-2 p-6 space-y-2">
            {audit.strengths.map((strength, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-green mt-0.5 flex-shrink-0">✓</span>
                <p className="text-ink-2 text-sm leading-relaxed">{strength}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="pt-8 border-t border-rule">
        <p className="font-mono text-xs text-ink-3">
          Prepared by Regis &nbsp;·&nbsp; All findings are recommendations, not legal advice.
          High-risk findings require human review before remediation.
        </p>
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl text-ink mb-4">{children}</h2>
  )
}
