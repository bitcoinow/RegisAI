import { REGULATORY_LIBRARY } from '@/lib/regulatory-library'
import { EU_REGULATORY_LIBRARY } from '@/lib/eu-regulatory-library'
import { UK_REGULATORY_LIBRARY } from '@/lib/uk-regulatory-library'
import type {
  Finding,
  Jurisdiction,
  RegulatoryFramework,
  RegulatoryRequirement,
  RiskLevel,
} from '@/types'

// ── Scope resolution ──────────────────────────────────────────────────────────
// Single source of truth for "which requirements are in scope" given a
// jurisdiction and an optional single framework. Reused by the analysis prompt
// (lib/claude.ts), the analyse route (requirements_total), and the coverage matrix.

export function getJurisdictionLibrary(jurisdiction: Jurisdiction): RegulatoryRequirement[] {
  return jurisdiction === 'EU'
    ? EU_REGULATORY_LIBRARY
    : jurisdiction === 'UK'
    ? UK_REGULATORY_LIBRARY
    : REGULATORY_LIBRARY
}

export function getScopedRequirements(
  jurisdiction: Jurisdiction,
  framework?: RegulatoryFramework | null
): RegulatoryRequirement[] {
  const library = getJurisdictionLibrary(jurisdiction)
  return framework ? library.filter((req) => req.framework === framework) : library
}

// ── Coverage matrix ─────────────────────────────────────────────────────────────
// "Complete coverage" proof: every in-scope requirement, tagged Met (no finding)
// or Gap (a finding exists for its requirement id).

export type CoverageStatus = 'met' | 'gap'

export interface CoverageItem {
  id: string
  rule: string
  framework: RegulatoryFramework
  requirement: string
  status: CoverageStatus
  risk?: RiskLevel
}

// A finding's library requirement id can live on `req_id` (DB rows) or `id`
// (Claude output / demo data). Normalise here.
function findingReqId(f: Finding): string {
  return f.req_id ?? f.id
}

export function buildCoverageMatrix(
  jurisdiction: Jurisdiction,
  framework: RegulatoryFramework | null | undefined,
  findings: Finding[]
): CoverageItem[] {
  const scoped = getScopedRequirements(jurisdiction, framework)
  const gapByReqId = new Map<string, Finding>()
  for (const f of findings) gapByReqId.set(findingReqId(f), f)

  return scoped.map((req) => {
    const gap = gapByReqId.get(req.id)
    return {
      id: req.id,
      rule: req.rule,
      framework: req.framework,
      requirement: req.requirement,
      status: gap ? 'gap' : 'met',
      ...(gap ? { risk: gap.risk } : {}),
    }
  })
}

// ── Posture score ───────────────────────────────────────────────────────────────
// Risk-weighted compliance posture, 0–100. High=3, Medium=2, Low=1.
// score = 100 * (1 - weightedGap / (requirementsTotal * 3))
// Rises as gaps close AND as severities drop on re-scan.

export function computeComplianceScore(
  requirementsTotal: number,
  counts: { high: number; medium: number; low: number }
): number {
  if (requirementsTotal <= 0) return 0
  const weightedGap = counts.high * 3 + counts.medium * 2 + counts.low * 1
  const weightedTotal = requirementsTotal * 3
  const score = 100 * (1 - weightedGap / weightedTotal)
  return Math.max(0, Math.round(score))
}

// ── Re-scan delta ─────────────────────────────────────────────────────────────
// Classify the change between a parent audit's findings and a re-scan's findings,
// matching by requirement id.

export type ChangeType = 'closed' | 'persisting' | 'improved' | 'new'

const RISK_WEIGHT: Record<RiskLevel, number> = { High: 3, Medium: 2, Low: 1 }

export interface DeltaResult {
  gaps_closed: number
  gaps_new: number
  gaps_persisting: number
  closed: Finding[] // from the parent — no longer flagged
  persisting: Finding[] // present in both (current finding)
  improved: Finding[] // present in both, risk lowered (current finding)
  added: Finding[] // newly identified in the re-scan
}

export function computeDelta(parentFindings: Finding[], currentFindings: Finding[]): DeltaResult {
  const parentByReq = new Map<string, Finding>()
  for (const f of parentFindings) parentByReq.set(findingReqId(f), f)
  const currentByReq = new Map<string, Finding>()
  for (const f of currentFindings) currentByReq.set(findingReqId(f), f)

  const closed: Finding[] = []
  const persisting: Finding[] = []
  const improved: Finding[] = []
  const added: Finding[] = []

  for (const [reqId, pf] of parentByReq) {
    if (!currentByReq.has(reqId)) closed.push(pf)
  }
  for (const [reqId, cf] of currentByReq) {
    const pf = parentByReq.get(reqId)
    if (!pf) {
      added.push(cf)
    } else if (RISK_WEIGHT[cf.risk] < RISK_WEIGHT[pf.risk]) {
      improved.push(cf)
      persisting.push(cf)
    } else {
      persisting.push(cf)
    }
  }

  return {
    gaps_closed: closed.length,
    gaps_new: added.length,
    gaps_persisting: persisting.length,
    closed,
    persisting,
    improved,
    added,
  }
}
