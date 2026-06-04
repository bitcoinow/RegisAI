import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/documents/[id]
// Removes the original PDF from Storage and deletes the document row. Because
// audits.document_id cascades on delete, this also permanently removes the
// document's audits and their findings. Ownership is enforced by RLS on both the
// row delete and the storage delete (own-folder policies).
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: document } = await supabase
    .from('documents')
    .select('id, file_path')
    .eq('id', id)
    .single()

  if (!document) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Remove the stored file. Non-fatal: a missing object should still let the row
  // be cleaned up (e.g. a half-uploaded record).
  if (document.file_path) {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path])
    if (storageError) {
      console.error('Failed to remove storage object:', storageError)
    }
  }

  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error('Failed to delete document row:', deleteError)
    return NextResponse.json({ error: 'Failed to delete document.' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
