import { NextRequest, NextResponse } from 'next/server'
import { generateAuditPdf } from '@/lib/pdf-export'
import { CLEARVIEW_DEMO, GDPR_DEMO_V1, GDPR_DEMO_V2 } from '@/lib/demo-data'
import type { Audit } from '@/types'

const DEMOS: Record<string, Audit> = {
  'clearview': CLEARVIEW_DEMO,
  'gdpr-v1': GDPR_DEMO_V1,
  'gdpr-v2': GDPR_DEMO_V2,
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const demo = DEMOS[id]

  if (!demo) {
    return NextResponse.json({ error: 'Demo not found' }, { status: 404 })
  }

  const pdfBuffer = generateAuditPdf(demo, demo.findings ?? [], demo.framework ?? null)
  const slug = demo.firm_name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="regis-${slug}-demo.pdf"`,
      'Content-Length': String(pdfBuffer.byteLength),
    },
  })
}
