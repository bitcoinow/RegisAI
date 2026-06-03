'use client'

import { useState } from 'react'
import { AuditReport } from '@/components/audit/audit-report'
import type { ComparisonData } from '@/components/audit/audit-comparison'
import { GDPR_DEMO_V1, GDPR_DEMO_V2 } from '@/lib/demo-data'
import { buildCoverageMatrix, computeDelta } from '@/lib/coverage'

export const dynamic = 'force-dynamic'

const coverageV1 = buildCoverageMatrix('EU', 'GDPR', GDPR_DEMO_V1.findings)
const coverageV2 = buildCoverageMatrix('EU', 'GDPR', GDPR_DEMO_V2.findings)

const delta = computeDelta(GDPR_DEMO_V1.findings, GDPR_DEMO_V2.findings)
const comparison: ComparisonData = {
  scanNumber: 2,
  previousDate: GDPR_DEMO_V1.created_at,
  previousScore: GDPR_DEMO_V1.compliance_score ?? null,
  currentScore: GDPR_DEMO_V2.compliance_score ?? null,
  previous: {
    high: GDPR_DEMO_V1.high_risk,
    medium: GDPR_DEMO_V1.medium_risk,
    low: GDPR_DEMO_V1.low_risk,
    total: GDPR_DEMO_V1.total_gaps,
  },
  current: {
    high: GDPR_DEMO_V2.high_risk,
    medium: GDPR_DEMO_V2.medium_risk,
    low: GDPR_DEMO_V2.low_risk,
    total: GDPR_DEMO_V2.total_gaps,
  },
  gaps_closed: delta.gaps_closed,
  gaps_persisting: delta.gaps_persisting,
  gaps_new: delta.gaps_new,
  closed: delta.closed,
  persisting: delta.persisting,
  added: delta.added,
  improvedReqIds: delta.improved.map((f) => f.req_id ?? f.id),
}

export default function GdprDemoPage() {
  const [view, setView] = useState<'initial' | 'rescan'>('initial')

  return (
    <>
      {/* Scan selector */}
      <div className="border-b border-rule bg-bg print:hidden">
        <div className="max-w-content mx-auto px-6 py-3 flex items-center gap-3">
          <span className="font-mono text-xs tracking-widest uppercase text-ink-3 mr-2">
            GDPR demo · Northwind Payments
          </span>
          <div className="flex border border-rule divide-x divide-rule">
            <button
              onClick={() => setView('initial')}
              className={`px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                view === 'initial' ? 'bg-green text-white' : 'text-ink-3 hover:bg-bg-2'
              }`}
            >
              Initial scan · 40%
            </button>
            <button
              onClick={() => setView('rescan')}
              className={`px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                view === 'rescan' ? 'bg-green text-white' : 'text-ink-3 hover:bg-bg-2'
              }`}
            >
              Re-scan · 90% ▲
            </button>
          </div>
        </div>
      </div>

      {view === 'initial' ? (
        <AuditReport
          key={GDPR_DEMO_V1.id}
          audit={GDPR_DEMO_V1}
          isDemo
          coverage={coverageV1}
          frameworkLabel="GDPR"
        />
      ) : (
        <AuditReport
          key={GDPR_DEMO_V2.id}
          audit={GDPR_DEMO_V2}
          isDemo
          coverage={coverageV2}
          comparison={comparison}
          frameworkLabel="GDPR"
        />
      )}
    </>
  )
}
