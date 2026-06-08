import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateAuditPdf } from '@/lib/pdf-export'
import type { Finding, Jurisdiction, RegulatoryFramework } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const audit = await db.getAudit(id, userId)
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
  }

  const findingRows = await db.getFindings(id)

  const findings: Finding[] = findingRows.map((f) => ({
    id: f.id,
    req_id: f.req_id ?? undefined,
    rule: f.rule ?? '',
    requirement: f.requirement ?? '',
    policy_says: f.policy_says ?? '',
    gap: f.gap ?? '',
    risk: f.risk ?? 'Low',
    recommendation: f.recommendation ?? '',
    status: f.status,
    drafted_policy: f.drafted_policy ?? null,
    reviewed_by: f.reviewed_by ?? null,
    reviewed_at: f.reviewed_at ?? null,
    review_note: f.review_note ?? null,
  }))

  const jurisdiction = (audit.jurisdiction as Jurisdiction) ?? 'US'
  const framework = (audit.framework as RegulatoryFramework | null) ?? null

  const pdfBuffer = generateAuditPdf(
    {
      id: audit.id,
      document_id: audit.document_id,
      user_id: audit.user_id,
      jurisdiction,
      framework,
      firm_name: audit.firm_name ?? 'Unknown Firm',
      exec_summary: audit.exec_summary ?? '',
      total_gaps: audit.total_gaps ?? 0,
      high_risk: audit.high_risk ?? 0,
      medium_risk: audit.medium_risk ?? 0,
      low_risk: audit.low_risk ?? 0,
      strengths: audit.strengths ?? [],
      priority_actions: audit.priority_actions ?? [],
      findings: [],
      created_at: audit.created_at ?? new Date().toISOString(),
      parent_audit_id: audit.parent_audit_id ?? null,
      scan_number: audit.scan_number ?? 1,
      compliance_score: audit.compliance_score ?? null,
      requirements_total: audit.requirements_total ?? null,
      requirements_met: audit.requirements_met ?? null,
    },
    findings,
    framework,
  )

  const firmSlug = (audit.firm_name ?? 'audit').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="regis-${firmSlug}-${id.slice(0, 8)}.pdf"`,
      'Content-Length': String(pdfBuffer.byteLength),
    },
  })
}
