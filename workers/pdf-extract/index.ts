import pdfParse from 'pdf-parse'

export interface Env {
  DOCUMENTS: R2Bucket
}

const ALLOWED_ORIGINS = [
  'https://regis.today',
  'https://www.regis.today',
  'http://localhost:3000',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

// PDF magic bytes: %PDF
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46] as const

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  })
}

function isPdf(buf: ArrayBuffer): boolean {
  const view = new Uint8Array(buf, 0, 4)
  return PDF_MAGIC.every((byte, i) => view[i] === byte)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const { pathname, searchParams } = new URL(request.url)

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    // POST / — upload PDF, extract text, store in R2
    if (request.method === 'POST') {
      let formData: FormData
      try {
        formData = await request.formData()
      } catch {
        return json({ error: 'Expected multipart/form-data body' }, 400, origin)
      }

      const file = formData.get('file')
      const userId = formData.get('userId')
      const documentId = formData.get('documentId')

      if (!(file instanceof File)) {
        return json({ error: 'Missing or invalid "file" field' }, 400, origin)
      }
      if (typeof userId !== 'string' || !userId) {
        return json({ error: 'Missing "userId" field' }, 400, origin)
      }
      if (typeof documentId !== 'string' || !documentId) {
        return json({ error: 'Missing "documentId" field' }, 400, origin)
      }

      if (file.size > MAX_FILE_SIZE) {
        return json({ error: 'File exceeds the 10 MB size limit' }, 413, origin)
      }

      const fileBuffer = await file.arrayBuffer()

      if (!isPdf(fileBuffer)) {
        return json({ error: 'File is not a PDF' }, 400, origin)
      }

      let parsed: { text: string; numpages: number }
      try {
        parsed = await pdfParse(Buffer.from(fileBuffer))
      } catch {
        return json({ error: 'Failed to parse PDF content' }, 422, origin)
      }

      const documentKey = `${userId}/${documentId}.pdf`
      await env.DOCUMENTS.put(documentKey, fileBuffer, {
        httpMetadata: { contentType: 'application/pdf' },
      })

      return json(
        {
          text: parsed.text,
          pageCount: parsed.numpages,
          documentKey,
        },
        200,
        origin,
      )
    }

    // GET /?key=<documentKey> — download a stored PDF
    if (request.method === 'GET') {
      const key = searchParams.get('key')
      if (!key) {
        return json({ error: 'Missing "key" query parameter' }, 400, origin)
      }

      const obj = await env.DOCUMENTS.get(key)
      if (!obj) {
        return json({ error: 'Document not found' }, 404, origin)
      }

      const filename = key.split('/').pop() ?? 'document.pdf'
      return new Response(obj.body, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          ...corsHeaders(origin),
        },
      })
    }

    // DELETE /?key=<documentKey> — remove a stored PDF
    if (request.method === 'DELETE') {
      const key = searchParams.get('key')
      if (!key) {
        return json({ error: 'Missing "key" query parameter' }, 400, origin)
      }

      await env.DOCUMENTS.delete(key)
      return json({ deleted: true, key }, 200, origin)
    }

    return json({ error: 'Method not allowed' }, 405, origin)
  },
} satisfies ExportedHandler<Env>
