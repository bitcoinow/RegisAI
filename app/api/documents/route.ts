import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPdf } from '@/lib/pdf'
import { db } from '@/lib/db'
import type { DocumentUploadResponse, ApiError } from '@/types'

// GET /api/documents — list documents for the authenticated user
export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  const userId = request.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const documents = await db.listDocuments(userId)
  return NextResponse.json(documents)
}

// POST /api/documents — upload a PDF and extract text
export async function POST(
  request: NextRequest
): Promise<NextResponse<DocumentUploadResponse | ApiError>> {
  const userId = request.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
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

  // ── Insert document record (file_path null until R2 integration) ───────────
  const id = await db.createDocument(userId, file.name, parsed.text, parsed.pageCount)

  return NextResponse.json(
    { document_id: id, page_count: parsed.pageCount ?? 0 },
    { status: 201 }
  )
}
