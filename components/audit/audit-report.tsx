'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Audit, Finding, FindingStatus, RiskLevel } from '@/types'
import { RiskBadge } from '@/components/ui/risk-badge'
import { CoverageMatrix } from '@/components/audit/coverage-matrix'
import { AuditComparison, type ComparisonData } from '@/components/audit/audit-comparison'
import type { CoverageItem } from '@/lib/coverage'

const RISK_ORDER: Record<RiskLevel, number> = { High: 0, Medium: 1, Low: 2 }

const JURISDICTION_FRAMEWORKS: Record<string, string> = {
  US: 'FINRA · SEC · AML/BSA · Reg BI · BCP',
  EU: 'MiFID II · GDPR · AMLD6 · DORA · SFDR · MAR',
  UK: 'FCA Rules · UK AML · UK GDPR · SM&CR · FCA OpRes',
}

const STATUS_CONFIG: Record<FindingStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'text-ink-3' },
  in_progress: { label: 'In Progress', color: 'text-risk-medium' },
  resolved: { label: 'Resolved', color: 'text-green' },
  risk_accepted: { label: 'Risk Accepted', color: 'text-risk-low' },
}

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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

interface ReviewInfo {
  reviewer_label: string | null
  reviewed_at: string | null
  review_note: string | null
}

function FindingCard({ finding, isDemo }: { finding: Finding; isDemo: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<FindingStatus>(finding.status ?? 'open')
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState<string>(finding.review_note ?? '')
  const [review, setReview] = useState<ReviewInfo>({
    reviewer_label: finding.reviewer_label ?? null,
    reviewed_at: finding.reviewed_at ?? null,
    review_note: finding.review_note ?? null,
  })
  const [noteSaved, setNoteSaved] = useState(false)
  const [draft, setDraft] = useState<string | null>(finding.drafted_policy ?? null)
  const [drafting, setDrafting] = useState(false)
  const [draftError, setDraftError] = useState(false)
  const [copied, setCopied] = useState(false)

  // Persist a status change (and the current rationale note) and capture the
  // returned reviewer attribution.
  async function persist(next: FindingStatus, noteToSend: string) {
    if (!finding.id) return false
    const res = await fetch(`/api/findings/${finding.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next, review_note: noteToSend }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as ReviewInfo
    setReview({
      reviewer_label: data.reviewer_label,
      reviewed_at: data.reviewed_at,
      review_note: data.review_note,
    })
    return true
  }

  async function updateStatus(next: FindingStatus) {
    if (next === status || saving || !finding.id) return
    const prev = status
    setStatus(next)
    setSaving(true)
    try {
      const ok = await persist(next, note)
      if (!ok) setStatus(prev)
    } catch {
      setStatus(prev)
    } finally {
      setSaving(false)
    }
  }

  async function saveNote() {
    if (saving || status === 'open') return
    setSaving(true)
    setNoteSaved(false)
    try {
      const ok = await persist(status, note)
      if (ok) {
        setNoteSaved(true)
        setTimeout(() => setNoteSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  async function generateDraft() {
    if (drafting || !finding.id) return
    setDrafting(true)
    setDraftError(false)
    try {
      const res = await fetch(`/api/findings/${finding.id}/draft`, { method: 'POST' })
      if (!res.ok) {
        setDraftError(true)
        return
      }
      const data = (await res.json()) as { drafted_policy?: string }
      if (data.drafted_policy) setDraft(data.drafted_policy)
      else setDraftError(true)
    } catch {
      setDraftError(true)
    } finally {
      setDrafting(false)
    }
  }

  async function copyDraft() {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — no-op; the text remains selectable on screen.
    }
  }

  return (
    <div className="border border-rule bg-bg-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen((o) => !o)}
        className="flex items-start justify-between gap-4 px-6 py-4 cursor-pointer select-none"
      >
        <div className="min-w-0">
          <p className="font-mono text-xs text-ink-3 mb-1">{finding.rule}</p>
          <p className="text-ink text-sm font-medium">{finding.requirement}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
          <StatusBadge status={status} />
          <RiskBadge risk={finding.risk} />
          <span
            className={`text-ink-3 text-xs transition-transform select-none ${isOpen ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </div>
      </div>

      {isOpen && (
      <div className="border-t border-rule px-6 py-5 space-y-4 text-sm">
        {!isDemo && (
          <div className="print:hidden space-y-3">
            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2">Status</p>
              <StatusToggle status={status} onUpdate={updateStatus} disabled={saving} />
            </div>
            {status !== 'open' && (
              <div>
                <label className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2 block">
                  Review rationale
                  {status === 'risk_accepted' && (
                    <span className="text-risk-low"> — required to accept residual risk</span>
                  )}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Document who reviewed this and why (e.g. remediated in v2; or risk accepted because…)"
                  className="w-full border border-rule bg-bg text-ink-2 text-sm p-3 focus:outline-none focus:border-green"
                />
                <button
                  onClick={saveNote}
                  disabled={saving}
                  className="mt-2 border border-rule px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase text-ink hover:bg-bg transition-colors disabled:opacity-50"
                >
                  {noteSaved ? 'Saved ✓' : 'Save rationale'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Review attribution (audit trail) ─────────────────────────────── */}
        {review.reviewed_at && (
          <div className="border-l-2 border-green pl-4 py-1">
            <p className="font-mono text-[11px] text-ink-3">
              {STATUS_CONFIG[status].label} by{' '}
              <span className="text-ink-2">{review.reviewer_label ?? 'reviewer'}</span>
              {' · '}
              {formatReviewDate(review.reviewed_at)}
            </p>
            {review.review_note && (
              <p className="text-ink-2 text-sm leading-relaxed mt-1 italic">
                “{review.review_note}”
              </p>
            )}
          </div>
        )}

        <Section label="Policy says" content={finding.policy_says} />
        <Section label="Gap" content={finding.gap} />
        <Section label="Recommendation" content={finding.recommendation} />

        {/* ── Drafted policy language ─────────────────────────────────────── */}
        {(draft || !isDemo) && (
          <div className="pt-2 border-t border-rule">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
                Suggested policy language
              </p>
              {draft && (
                <button
                  onClick={copyDraft}
                  className="print:hidden font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink transition-colors"
                >
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              )}
            </div>

            {draft ? (
              <div className="border border-rule bg-bg p-4 whitespace-pre-wrap text-ink-2 leading-relaxed font-mono text-xs">
                {draft}
              </div>
            ) : (
              <p className="text-ink-3 text-sm leading-relaxed">
                Generate ready-to-paste compliance-manual language that closes this gap.
              </p>
            )}

            {!isDemo && (
              <div className="print:hidden mt-3 flex items-center gap-3">
                <button
                  onClick={generateDraft}
                  disabled={drafting}
                  className="border border-rule px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase text-ink hover:bg-bg transition-colors disabled:opacity-50"
                >
                  {drafting ? 'Drafting…' : draft ? 'Regenerate' : 'Draft policy language'}
                </button>
                {draftError && (
                  <span className="font-mono text-[10px] tracking-widest uppercase text-risk-high">
                    Failed — try again
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      )}
    </div>
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
  coverage?: CoverageItem[]
  comparison?: ComparisonData
  rescanHref?: string
  frameworkLabel?: string
}

export function AuditReport({
  audit,
  isDemo = false,
  coverage,
  comparison,
  rescanHref,
  frameworkLabel,
}: AuditReportProps) {
  const jurisdictionColor =
    audit.jurisdiction === 'EU' ? 'var(--blue)'
    : audit.jurisdiction === 'UK' ? 'var(--gold)'
    : 'var(--ink-3)'
  const sortedFindings = [...audit.findings].sort(
    (a, b) => RISK_ORDER[a.risk]! - RISK_ORDER[b.risk]!
  )

  const scopeLabel = frameworkLabel ?? audit.framework ?? null

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
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-block font-mono text-xs tracking-widest uppercase px-3 py-1 border"
              style={{ color: jurisdictionColor, borderColor: jurisdictionColor }}
            >
              {audit.jurisdiction ?? 'US'}
            </span>
            {scopeLabel && (
              <span className="inline-block font-mono text-xs tracking-widest uppercase px-3 py-1 border border-green text-green">
                {scopeLabel}
              </span>
            )}
          </div>
          <h1 className="font-serif text-4xl text-ink mb-2">{audit.firm_name}</h1>
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
            Regulatory Gap Analysis &nbsp;·&nbsp; {formattedDate}
            {audit.scan_number && audit.scan_number > 1 ? ` · Re-scan #${audit.scan_number}` : ''}
          </p>
          <p className="font-mono text-xs text-ink-3 mt-1">
            {scopeLabel ?? JURISDICTION_FRAMEWORKS[audit.jurisdiction ?? 'US'] ?? JURISDICTION_FRAMEWORKS.US}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {audit.compliance_score != null && (
            <div className="text-center border border-rule px-4 py-2 bg-bg-2">
              <div className="font-serif text-3xl text-green leading-none">
                {audit.compliance_score}%
              </div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mt-1">
                Posture
              </div>
            </div>
          )}
          {!isDemo && rescanHref && (
            <Link
              href={rescanHref}
              className="print:hidden border border-green bg-green text-white px-4 py-2 font-mono text-xs tracking-widest uppercase hover:bg-green-2 transition-colors"
            >
              Re-scan
            </Link>
          )}
          {!isDemo && (
            <a
              href={`/api/audit/${audit.id}/pdf`}
              download
              className="print:hidden border border-rule px-4 py-2 font-mono text-xs tracking-widest uppercase text-ink hover:bg-bg-2 transition-colors inline-block text-center"
            >
              Download PDF
            </a>
          )}
          {isDemo && (
            <a
              href={`/api/demo/${audit.id.replace('demo-', '')}/pdf`}
              download
              className="print:hidden border border-rule px-4 py-2 font-mono text-xs tracking-widest uppercase text-ink hover:bg-bg-2 transition-colors inline-block text-center"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>

      {/* ── Re-scan comparison (when this audit supersedes a prior one) ───────── */}
      {comparison && <AuditComparison data={comparison} />}

      {/* ── Compliance Posture Overview ─────────────────────────────────────── */}
      <section className="mb-10">
        <SectionHeading>Compliance Posture Overview</SectionHeading>
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

      {/* ── Coverage Matrix ────────────────────────────────────────────────── */}
      {coverage && coverage.length > 0 && (
        <CoverageMatrix items={coverage} frameworkLabel={scopeLabel ?? (audit.jurisdiction ?? 'US')} />
      )}

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
