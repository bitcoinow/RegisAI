import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { draftPolicyLanguage } from '@/lib/claude'
import type { ApiError, DraftPolicyResponse, Jurisdiction, RiskLevel } from '@/types'

// ── Minimal inline D1 helper ─────────────────────────────────────────────────
// db.ts doesn't export getDB() or a getFinding(id) method. We need a direct
// SELECT to fetch finding fields required for the policy-drafting AI call.
// TODO: add db.getFinding(id) to db.ts and remove this block.

interface _D1Statement {
  bind(...values: unknown[]): _D1Statement
  first<T>(): Promise<T | null>
}

interface _D1 {
  prepare(sql: string): _D1Statement
}

interface _CFContext {
  env?: { DB?: _D1 }
}

const _CF_KEY = Symbol.for('__cloudflare-context__')

function _getD1(): _D1 {
  const ctx = (globalThis as unknown as Record<symbol, _CFContext | undefined>)[_CF_KEY]
  const d1 = ctx?.env?.DB
  if (!d1) throw new Error('D1 binding "DB" not found in Cloudflare context')
  return d1
}

interface FindingRecord {
  id: string
  audit_id: string
  rule: string | null
  requirement: string | null
  policy_says: string | null
  gap: string | null
  recommendation: string | null
  risk: string | null
}

// ─────────────────────────────────────────────────────────────────────────────

// POST /api/findings/[id]/draft
// Generates amended compliance-manual language that closes this finding's gap,
// persists it on the finding, and returns it.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DraftPolicyResponse | ApiError>> {
  const { id } = await params

  // ── Auth (header-based) ────────────────────────────────────────────────────
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Load finding + owning audit, then verify ownership ─────────────────────
  let finding: FindingRecord
  try {
    const row = await _getD1()
      .prepare(
        'SELECT id, audit_id, rule, requirement, policy_says, gap, recommendation, risk FROM findings WHERE id = ?'
      )
      .bind(id)
      .first<FindingRecord>()
    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    finding = row
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const audit = await db.getAudit(finding.audit_id, userId)
  if (!audit) {
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
  try {
    await db.updateFindingDraft(id, drafted)
  } catch (err) {
    console.error('Failed to persist drafted policy:', err)
  }

  return NextResponse.json({ drafted_policy: drafted })
}
