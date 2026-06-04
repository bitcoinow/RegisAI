import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { ApiError, FindingStatus } from '@/types'

const VALID_STATUSES: FindingStatus[] = ['open', 'in_progress', 'resolved', 'risk_accepted']

interface StatusResponse {
  status: FindingStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_note: string | null
  reviewer_label: string | null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<StatusResponse | ApiError>> {
  const { id } = await params

  // Use cookie-based client for auth (service client has no session cookie access)
  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service client for DB operations (bypasses RLS; ownership verified manually below)
  const supabase = createServiceClient()

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
  const { data: finding } = await supabase
    .from('findings')
    .select('id, audit_id')
    .eq('id', id)
    .single()

  if (!finding) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: audit } = await supabase
    .from('audits')
    .select('id')
    .eq('id', finding.audit_id)
    .eq('user_id', user.id)
    .single()

  if (!audit) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Any move away from 'open' records who reviewed it and when — the audit trail.
  const isReview = status !== 'open'
  const reviewedAt = isReview ? new Date().toISOString() : null
  const reviewedBy = isReview ? user.id : null

  const { error: updateError } = await supabase
    .from('findings')
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: reviewedAt,
      review_note: reviewNote,
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  const reviewerLabel = isReview ? user.email ?? null : null

  return NextResponse.json({
    status,
    reviewed_by: reviewedBy,
    reviewed_at: reviewedAt,
    review_note: reviewNote,
    reviewer_label: reviewerLabel,
  })
}
