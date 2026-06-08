import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiError, FindingStatus } from '@/types'

const VALID_STATUSES: FindingStatus[] = ['open', 'in_progress', 'resolved', 'risk_accepted']

interface StatusResponse {
  status: FindingStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_note: string | null
  reviewer_label: string | null
}

// ── Minimal inline D1 helper ─────────────────────────────────────────────────
// db.ts doesn't export getDB() or a getFinding(id) method. We need a direct
// SELECT to fetch the finding's audit_id for ownership verification.
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

// ─────────────────────────────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<StatusResponse | ApiError>> {
  const { id } = await params

  const userId = req.headers.get('x-user-id')
  const userEmail = req.headers.get('x-user-email')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let status: FindingStatus
  let reviewNote: string | null = null
  try {
    const body = (await req.json()) as { status?: unknown; review_note?: unknown }
    if (!body.status || !VALID_STATUSES.includes(body.status as FindingStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    status = body.status as FindingStatus
    if (typeof body.review_note === 'string') {
      reviewNote = body.review_note.trim() || null
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Verify the finding exists and belongs to the authenticated user via audit ownership
  let auditId: string
  try {
    const finding = await _getD1()
      .prepare('SELECT id, audit_id FROM findings WHERE id = ?')
      .bind(id)
      .first<{ id: string; audit_id: string }>()
    if (!finding) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    auditId = finding.audit_id
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const audit = await db.getAudit(auditId, userId)
  if (!audit) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Any move away from 'open' records who reviewed it and when — the audit trail.
  const isReview = status !== 'open'
  const reviewedAt = isReview ? new Date().toISOString() : null
  const reviewedBy = isReview ? userId : null

  try {
    await db.updateFindingStatus(id, status, reviewedBy, reviewNote)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  const reviewerLabel = isReview ? userEmail ?? null : null

  return NextResponse.json({
    status,
    reviewed_by: reviewedBy,
    reviewed_at: reviewedAt,
    review_note: reviewNote,
    reviewer_label: reviewerLabel,
  })
}
