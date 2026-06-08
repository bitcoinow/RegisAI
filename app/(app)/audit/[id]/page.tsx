import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { db } from '@/lib/db'
import { AuditReport } from '@/components/audit/audit-report'
import type { ComparisonData } from '@/components/audit/audit-comparison'
import { buildCoverageMatrix, computeDelta } from '@/lib/coverage'
import type {
  Audit,
  Finding,
  FindingStatus,
  Jurisdiction,
  RegulatoryFramework,
  RiskLevel,
} from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

function mapFinding(raw: unknown, currentUser: { id: string; email?: string }): Finding {
  const f = raw as Record<string, unknown>
  const reviewedBy = (f['reviewed_by'] as string | null) ?? null
  return {
    id: (f['id'] as string) ?? '',
    req_id: (f['req_id'] as string) ?? undefined,
    rule: (f['rule'] as string) ?? '',
    requirement: (f['requirement'] as string) ?? '',
    policy_says: (f['policy_says'] as string) ?? '',
    gap: (f['gap'] as string) ?? '',
    risk: (f['risk'] as RiskLevel) ?? 'Low',
    recommendation: (f['recommendation'] as string) ?? '',
    status: (f['status'] as FindingStatus) ?? 'open',
    drafted_policy: (f['drafted_policy'] as string | null) ?? null,
    reviewed_by: reviewedBy,
    reviewed_at: (f['reviewed_at'] as string | null) ?? null,
    review_note: (f['review_note'] as string | null) ?? null,
    // RLS scoped by userId; reviewer label is surfaced when reviewer matches current user.
    reviewer_label: reviewedBy && reviewedBy === currentUser.id ? currentUser.email ?? null : null,
  }
}

export default async function AuditReportPage({ params }: PageProps) {
  const { id } = await params
  const hdrs = await headers()
  const userId = hdrs.get('x-user-id')
  if (!userId) redirect('/login')
  const email = hdrs.get('x-user-email')
  const currentUser = { id: userId, ...(email ? { email } : {}) }

  const row = await db.getAudit(id, userId)
  if (!row) notFound()

  const findings: Finding[] = (await db.getFindings(id)).map((raw) =>
    mapFinding(raw, currentUser)
  )

  const jurisdiction = (row.jurisdiction ?? 'US') as Jurisdiction
  const framework = (row.framework as RegulatoryFramework | null) ?? null

  const audit: Audit = {
    id: row.id,
    document_id: row.document_id,
    user_id: userId,
    jurisdiction,
    framework,
    firm_name: row.firm_name,
    exec_summary: row.exec_summary ?? '',
    total_gaps: row.total_gaps ?? 0,
    high_risk: row.high_risk ?? 0,
    medium_risk: row.medium_risk ?? 0,
    low_risk: row.low_risk ?? 0,
    strengths: row.strengths ?? [],
    priority_actions: row.priority_actions ?? [],
    findings,
    created_at: row.created_at,
    parent_audit_id: row.parent_audit_id ?? null,
    scan_number: row.scan_number ?? 1,
    compliance_score: row.compliance_score ?? null,
    requirements_total: row.requirements_total ?? null,
    requirements_met: row.requirements_met ?? null,
  }

  // ── Coverage matrix (every in-scope requirement, met or gap) ───────────────
  const coverage = buildCoverageMatrix(jurisdiction, framework, findings)

  // ── Re-scan comparison (only when this audit supersedes a prior one) ───────
  let comparison: ComparisonData | undefined

  if (audit.parent_audit_id) {
    const parentRow = await db.getAudit(audit.parent_audit_id, userId)

    if (parentRow) {
      const parentFindings: Finding[] = (await db.getFindings(audit.parent_audit_id)).map((raw) =>
        mapFinding(raw, currentUser)
      )
      const delta = computeDelta(parentFindings, findings)
      comparison = {
        scanNumber: audit.scan_number ?? 2,
        previousDate: parentRow.created_at,
        previousScore: parentRow.compliance_score ?? null,
        currentScore: audit.compliance_score ?? null,
        previous: {
          high: parentRow.high_risk ?? 0,
          medium: parentRow.medium_risk ?? 0,
          low: parentRow.low_risk ?? 0,
          total: parentRow.total_gaps ?? 0,
        },
        current: {
          high: audit.high_risk,
          medium: audit.medium_risk,
          low: audit.low_risk,
          total: audit.total_gaps,
        },
        gaps_closed: delta.gaps_closed,
        gaps_persisting: delta.gaps_persisting,
        gaps_new: delta.gaps_new,
        closed: delta.closed,
        persisting: delta.persisting,
        added: delta.added,
        improvedReqIds: delta.improved.map((f) => f.req_id ?? f.id),
      }
    }
  }

  return (
    <div style={{ viewTransitionName: `audit-${id}` }}>
      <div className="border-b border-rule bg-bg">
        <div className="max-w-content mx-auto px-6 py-3">
          <Link href="/dashboard" className="text-ink-3 text-xs font-mono hover:text-ink">
            ← Dashboard
          </Link>
        </div>
      </div>
      <AuditReport
        audit={audit}
        coverage={coverage}
        {...(comparison ? { comparison } : {})}
        {...(framework ? { frameworkLabel: framework } : {})}
        rescanHref={`/audit/new?parent=${audit.id}`}
      />
    </div>
  )
}
