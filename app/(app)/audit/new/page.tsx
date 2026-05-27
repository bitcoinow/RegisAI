import Link from 'next/link'
import { NewAuditForm } from '@/components/audit/new-audit-form'

export default function NewAuditPage() {
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
          Select your regulatory jurisdiction, then upload your compliance manual as a PDF.
          Regis will analyse it and return a structured findings report with risk-rated gaps,
          rule citations, and remediation recommendations.
        </p>

        <NewAuditForm />
      </div>
    </div>
  )
}
