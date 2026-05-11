import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { ApiError, FindingStatus } from '@/types'

const VALID_STATUSES: FindingStatus[] = ['open', 'in_progress', 'resolved']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ status: FindingStatus } | ApiError>> {
  const { id } = await params
  const supabase = await createServiceClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let status: FindingStatus
  try {
    const body = (await req.json()) as { status?: unknown }
    if (!body.status || !VALID_STATUSES.includes(body.status as FindingStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    status = body.status as FindingStatus
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

  const { error: updateError } = await supabase
    .from('findings')
    .update({ status })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ status })
}
