import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AuditReport } from '@/components/audit/audit-report'
import type { Audit, Finding, FindingStatus, RiskLevel } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AuditReportPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: row } = await supabase
    .from('audits')
    .select(
      `id, firm_name, exec_summary, total_gaps, high_risk, medium_risk, low_risk,
       strengths, priority_actions, created_at, document_id, jurisdiction,
       findings (id, req_id, rule, requirement, policy_says, gap, risk, recommendation, status)`
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!row) notFound()

  const findings: Finding[] = ((row.findings as unknown[]) ?? []).map(
    (raw: unknown) => {
      const f = raw as Record<string, unknown>
      return {
        id: (f['id'] as string) ?? '',
        rule: (f['rule'] as string) ?? '',
        requirement: (f['requirement'] as string) ?? '',
        policy_says: (f['policy_says'] as string) ?? '',
        gap: (f['gap'] as string) ?? '',
        risk: (f['risk'] as RiskLevel) ?? 'Low',
        recommendation: (f['recommendation'] as string) ?? '',
        status: (f['status'] as FindingStatus) ?? 'open',
      }
    }
  )

  const audit: Audit = {
    id: row.id as string,
    document_id: row.document_id as string,
    user_id: user.id,
    jurisdiction: (((row as unknown as Record<string, unknown>)['jurisdiction'] as string) ?? 'US') as import('@/types').Jurisdiction,
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
  }

  return (
    <>
      <div className="border-b border-rule bg-bg">
        <div className="max-w-content mx-auto px-6 py-3">
          <Link href="/dashboard" className="text-ink-3 text-xs font-mono hover:text-ink">
            ← Dashboard
          </Link>
        </div>
      </div>
      <AuditReport audit={audit} />
    </>
  )
}
