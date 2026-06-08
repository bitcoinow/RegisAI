import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
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

const FINDING_COLUMNS =
  'id, req_id, rule, requirement, policy_says, gap, risk, recommendation, status, drafted_policy, reviewed_by, reviewed_at, review_note'

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
    // RLS scopes audits to the owner, so the reviewer is almost always the
    // current user — surface their email as the attribution label.
    reviewer_label: reviewedBy && reviewedBy === currentUser.id ? currentUser.email ?? null : null,
  }
}

export default async function AuditReportPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()
  const currentUser = { id: user.id, ...(user.email ? { email: user.email } : {}) }

  const { data: row } = await supabase
    .from('audits')
    .select(
      `id, firm_name, exec_summary, total_gaps, high_risk, medium_risk, low_risk,
       strengths, priority_actions, created_at, document_id, jurisdiction, framework,
       parent_audit_id, scan_number, compliance_score, requirements_total, requirements_met,
       gaps_closed, gaps_new, gaps_persisting,
       findings (${FINDING_COLUMNS})`
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!row) notFound()

  const findings: Finding[] = ((row.findings as unknown[]) ?? []).map((raw) =>
    mapFinding(raw, currentUser)
  )

  const jurisdiction = (((row as unknown as Record<string, unknown>)['jurisdiction'] as string) ??
    'US') as Jurisdiction
  const framework = ((row as unknown as Record<string, unknown>)['framework'] as
    | RegulatoryFramework
    | null) ?? null

  const audit: Audit = {
    id: row.id as string,
    document_id: row.document_id as string,
    user_id: user.id,
    jurisdiction,
    framework,
    firm_name: row.firm_name as string,
    exec_summary: (row.exec_summary as string) ?? '',
    total_gaps: (row.total_gaps as number) ?? 0,
    high_risk: (row.high_risk as number) ?? 0,
    medium_risk: (row.medium_risk as number) ?? 0,
    low_risk: (row.low_risk as number) ?? 0,
    strengths: (row.strengths as string[]) ?? [],
    priority_actions: (row.priority_actions as string[]) ?? [],
    findings,
    created_at: row.created_at as string,
    parent_audit_id: (row.parent_audit_id as string | null) ?? null,
    scan_number: (row.scan_number as number) ?? 1,
    compliance_score: (row.compliance_score as number | null) ?? null,
    requirements_total: (row.requirements_total as number | null) ?? null,
    requirements_met: (row.requirements_met as number | null) ?? null,
  }

  // ── Coverage matrix (every in-scope requirement, met or gap) ───────────────
  const coverage = buildCoverageMatrix(jurisdiction, framework, findings)

  // ── Re-scan comparison (only when this audit supersedes a prior one) ───────
  let comparison: ComparisonData | undefined
  if (audit.parent_audit_id) {
    const { data: parentRow } = await supabase
      .from('audits')
      .select(
        `id, created_at, compliance_score, high_risk, medium_risk, low_risk, total_gaps,
         findings (${FINDING_COLUMNS})`
      )
      .eq('id', audit.parent_audit_id)
      .eq('user_id', user.id)
      .single()

    if (parentRow) {
      const parentFindings: Finding[] = ((parentRow.findings as unknown[]) ?? []).map((raw) =>
        mapFinding(raw, currentUser)
      )
      const delta = computeDelta(parentFindings, findings)
      comparison = {
        scanNumber: audit.scan_number ?? 2,
        previousDate: parentRow.created_at as string,
        previousScore: (parentRow.compliance_score as number | null) ?? null,
        currentScore: audit.compliance_score ?? null,
        previous: {
          high: (parentRow.high_risk as number) ?? 0,
          medium: (parentRow.medium_risk as number) ?? 0,
          low: (parentRow.low_risk as number) ?? 0,
          total: (parentRow.total_gaps as number) ?? 0,
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
    <>
      <div className="border-b border-rule bg-bg">
        <div className="max-w-content mx-auto px-4 md:px-6 py-3">
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
    </>
  )
}
