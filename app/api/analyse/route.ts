import { NextRequest, NextResponse } from 'next/server'
import { runGapAnalysis } from '@/lib/claude'
import { createServiceClient } from '@/lib/supabase/server'
import type { AnalyseResponse, ApiError, Finding } from '@/types'

export async function POST(
  req: NextRequest
): Promise<NextResponse<AnalyseResponse | ApiError>> {
  let document_id: string

  try {
    const body = (await req.json()) as { document_id?: unknown }
    if (!body.document_id || typeof body.document_id !== 'string') {
      return NextResponse.json({ error: 'document_id is required' }, { status: 400 })
    }
    document_id = body.document_id
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const supabase = await createServiceClient()

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

  // ── 5. Run gap analysis ────────────────────────────────────────────────────
  let auditResult
  try {
    auditResult = await runGapAnalysis(document.extracted_text, firmName)
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

  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .insert({
      document_id,
      user_id: user.id,
      firm_name: auditResult.firm_name,
      exec_summary: auditResult.exec_summary,
      total_gaps: auditResult.gaps.length,
      high_risk: riskCounts.high,
      medium_risk: riskCounts.medium,
      low_risk: riskCounts.low,
      strengths: auditResult.strengths,
      priority_actions: auditResult.priority_actions,
      raw_result: auditResult,
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
