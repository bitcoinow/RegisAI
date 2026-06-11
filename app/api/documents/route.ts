import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPdf } from '@/lib/pdf'
import { createClient } from '@/lib/supabase/server'
import type { DocumentUploadResponse, ApiError } from '@/types'

// GET /api/documents — list documents for the authenticated user
export async function GET(
  _req: NextRequest
): Promise<NextResponse> {
  const supabase = await createClient()

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

const MAX_PASTED_CHARS = 50_000

// POST /api/documents — upload a PDF (multipart/form-data) or paste policy
// text (application/json: { text, title? }). Both paths return { document_id },
// so the downstream analyse flow is identical.
export async function POST(
  req: NextRequest
): Promise<NextResponse<DocumentUploadResponse | ApiError>> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Pasted-text path ───────────────────────────────────────────────────────
  if (req.headers.get('content-type')?.includes('application/json')) {
    let text: string
    let title: string | null = null
    try {
      const body = (await req.json()) as { text?: unknown; title?: unknown }
      if (typeof body.text !== 'string' || body.text.trim().length === 0) {
        return NextResponse.json({ error: 'text is required' }, { status: 400 })
      }
      text = body.text.trim()
      if (typeof body.title === 'string' && body.title.trim()) {
        title = body.title.trim().slice(0, 200)
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (text.length > MAX_PASTED_CHARS) {
      return NextResponse.json(
        { error: `Pasted text must be ${MAX_PASTED_CHARS.toLocaleString()} characters or fewer.` },
        { status: 400 }
      )
    }

    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: title ?? 'Pasted policy text',
        file_path: null,
        extracted_text: text,
        page_count: null,
        status: 'uploaded',
      })
      .select('id, page_count')
      .single()

    if (insertError || !document) {
      console.error('Failed to insert pasted document record:', insertError)
      return NextResponse.json({ error: 'Failed to save document record.' }, { status: 500 })
    }

    return NextResponse.json(
      { document_id: document.id, page_count: document.page_count ?? 0 },
      { status: 201 }
    )
  }

  // ── PDF upload path ────────────────────────────────────────────────────────
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
