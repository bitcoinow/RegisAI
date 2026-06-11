import type { ScenarioCategory, ScenarioResult, ScenarioRiskRating } from '@/types'

// Fixed category list for scenario analysis. The model is instructed to use
// these exact values; anything else is dropped during sanitization.
export const SCENARIO_CATEGORIES: readonly ScenarioCategory[] = [
  'Bribery & Corruption',
  'Gifts & Hospitality',
  'Conflict of Interest',
  'Procurement Fairness',
  'Sanctions',
  'Data Protection',
  'HR & Workplace Conduct',
  'Reputational Risk',
  'Escalation Requirement',
] as const

export const SCENARIO_MAX_CHARS = 5000

const RATINGS: readonly ScenarioRiskRating[] = ['Low', 'Medium', 'High', 'Critical']

function asStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.trim())
    .slice(0, max)
}

// Defensive clean-up of model output. An unrecognised rating clamps to High —
// failing safe upward so a malformed response never under-reports risk.
export function sanitizeScenarioResult(raw: unknown): ScenarioResult {
  const obj = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  const rating: ScenarioRiskRating = RATINGS.includes(obj.risk_rating as ScenarioRiskRating)
    ? (obj.risk_rating as ScenarioRiskRating)
    : 'High'

  const categories = asStringArray(obj.risk_categories, SCENARIO_CATEGORIES.length).filter(
    (c): c is ScenarioCategory => SCENARIO_CATEGORIES.includes(c as ScenarioCategory)
  )

  const keyQuestions = asStringArray(obj.key_questions, 6)

  return {
    risk_rating: rating,
    risk_categories: categories,
    explanation:
      typeof obj.explanation === 'string' && obj.explanation.trim().length > 0
        ? obj.explanation.trim()
        : 'The analysis could not produce a full explanation. Treat this scenario as requiring human review.',
    next_steps: asStringArray(obj.next_steps, 8),
    escalation_note: typeof obj.escalation_note === 'string' ? obj.escalation_note.trim() : '',
    ...(keyQuestions.length > 0 ? { key_questions: keyQuestions } : {}),
  }
}
