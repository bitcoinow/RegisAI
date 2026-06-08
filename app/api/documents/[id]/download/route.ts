import { NextRequest, NextResponse } from 'next/server'

// GET /api/documents/[id]/download
// Returns 501 until R2 storage integration is complete. Documents uploaded after
// the D1 migration have no associated file (file_path is null).
export async function GET(
  _req: NextRequest,
  _ctx: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Document download not yet available (R2 migration pending)' },
    { status: 501 }
  )
}
