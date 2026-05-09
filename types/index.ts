export type RiskLevel = 'High' | 'Medium' | 'Low'

export type FirmType = 'RIA' | 'Fintech' | 'Insurance' | 'Bank'

export type Regulator = 'FINRA' | 'SEC' | 'State' | 'Multiple'

export type DocumentStatus = 'uploaded' | 'analysing' | 'complete' | 'error'

export type FindingStatus = 'open' | 'in_progress' | 'resolved'

export type RegulatoryFramework = 'FINRA' | 'SEC' | 'AML' | 'RegBI' | 'BCP'

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
  rule: string
  requirement: string
  policy_says: string
  gap: string
  risk: RiskLevel
  recommendation: string
  status?: FindingStatus
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
}

// ── API response types ────────────────────────────────────────────────────────

export interface AnalyseResponse {
  audit_id: string
}

export interface DocumentUploadResponse {
  document_id: string
  page_count: number
}

export interface ApiError {
  error: string
  code?: string
}
