import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { db } from '@/lib/db'
import { NewAuditForm } from '@/components/audit/new-audit-form'
import { UploadForm } from '@/components/audit/upload-form'
import type { Jurisdiction, RegulatoryFramework } from '@/types'

interface PageProps {
  searchParams: Promise<{ parent?: string }>
}

export default async function NewAuditPage({ searchParams }: PageProps) {
  const { parent } = await searchParams

  const hdrs = await headers()
  const userId = hdrs.get('x-user-id')
  const jurisdiction = (hdrs.get('x-jurisdiction') ?? 'UK') as Jurisdiction
  if (!userId) redirect('/login')

  // ── Re-scan mode ──────────────────────────────────────────────────────────
  // When ?parent=<auditId> is present, lock the scope to the parent audit so the
  // re-scan delta is apples-to-apples, and tag the new audit as a re-scan.
  if (parent) {
    const parentAudit = await db.getAudit(parent, userId)

    if (parentAudit) {
      const jurisdiction = (parentAudit.jurisdiction as Jurisdiction) ?? 'US'
      const framework = (parentAudit.framework as RegulatoryFramework | null) ?? null
      const scanLabel = `Re-scan #${(parentAudit.scan_number ?? 1) + 1}`
      return (
        <div className="max-w-content mx-auto px-6 py-10">
          <div className="mb-8">
            <Link href={`/audit/${parent}`} className="text-ink-3 text-xs font-mono hover:text-ink">
              ← Back to audit
            </Link>
          </div>

          <div className="max-w-lg">
            <p className="font-mono text-xs tracking-widest uppercase text-green mb-2">
              {scanLabel}
            </p>
            <h1 className="font-serif text-3xl text-ink mb-2">Re-scan {parentAudit.firm_name}</h1>
            <p className="text-ink-3 text-sm mb-6">
              Upload the remediated compliance manual. Regis will re-run the same scope
              {' '}(<span className="font-mono text-xs">{framework ?? jurisdiction}</span>) and
              show what changed since the last audit — gaps closed, gaps remaining, and your
              updated compliance posture.
            </p>

            <UploadForm
              jurisdiction={jurisdiction}
              framework={framework}
              parentAuditId={parentAudit.id}
            />
          </div>
        </div>
      )
    }
    // Fall through to a fresh audit if the parent can't be loaded.
  }

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      <div className="mb-8">
        <Link href="/dashboard" className="text-ink-3 text-xs font-mono hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <div className="max-w-lg">
        <h1 className="font-serif text-3xl text-ink mb-2">New Gap Analysis</h1>
        <p className="text-ink-3 text-sm mb-8">
          Select your regulatory jurisdiction and framework focus, then upload your compliance
          manual as a PDF. Regis will analyse it and return a structured findings report with
          risk-rated gaps, rule citations, and remediation recommendations.
        </p>

        <NewAuditForm jurisdiction={jurisdiction} />
      </div>
    </div>
  )
}
