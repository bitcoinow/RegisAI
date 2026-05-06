import Link from 'next/link'
import { UploadForm } from '@/components/audit/upload-form'

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
          Upload your compliance manual as a PDF. Regis will analyse it against 32 FINRA, SEC,
          AML/BSA, and Regulation Best Interest requirements and return a structured findings
          report.
        </p>

        <UploadForm />

        <div className="mt-6 pt-6 border-t border-rule">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-3">
            What we analyse
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'FINRA Rules 3110–3130',
              'SEC Regulation S-P',
              'AML / BSA (FinCEN)',
              'Regulation Best Interest',
              'Customer Identification (CIP)',
              'Customer Due Diligence (CDD)',
              'OFAC Sanctions',
              'Business Continuity',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-green text-xs">·</span>
                <span className="text-ink-3 text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
