'use client'

import { useState } from 'react'
import { UploadForm } from '@/components/audit/upload-form'
import type { Jurisdiction } from '@/types'

const JURISDICTIONS: { id: Jurisdiction; label: string; count: number; frameworks: string }[] = [
  { id: 'US', label: 'United States', count: 32, frameworks: 'FINRA · SEC · AML/BSA · Reg BI · BCP' },
  { id: 'EU', label: 'European Union', count: 23, frameworks: 'MiFID II · GDPR · AMLD6 · DORA · SFDR · MAR' },
  { id: 'UK', label: 'United Kingdom', count: 19, frameworks: 'FCA Rules · UK AML · UK GDPR · SM&CR · OpRes' },
]

// Per-jurisdiction framework bullets for the "What we analyse" grid
const FRAMEWORK_ITEMS: Record<Jurisdiction, string[]> = {
  US: [
    'FINRA Rules 3110–3130',
    'SEC Regulation S-P',
    'AML / BSA (FinCEN)',
    'Regulation Best Interest',
    'Customer Identification (CIP)',
    'Customer Due Diligence (CDD)',
    'OFAC Sanctions',
    'Business Continuity',
  ],
  EU: [
    'MiFID II — Suitability & Best Execution',
    'MiFID II — Product Governance',
    'GDPR — Data Processing & Security',
    'GDPR — Breach Notification',
    'AMLD6 — CDD & EDD',
    'AMLD6 — Suspicious Transaction Reporting',
    'DORA — ICT Risk & Incident Reporting',
    'SFDR — ESG Disclosure',
  ],
  UK: [
    'FCA SM&CR — Senior Manager Responsibilities',
    'FCA Consumer Duty — Four Outcomes',
    'FCA COBS — Suitability & Best Interests',
    'FCA SYSC — Compliance & Risk Functions',
    'MLR 2017 — AML Policies & CDD',
    'MLR 2017 — EDD for PEPs',
    'UK GDPR — Processing & Security',
    'FCA PS21/3 — Operational Resilience',
  ],
}

export function NewAuditForm() {
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('US')
  const selected = JURISDICTIONS.find((j) => j.id === jurisdiction)!

  return (
    <>
      {/* Jurisdiction tabs */}
      <div className="flex gap-0 mb-6 border border-rule">
        {JURISDICTIONS.map((j) => (
          <button
            key={j.id}
            type="button"
            onClick={() => setJurisdiction(j.id)}
            className={[
              'flex-1 py-3 px-4 text-left border-r border-rule last:border-r-0 transition-colors',
              jurisdiction === j.id
                ? 'bg-green text-white'
                : 'bg-bg-2 text-ink-2 hover:bg-bg',
            ].join(' ')}
          >
            <span className="block text-xs font-mono tracking-widest uppercase mb-0.5">
              {j.id}
            </span>
            <span className="block text-sm">{j.label}</span>
          </button>
        ))}
      </div>

      {/* Selected jurisdiction description */}
      <p className="text-ink-3 text-sm mb-6">
        Analysing against{' '}
        <span className="text-ink font-medium">{selected.count} requirements</span>
        {' — '}
        <span className="font-mono text-xs">{selected.frameworks}</span>
      </p>

      <UploadForm jurisdiction={jurisdiction} />

      {/* What we analyse — updates per jurisdiction */}
      <div className="mt-6 pt-6 border-t border-rule">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-3">
          What we analyse
        </p>
        <div className="grid grid-cols-2 gap-2">
          {FRAMEWORK_ITEMS[jurisdiction].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="text-green text-xs">·</span>
              <span className="text-ink-3 text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
