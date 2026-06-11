import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DocumentActions } from '@/components/documents/document-actions'
import type { DocumentStatus } from '@/types'

interface DocumentRow {
  id: string
  file_name: string
  file_path: string | null
  page_count: number | null
  status: DocumentStatus
  created_at: string
}

interface AuditRef {
  id: string
  document_id: string
  total_gaps: number
  created_at: string
}

const STATUS_LABELS: Record<DocumentStatus, string> = {
  uploaded: 'Uploaded',
  analysing: 'Analysing',
  complete: 'Analyzed',
  error: 'Error',
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const colorMap: Record<DocumentStatus, string> = {
    uploaded: 'var(--ink-3)',
    analysing: 'var(--blue)',
    complete: 'var(--green)',
    error: 'var(--red)',
  }
  const color = colorMap[status] ?? 'var(--ink-3)'
  return (
    <span
      className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 border"
      style={{ color, borderColor: color }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data: documents } = await supabase
    .from('documents')
    .select('id, file_name, file_path, page_count, status, created_at')
    .order('created_at', { ascending: false })

  const rows = (documents ?? []) as DocumentRow[]

  // Group the audits each document produced (most recent first).
  const auditsByDocument = new Map<string, AuditRef[]>()
  if (rows.length > 0) {
    const { data: audits } = await supabase
      .from('audits')
      .select('id, document_id, total_gaps, created_at')
      .in(
        'document_id',
        rows.map((r) => r.id)
      )
      .order('created_at', { ascending: false })

    for (const audit of (audits ?? []) as AuditRef[]) {
      const list = auditsByDocument.get(audit.document_id) ?? []
      list.push(audit)
      auditsByDocument.set(audit.document_id, list)
    }
  }

  return (
    <div className="max-w-content mx-auto px-6 py-10">

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">Documents</h1>
          <p className="text-ink-3 text-sm mt-1">
            Every compliance document you&rsquo;ve uploaded, with the audits it produced.
          </p>
        </div>
        <Link
          href="/audit/new"
          className="bg-green text-white text-sm px-5 py-2.5 hover:bg-green-2 transition-colors"
        >
          New Audit
        </Link>
      </div>

      {/* ── Documents table ────────────────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="border border-rule bg-bg-2 p-16 text-center">
          <p className="font-serif text-2xl text-ink mb-2">No documents yet</p>
          <p className="text-ink-3 text-sm mb-6">
            Upload a compliance manual to run your first gap analysis.
          </p>
          <Link
            href="/audit/new"
            className="inline-block bg-green text-white text-sm px-6 py-2.5 hover:bg-green-2 transition-colors"
          >
            Upload a Document
          </Link>
        </div>
      ) : (
        <div className="border border-rule overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-bg-2">
                <th className="text-left px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  File
                </th>
                <th className="text-left px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  Uploaded
                </th>
                <th className="text-left px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  Status
                </th>
                <th className="text-left px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  Audit
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((doc, i) => {
                const docAudits = auditsByDocument.get(doc.id) ?? []
                const latest = docAudits[0]
                return (
                  <tr
                    key={doc.id}
                    className={`border-b border-rule last:border-b-0 hover:bg-bg-2 transition-colors ${
                      i % 2 === 0 ? 'bg-bg' : 'bg-bg-2'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <span className="text-ink font-medium break-all">{doc.file_name}</span>
                      {doc.page_count != null && (
                        <span className="text-ink-3 font-mono text-xs ml-2">
                          {doc.page_count} {doc.page_count === 1 ? 'page' : 'pages'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-ink-3 font-mono text-xs">
                      {new Date(doc.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-5 py-4">
                      {latest ? (
                        <Link
                          href={`/audit/${latest.id}`}
                          className="text-green text-xs font-mono tracking-wide hover:underline"
                        >
                          View Report →
                          {docAudits.length > 1 && (
                            <span className="text-ink-3 ml-1">
                              (+{docAudits.length - 1})
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="text-ink-3 text-xs font-mono">Not analyzed</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <DocumentActions
                        documentId={doc.id}
                        auditCount={docAudits.length}
                        hasFile={doc.file_path != null}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
