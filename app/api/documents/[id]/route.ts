import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE /api/documents/[id]
// Deletes the document row (cascades to audits and findings via FK). Ownership is
// enforced by db.getDocument which scopes the SELECT to user_id.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const userId = request.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const document = await db.getDocument(id, userId)
  if (!document) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await db.deleteDocument(id, userId)

  return new NextResponse(null, { status: 204 })
}
