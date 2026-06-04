import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/documents/[id]/download
// Mints a short-lived signed URL for the document's original PDF (the `documents`
// Storage bucket is private) and redirects to it. Ownership is enforced by RLS:
// the row select and the storage SELECT policy both scope to auth.uid().
export async function GET(
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

  if (!document || !document.file_path) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from('documents')
    .createSignedUrl(document.file_path, 60)

  if (signError || !signed?.signedUrl) {
    console.error('Failed to create signed URL:', signError)
    return NextResponse.json({ error: 'Failed to generate download link.' }, { status: 500 })
  }

  return NextResponse.redirect(signed.signedUrl)
}
