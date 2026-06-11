'use client'

import { useState } from 'react'
import { UploadForm } from '@/components/audit/upload-form'
import { PasteTextForm } from '@/components/audit/paste-text-form'
import { getScopedRequirements } from '@/lib/coverage'
import type { Jurisdiction, RegulatoryFramework } from '@/types'

const JURISDICTIONS: { id: Jurisdiction; label: string; frameworks: string }[] = [
  { id: 'UK', label: 'United Kingdom', frameworks: 'UK Workplace · FCA Rules · UK AML · UK GDPR · SM&CR' },
  { id: 'EU', label: 'European Union', frameworks: 'MiFID II · GDPR · AMLD6 · DORA · SFDR · MAR' },
  { id: 'US', label: 'United States', frameworks: 'FINRA · SEC · AML/BSA · Reg BI · BCP' },
]

// Single-framework options per jurisdiction. The empty value scopes the analysis
// to the entire jurisdiction library.
const FRAMEWORKS_BY_JURISDICTION: Record<Jurisdiction, RegulatoryFramework[]> = {
  US: ['FINRA', 'SEC', 'AML', 'RegBI', 'BCP'],
  EU: ['MiFID II', 'GDPR', 'AMLD', 'DORA', 'SFDR', 'MAR'],
  UK: ['UK Workplace', 'SM&CR', 'FCA Conduct', 'FCA Systems', 'UK AML', 'UK GDPR', 'FCA OpRes'],
}

// Default single-framework focus per jurisdiction (empty = whole jurisdiction).
// UK defaults to the workplace-compliance library — the MVP's core scope.
const DEFAULT_FRAMEWORK: Record<Jurisdiction, RegulatoryFramework | ''> = {
  US: '',
  EU: 'GDPR',
  UK: 'UK Workplace',
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
    'Gifts & Hospitality — Thresholds & Register',
    'Anti-Bribery — Bribery Act 2010 Adequate Procedures',
    'Conflicts of Interest — Declarations',
    'Procurement & Pitch-Process Fairness',
    'Sanctions & Restricted-Party Screening',
    'UK GDPR — Data Protection Basics',
    'Escalation & Incident Reporting',
    'Policy Ownership, Training & Audit Trail',
  ],
}

export function NewAuditForm({ isDevUser }: { isDevUser: boolean }) {
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>(isDevUser ? 'EU' : 'UK')
  const [framework, setFramework] = useState<RegulatoryFramework | ''>(
    DEFAULT_FRAMEWORK[isDevUser ? 'EU' : 'UK']
  )
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload')
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
        {JURISDICTIONS.map((j) => {
          const isLocked = !isDevUser && j.id !== 'UK'
          const isActive = jurisdiction === j.id
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => !isLocked && selectJurisdiction(j.id)}
              disabled={isLocked}
              className={[
                'flex-1 py-3 px-4 text-left border-r border-rule last:border-r-0 transition-colors',
                isActive && !isLocked
                  ? 'bg-green text-white'
                  : isLocked
                    ? 'bg-bg-2 text-ink-3 opacity-50 cursor-not-allowed'
                    : 'bg-bg-2 text-ink-2 hover:bg-bg',
              ].join(' ')}
            >
              <span className="block text-xs font-mono tracking-widest uppercase mb-0.5">
                {j.id}
              </span>
              <span className="block text-sm">{j.label}</span>
              {isLocked && (
                <span className="block text-xs font-mono text-ink-3 mt-0.5">Coming soon</span>
              )}
            </button>
          )
        })}
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

      {/* Input mode toggle: PDF upload or pasted text */}
      <div className="flex border border-rule mb-4" role="tablist" aria-label="Policy input method">
        {(
          [
            { id: 'upload', label: 'Upload PDF' },
            { id: 'paste', label: 'Paste text' },
          ] as const
        ).map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={inputMode === mode.id}
            onClick={() => setInputMode(mode.id)}
            className={[
              'flex-1 py-2.5 px-4 text-sm border-r border-rule last:border-r-0 transition-colors',
              inputMode === mode.id ? 'bg-green text-white' : 'bg-bg-2 text-ink-2 hover:bg-bg',
            ].join(' ')}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {inputMode === 'upload' ? (
        <UploadForm jurisdiction={jurisdiction} framework={framework || null} />
      ) : (
        <PasteTextForm jurisdiction={jurisdiction} framework={framework || null} />
      )}

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
