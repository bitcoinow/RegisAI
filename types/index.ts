export type RiskLevel = 'High' | 'Medium' | 'Low'

export type FirmType = 'Financial Services' | 'Professional Services' | 'Technology' | 'Public Sector' | 'Other'

export type Regulator = 'FCA' | 'ICO' | 'Multiple' | 'None / Other'

export type DocumentStatus = 'uploaded' | 'analysing' | 'complete' | 'error'

export type FindingStatus = 'open' | 'in_progress' | 'resolved' | 'risk_accepted'

export type RegulatoryFramework =
  // US
  | 'FINRA' | 'SEC' | 'AML' | 'RegBI' | 'BCP'
  // EU
  | 'MiFID II' | 'GDPR' | 'AMLD' | 'DORA' | 'SFDR' | 'MAR'
  // UK
  | 'SM&CR' | 'FCA Conduct' | 'FCA Systems' | 'UK AML' | 'UK GDPR' | 'FCA OpRes'
  | 'UK Workplace'

export type Jurisdiction = 'US' | 'EU' | 'UK'

// ── Scenario analysis types ───────────────────────────────────────────────────

export type ScenarioRiskRating = 'Low' | 'Medium' | 'High' | 'Critical'

export type ScenarioCategory =
  | 'Bribery & Corruption'
  | 'Gifts & Hospitality'
  | 'Conflict of Interest'
  | 'Procurement Fairness'
  | 'Sanctions'
  | 'Data Protection'
  | 'HR & Workplace Conduct'
  | 'Reputational Risk'
  | 'Escalation Requirement'

export interface ScenarioResult {
  risk_rating: ScenarioRiskRating
  risk_categories: ScenarioCategory[]
  // Plain-English description of the risk and why it matters (2–4 paragraphs).
  explanation: string
  // Ordered, concrete recommended actions.
  next_steps: string[]
  // Neutral, factual note the user can send to compliance/legal — no admissions
  // or legal conclusions.
  escalation_note: string
  // Facts a human reviewer should establish before deciding.
  key_questions?: string[]
}

// ── Regulatory library ────────────────────────────────────────────────────────

export interface RegulatoryRequirement {
  id: string
  rule: string
  framework: RegulatoryFramework
  requirement: string
  description: string
  defaultRisk: RiskLevel
}

// ── Claude analysis types ─────────────────────────────────────────────────────

export interface Finding {
  id: string
  // Stable requirement id from the library (e.g. 'REQ-EU-007'); used for coverage
  // and re-scan delta matching. On Claude output this equals `id`; on DB rows it is
  // the separate `req_id` column.
  req_id?: string
  rule: string
  requirement: string
  policy_says: string
  gap: string
  risk: RiskLevel
  recommendation: string
  status?: FindingStatus
  drafted_policy?: string | null
  reviewed_by?: string | null
  reviewed_at?: string | null
  review_note?: string | null
  // Display-only label for who reviewed the finding (e.g. email), joined at read time.
  reviewer_label?: string | null
}

export interface AuditResult {
  firm_name: string
  exec_summary: string
  gaps: Finding[]
  strengths: string[]
  priority_actions: string[]
}

// ── Database row types ────────────────────────────────────────────────────────

export interface Profile {
  id: string
  firm_name: string | null
  firm_type: FirmType | null
  aum_range: string | null
  regulator: Regulator | null
  plan: string
  is_dev: boolean
  created_at: string
}

export interface Document {
  id: string
  user_id: string
  file_name: string
  file_path: string | null
  extracted_text: string | null
  page_count: number | null
  status: DocumentStatus
  created_at: string
}

export interface Audit {
  id: string
  document_id: string
  user_id: string
  jurisdiction: Jurisdiction
  framework?: RegulatoryFramework | null
  firm_name: string
  exec_summary: string
  total_gaps: number
  high_risk: number
  medium_risk: number
  low_risk: number
  strengths: string[]
  priority_actions: string[]
  findings: Finding[]
  created_at: string
  // Re-scan / posture fields (see migration 20260603000000)
  parent_audit_id?: string | null
  scan_number?: number
  compliance_score?: number | null
  requirements_total?: number | null
  requirements_met?: number | null
  gaps_closed?: number | null
  gaps_new?: number | null
  gaps_persisting?: number | null
}

// ── API response types ────────────────────────────────────────────────────────

export interface AnalyseResponse {
  audit_id: string
}

export interface DraftPolicyResponse {
  drafted_policy: string
}

export interface DocumentUploadResponse {
  document_id: string
  page_count: number
}

export interface ApiError {
  error: string
  code?: string
}
