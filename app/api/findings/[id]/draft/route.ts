import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { draftPolicyLanguage } from '@/lib/claude'
import type { ApiError, DraftPolicyResponse, Jurisdiction, RiskLevel } from '@/types'

// POST /api/findings/[id]/draft
// Generates amended compliance-manual language that closes this finding's gap,
// persists it on the finding, and returns it.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DraftPolicyResponse | ApiError>> {
  const { id } = await params

  // ── Auth (session-based) ───────────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Load finding + owning audit, then verify ownership ─────────────────────
  const admin = createServiceClient()

  const { data: finding } = await admin
    .from('findings')
    .select('id, audit_id, rule, requirement, policy_says, gap, recommendation, risk')
    .eq('id', id)
    .single()

  if (!finding) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: audit } = await admin
    .from('audits')
    .select('id, user_id, jurisdiction, firm_name')
    .eq('id', finding.audit_id)
    .single()

  if (!audit || audit.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // ── Generate the policy language ───────────────────────────────────────────
  let drafted: string
  try {
    drafted = await draftPolicyLanguage(
      {
        rule: finding.rule ?? '',
        requirement: finding.requirement ?? '',
        policy_says: finding.policy_says ?? '',
        gap: finding.gap ?? '',
        recommendation: finding.recommendation ?? '',
        risk: (finding.risk as RiskLevel) ?? 'Low',
      },
      (audit.jurisdiction as Jurisdiction) ?? 'US',
      audit.firm_name ?? undefined
    )
  } catch (err) {
    console.error('Policy drafting failed:', err)
    return NextResponse.json(
      { error: 'Drafting failed. Please try again.' },
      { status: 500 }
    )
  }

  // ── Persist (non-fatal if it fails — still return the draft) ───────────────
  const { error: updateError } = await admin
    .from('findings')
    .update({ drafted_policy: drafted })
    .eq('id', id)

  if (updateError) {
    console.error('Failed to persist drafted policy:', updateError)
  }

  return NextResponse.json({ drafted_policy: drafted })
}
