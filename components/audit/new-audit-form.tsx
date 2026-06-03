'use client'

import { useState } from 'react'
import { UploadForm } from '@/components/audit/upload-form'
import { getScopedRequirements } from '@/lib/coverage'
import type { Jurisdiction, RegulatoryFramework } from '@/types'

const JURISDICTIONS: { id: Jurisdiction; label: string; count: number; frameworks: string }[] = [
  { id: 'US', label: 'United States', count: 32, frameworks: 'FINRA · SEC · AML/BSA · Reg BI · BCP' },
  { id: 'EU', label: 'European Union', count: 34, frameworks: 'MiFID II · GDPR · AMLD6 · DORA · SFDR · MAR' },
  { id: 'UK', label: 'United Kingdom', count: 19, frameworks: 'FCA Rules · UK AML · UK GDPR · SM&CR · OpRes' },
]

// Single-framework options per jurisdiction. The empty value scopes the analysis
// to the entire jurisdiction library.
const FRAMEWORKS_BY_JURISDICTION: Record<Jurisdiction, RegulatoryFramework[]> = {
  US: ['FINRA', 'SEC', 'AML', 'RegBI', 'BCP'],
  EU: ['MiFID II', 'GDPR', 'AMLD', 'DORA', 'SFDR', 'MAR'],
  UK: ['SM&CR', 'FCA Conduct', 'FCA Systems', 'UK AML', 'UK GDPR', 'FCA OpRes'],
}

// Default single-framework focus per jurisdiction (empty = whole jurisdiction).
// EU defaults to GDPR — the flagship single-framework proof point.
const DEFAULT_FRAMEWORK: Record<Jurisdiction, RegulatoryFramework | ''> = {
  US: '',
  EU: 'GDPR',
  UK: '',
}

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
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('EU')
  const [framework, setFramework] = useState<RegulatoryFramework | ''>(DEFAULT_FRAMEWORK['EU'])
  const selected = JURISDICTIONS.find((j) => j.id === jurisdiction)!

  function selectJurisdiction(id: Jurisdiction) {
    setJurisdiction(id)
    setFramework(DEFAULT_FRAMEWORK[id])
  }

  // Requirement count for the active scope (single framework or whole jurisdiction).
  const scopeCount = getScopedRequirements(jurisdiction, framework || null).length

  return (
    <>
      {/* Jurisdiction tabs */}
      <div className="flex gap-0 mb-4 border border-rule">
        {JURISDICTIONS.map((j) => (
          <button
            key={j.id}
            type="button"
            onClick={() => selectJurisdiction(j.id)}
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

      {/* Framework focus selector */}
      <div className="mb-4">
        <label
          htmlFor="framework"
          className="block font-mono text-xs tracking-widest uppercase text-ink-3 mb-2"
        >
          Framework focus
        </label>
        <select
          id="framework"
          value={framework}
          onChange={(e) => setFramework(e.target.value as RegulatoryFramework | '')}
          className="w-full border border-rule bg-bg-2 text-ink text-sm py-2.5 px-3 focus:outline-none focus:border-green"
        >
          <option value="">All frameworks ({selected.label})</option>
          {FRAMEWORKS_BY_JURISDICTION[jurisdiction].map((fw) => (
            <option key={fw} value={fw}>
              {fw} — {getScopedRequirements(jurisdiction, fw).length} requirements
            </option>
          ))}
        </select>
      </div>

      {/* Active scope description */}
      <p className="text-ink-3 text-sm mb-6">
        Analysing against{' '}
        <span className="text-ink font-medium">{scopeCount} requirements</span>
        {' — '}
        <span className="font-mono text-xs">{framework || selected.frameworks}</span>
      </p>

      <UploadForm jurisdiction={jurisdiction} framework={framework || null} />

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
