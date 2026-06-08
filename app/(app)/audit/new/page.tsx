import Link from 'next/link'
import { NewAuditForm } from '@/components/audit/new-audit-form'
import { UploadForm } from '@/components/audit/upload-form'
import { createClient } from '@/lib/supabase/server'
import type { Jurisdiction, RegulatoryFramework } from '@/types'

interface PageProps {
  searchParams: Promise<{ parent?: string }>
}

export default async function NewAuditPage({ searchParams }: PageProps) {
  const { parent } = await searchParams

  // ── Re-scan mode ──────────────────────────────────────────────────────────
  // When ?parent=<auditId> is present, lock the scope to the parent audit so the
  // re-scan delta is apples-to-apples, and tag the new audit as a re-scan.
  if (parent) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data: parentAudit } = user
      ? await supabase
          .from('audits')
          .select('id, firm_name, jurisdiction, framework, scan_number')
          .eq('id', parent)
          .eq('user_id', user.id)
          .single()
      : { data: null }

    if (parentAudit) {
      const jurisdiction = (parentAudit.jurisdiction as Jurisdiction) ?? 'US'
      const framework = (parentAudit.framework as RegulatoryFramework | null) ?? null
      const scanLabel = `Re-scan #${((parentAudit.scan_number as number) ?? 1) + 1}`
      return (
        <div className="max-w-content mx-auto px-4 md:px-6 py-10">
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
              parentAuditId={parentAudit.id as string}
            />
          </div>
        </div>
      )
    }
    // Fall through to a fresh audit if the parent can't be loaded.
  }

  return (
    <div className="max-w-content mx-auto px-4 md:px-6 py-10">
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

        <NewAuditForm />
      </div>
    </div>
  )
}
