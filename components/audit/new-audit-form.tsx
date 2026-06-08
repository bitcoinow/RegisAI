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
  US: ['FINRA', 'SEC', 'AML', 'RegBI', 'BCP', 'SOX', 'CCPA', 'NIST'],
  EU: ['MiFID II', 'GDPR', 'AMLD', 'DORA', 'SFDR', 'MAR', 'AI Act', 'NIS2', 'PSD2', 'Whistleblowing'],
  UK: ['SM&CR', 'FCA Conduct', 'FCA Systems', 'UK AML', 'UK GDPR', 'FCA OpRes', 'Bribery Act', 'Financial Crime', 'Pensions'],
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

interface NewAuditFormProps {
  /** Locked jurisdiction from subdomain. No tabs — single region only. */
  jurisdiction?: Jurisdiction
}

export function NewAuditForm({ jurisdiction: lockedJurisdiction }: NewAuditFormProps) {
  const jurisdiction = lockedJurisdiction ?? 'UK'
  const [framework, setFramework] = useState<RegulatoryFramework | ''>(DEFAULT_FRAMEWORK[jurisdiction])
  const selected = JURISDICTIONS.find((j) => j.id === jurisdiction)!

  // Requirement count for the active scope
  const scopeCount = getScopedRequirements(jurisdiction, framework || null).length

  return (
    <>
      {/* Jurisdiction badge (locked to subdomain) */}
      <div className="flex items-center gap-3 mb-4 border border-rule px-4 py-3 bg-bg-2">
        <span className="font-mono text-xs tracking-widest uppercase font-bold text-green">
          {selected.id}
        </span>
        <div>
          <span className="text-sm font-medium text-ink">{selected.label}</span>
          <span className="block text-xs text-ink-3">{selected.frameworks}</span>
        </div>
        <span className="ml-auto font-mono text-xs text-ink-3">{selected.count} requirements</span>
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
