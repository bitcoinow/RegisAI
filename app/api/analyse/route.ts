import { NextRequest, NextResponse } from 'next/server'
import { runGapAnalysis } from '@/lib/claude'
import { computeComplianceScore, computeDelta, getScopedRequirements } from '@/lib/coverage'
import { createClient } from '@/lib/supabase/server'
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

  const supabase = await createClient()

  // ── 1. Auth check ──────────────────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 2. Fetch document + profile in parallel ────────────────────────────────
  const [{ data: document, error: docError }, { data: profile }] = await Promise.all([
    supabase
      .from('documents')
      .select('id, user_id, file_name, extracted_text, status')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single(),
    supabase.from('profiles').select('firm_name').eq('id', user.id).single(),
  ])

  if (docError || !document) {
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
  await supabase
    .from('documents')
    .update({ status: 'analysing' })
    .eq('id', document_id)

  // ── 4b. If this is a re-scan, load the parent audit + its findings ─────────
  let parentScanNumber = 0
  let parentFindings: Finding[] = []
  if (parent_audit_id) {
    const { data: parent } = await supabase
      .from('audits')
      .select('id, scan_number, jurisdiction, framework')
      .eq('id', parent_audit_id)
      .eq('user_id', user.id)
      .single()
    if (!parent) {
      return NextResponse.json({ error: 'Parent audit not found' }, { status: 404 })
    }
    parentScanNumber = (parent.scan_number as number) ?? 1
    // Lock scope to the parent's so the delta is apples-to-apples.
    jurisdiction = (parent.jurisdiction as Jurisdiction) ?? jurisdiction
    framework = (parent.framework as RegulatoryFramework | null) ?? null
    const { data: pf } = await supabase
      .from('findings')
      .select('id, req_id, rule, requirement, policy_says, gap, risk, recommendation')
      .eq('audit_id', parent_audit_id)
    parentFindings = ((pf as Record<string, unknown>[]) ?? []).map((f) => ({
      id: (f['id'] as string) ?? '',
      req_id: (f['req_id'] as string) ?? undefined,
      rule: (f['rule'] as string) ?? '',
      requirement: (f['requirement'] as string) ?? '',
      policy_says: (f['policy_says'] as string) ?? '',
      gap: (f['gap'] as string) ?? '',
      risk: (f['risk'] as Finding['risk']) ?? 'Low',
      recommendation: (f['recommendation'] as string) ?? '',
    }))
  }

  // ── 5. Run gap analysis ────────────────────────────────────────────────────
  let auditResult
  try {
    auditResult = await runGapAnalysis(document.extracted_text, firmName, jurisdiction, framework)
  } catch (err) {
    console.error('Gap analysis failed:', err)
    await supabase
      .from('documents')
      .update({ status: 'error' })
      .eq('id', document_id)
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

  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .insert({
      document_id,
      user_id: user.id,
      jurisdiction,
      framework,
      firm_name: auditResult.firm_name,
      exec_summary: auditResult.exec_summary,
      total_gaps: auditResult.gaps.length,
      high_risk: riskCounts.high,
      medium_risk: riskCounts.medium,
      low_risk: riskCounts.low,
      strengths: auditResult.strengths,
      priority_actions: auditResult.priority_actions,
      raw_result: auditResult,
      parent_audit_id,
      scan_number: parentScanNumber + 1,
      compliance_score: complianceScore,
      requirements_total: requirementsTotal,
      requirements_met: requirementsMet,
      ...(delta ?? {}),
    })
    .select('id')
    .single()

  if (auditError || !audit) {
    console.error('Failed to insert audit record:', auditError)
    await supabase.from('documents').update({ status: 'error' }).eq('id', document_id)
    return NextResponse.json({ error: 'Failed to save audit.' }, { status: 500 })
  }

  // ── 7. Persist individual findings ────────────────────────────────────────
  const findingsToInsert = auditResult.gaps.map((finding: Finding) => ({
    audit_id: audit.id,
    req_id: finding.id,
    rule: finding.rule,
    requirement: finding.requirement,
    policy_says: finding.policy_says,
    gap: finding.gap,
    risk: finding.risk,
    recommendation: finding.recommendation,
    status: 'open',
  }))

  if (findingsToInsert.length > 0) {
    const { error: findingsError } = await supabase
      .from('findings')
      .insert(findingsToInsert)

    if (findingsError) {
      // Non-fatal — audit record exists, findings can be re-derived from raw_result
      console.error('Failed to insert findings:', findingsError)
    }
  }

  // ── 8. Mark document as complete ──────────────────────────────────────────
  await supabase.from('documents').update({ status: 'complete' }).eq('id', document_id)

  return NextResponse.json({ audit_id: audit.id }, { status: 200 })
}
