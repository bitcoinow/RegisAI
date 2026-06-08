import { NextRequest, NextResponse } from 'next/server'
import { runGapAnalysis } from '@/lib/claude'
import { computeComplianceScore, computeDelta, getScopedRequirements } from '@/lib/coverage'
import { db } from '@/lib/db'
import type {
  AnalyseResponse,
  ApiError,
  Finding,
  Jurisdiction,
  RegulatoryFramework,
} from '@/types'

export async function POST(
  req: NextRequest
): Promise<NextResponse<AnalyseResponse | ApiError>> {
  let document_id: string
  let jurisdiction: Jurisdiction
  let framework: RegulatoryFramework | null = null
  let parent_audit_id: string | null = null

  try {
    const body = (await req.json()) as {
      document_id?: unknown
      jurisdiction?: unknown
      framework?: unknown
      parent_audit_id?: unknown
    }
    if (!body.document_id || typeof body.document_id !== 'string') {
      return NextResponse.json({ error: 'document_id is required' }, { status: 400 })
    }
    document_id = body.document_id
    jurisdiction = (['US', 'EU', 'UK'] as const).includes(body.jurisdiction as Jurisdiction)
      ? (body.jurisdiction as Jurisdiction)
      : 'US'
    if (typeof body.framework === 'string' && body.framework.trim()) {
      framework = body.framework as RegulatoryFramework
    }
    if (typeof body.parent_audit_id === 'string' && body.parent_audit_id.trim()) {
      parent_audit_id = body.parent_audit_id
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Validate framework is in scope for the chosen jurisdiction.
  if (framework && getScopedRequirements(jurisdiction, framework).length === 0) {
    return NextResponse.json(
      { error: `Framework '${framework}' is not available for jurisdiction ${jurisdiction}.` },
      { status: 400 }
    )
  }

  // ── 1. Auth check ──────────────────────────────────────────────────────────
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 2. Fetch document + profile in parallel ────────────────────────────────
  const [document, profile] = await Promise.all([
    db.getDocument(document_id, userId),
    db.getProfile(userId),
  ])

  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  if (!document.extracted_text) {
    return NextResponse.json(
      { error: 'Document has no extracted text. Upload and extract the PDF first.' },
      { status: 422 }
    )
  }

  if (document.status === 'analysing') {
    return NextResponse.json(
      { error: 'Analysis already in progress for this document.' },
      { status: 409 }
    )
  }

  const firmName = profile?.firm_name ?? undefined

  // ── 4. Mark document as analysing ─────────────────────────────────────────
  // TODO: db.updateDocumentStatus(document_id, 'analysing') — method not yet in db.ts

  // ── 4b. If this is a re-scan, load the parent audit + its findings ─────────
  let parentScanNumber = 0
  let parentFindings: Finding[] = []
  if (parent_audit_id) {
    const parent = await db.getAudit(parent_audit_id, userId)
    if (!parent) {
      return NextResponse.json({ error: 'Parent audit not found' }, { status: 404 })
    }
    parentScanNumber = parent.scan_number ?? 1
    // Lock scope to the parent's so the delta is apples-to-apples.
    jurisdiction = (parent.jurisdiction as Jurisdiction) ?? jurisdiction
    framework = (parent.framework as RegulatoryFramework | null) ?? null
    const pf = await db.getFindings(parent_audit_id)
    parentFindings = pf.map((f) => ({
      id: f.id,
      req_id: f.req_id ?? undefined,
      rule: f.rule ?? '',
      requirement: f.requirement ?? '',
      policy_says: f.policy_says ?? '',
      gap: f.gap ?? '',
      risk: f.risk ?? 'Low',
      recommendation: f.recommendation ?? '',
    }))
  }

  // ── 5. Run gap analysis ────────────────────────────────────────────────────
  let auditResult
  try {
    auditResult = await runGapAnalysis(document.extracted_text, firmName, jurisdiction, framework)
  } catch (err) {
    console.error('Gap analysis failed:', err)
    // TODO: db.updateDocumentStatus(document_id, 'error') — method not yet in db.ts
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }

  // ── 6. Persist audit record ────────────────────────────────────────────────
  const riskCounts = auditResult.gaps.reduce(
    (acc, finding) => {
      if (finding.risk === 'High') acc.high++
      else if (finding.risk === 'Medium') acc.medium++
      else acc.low++
      return acc
    },
    { high: 0, medium: 0, low: 0 }
  )

  // ── 6a. Compute scope, posture score, and re-scan delta ────────────────────
  const requirementsTotal = getScopedRequirements(jurisdiction, framework).length
  const requirementsMet = Math.max(0, requirementsTotal - auditResult.gaps.length)
  const complianceScore = computeComplianceScore(requirementsTotal, riskCounts)

  let delta: { gaps_closed: number; gaps_new: number; gaps_persisting: number } | null = null
  if (parent_audit_id) {
    const currentFindings: Finding[] = auditResult.gaps.map((g) => ({
      ...g,
      req_id: g.id,
    }))
    const d = computeDelta(parentFindings, currentFindings)
    delta = {
      gaps_closed: d.gaps_closed,
      gaps_new: d.gaps_new,
      gaps_persisting: d.gaps_persisting,
    }
  }

  let auditId: string
  try {
    auditId = await db.createAudit({
      document_id,
      user_id: userId,
      jurisdiction,
      framework: framework ?? undefined,
      firm_name: auditResult.firm_name ?? '',
      exec_summary: auditResult.exec_summary,
      total_gaps: auditResult.gaps.length,
      high_risk: riskCounts.high,
      medium_risk: riskCounts.medium,
      low_risk: riskCounts.low,
      strengths: auditResult.strengths,
      priority_actions: auditResult.priority_actions,
      raw_result: JSON.stringify(auditResult),
      parent_audit_id: parent_audit_id ?? undefined,
      scan_number: parentScanNumber + 1,
      compliance_score: complianceScore,
      requirements_total: requirementsTotal,
      requirements_met: requirementsMet,
      ...(delta ?? {}),
    })
  } catch (err) {
    console.error('Failed to insert audit record:', err)
    // TODO: db.updateDocumentStatus(document_id, 'error') — method not yet in db.ts
    return NextResponse.json({ error: 'Failed to save audit.' }, { status: 500 })
  }

  // ── 7. Persist individual findings ────────────────────────────────────────
  const findingsToInsert = auditResult.gaps.map((finding: Finding) => ({
    req_id: finding.id,
    rule: finding.rule,
    requirement: finding.requirement,
    policy_says: finding.policy_says,
    gap: finding.gap,
    risk: finding.risk,
    recommendation: finding.recommendation,
    status: 'open' as const,
  }))

  try {
    await db.createFindings(auditId, findingsToInsert)
  } catch (err) {
    // Non-fatal — audit record exists, findings can be re-derived from raw_result
    console.error('Failed to insert findings:', err)
  }

  // ── 8. Mark document as complete ──────────────────────────────────────────
  // TODO: db.updateDocumentStatus(document_id, 'complete') — method not yet in db.ts

  return NextResponse.json({ audit_id: auditId }, { status: 200 })
}
