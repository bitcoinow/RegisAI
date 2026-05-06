import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPdf } from '@/lib/pdf'
import { createServiceClient } from '@/lib/supabase/server'
import type { DocumentUploadResponse, ApiError } from '@/types'

// GET /api/documents — list documents for the authenticated user
export async function GET(
  _req: NextRequest
): Promise<NextResponse> {
  const supabase = await createServiceClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: documents, error } = await supabase
    .from('documents')
    .select('id, file_name, page_count, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents.' }, { status: 500 })
  }

  return NextResponse.json(documents)
}

// POST /api/documents — upload a PDF and extract text
export async function POST(
  req: NextRequest
): Promise<NextResponse<DocumentUploadResponse | ApiError>> {
  const supabase = await createServiceClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted.' }, { status: 415 })
  }

  // ── Extract text ───────────────────────────────────────────────────────────
  const buffer = Buffer.from(await file.arrayBuffer())
  let parsed
  try {
    parsed = await extractTextFromPdf(buffer)
  } catch (err) {
    console.error('PDF extraction failed:', err)
    return NextResponse.json(
      { error: 'Failed to extract text from PDF.' },
      { status: 422 }
    )
  }

  // ── Upload file to Supabase Storage ────────────────────────────────────────
  const storagePath = `${user.id}/${Date.now()}-${file.name}`

  const { error: storageError } = await supabase.storage
    .from('documents')
    .upload(storagePath, buffer, { contentType: 'application/pdf', upsert: false })

  if (storageError) {
    console.error('Storage upload failed:', storageError)
    return NextResponse.json(
      { error: 'Failed to store document.' },
      { status: 500 }
    )
  }

  // ── Insert document record ─────────────────────────────────────────────────
  const { data: document, error: insertError } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_path: storagePath,
      extracted_text: parsed.text,
      page_count: parsed.pageCount,
      status: 'uploaded',
    })
    .select('id, page_count')
    .single()

  if (insertError || !document) {
    console.error('Failed to insert document record:', insertError)
    return NextResponse.json(
      { error: 'Failed to save document record.' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { document_id: document.id, page_count: document.page_count ?? 0 },
    { status: 201 }
  )
}
