import Anthropic from '@anthropic-ai/sdk'
import { getScopedRequirements } from '@/lib/coverage'
import { sanitizeScenarioResult, SCENARIO_CATEGORIES, SCENARIO_MAX_CHARS } from '@/lib/scenario'
import type { AuditResult, Finding, Jurisdiction, RegulatoryFramework, ScenarioResult } from '@/types'

// All Claude API calls live here. Do not call the Anthropic SDK from API routes or components.

const MODEL = 'claude-sonnet-4-6'
const MAX_DOCUMENT_CHARS = 12_000

let _client: Anthropic | null = null

function getClient(): Anthropic {
  if (_client) return _client
  const apiKey = process.env['ANTHROPIC_API_KEY']
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
  _client = new Anthropic({ apiKey })
  return _client
}

function jurisdictionExpertise(jurisdiction: Jurisdiction): string {
  return jurisdiction === 'EU'
    ? 'MiFID II, GDPR, AMLD6, DORA, SFDR, and MAR requirements for EU financial services firms'
    : jurisdiction === 'UK'
    ? 'UK workplace compliance (Bribery Act 2010, gifts & hospitality, conflicts of interest, sanctions screening, UK GDPR) alongside FCA Rules (SYSC, COBS, SM&CR), UK AML (MLR 2017), FCA Consumer Duty, and FCA Operational Resilience requirements'
    : 'FINRA, SEC, AML/BSA, Regulation Best Interest, and business continuity requirements for mid-market firms'
}

const _systemPrompts = new Map<string, string>()

function buildSystemPrompt(
  jurisdiction: Jurisdiction,
  framework?: RegulatoryFramework | null
): string {
  const cacheKey = `${jurisdiction}:${framework ?? 'ALL'}`
  if (_systemPrompts.has(cacheKey)) return _systemPrompts.get(cacheKey)!

  const library = getScopedRequirements(jurisdiction, framework)

  const requirementsContext = library.map(
    (req) =>
      `${req.id} | ${req.rule} | ${req.framework} | ${req.requirement}\n${req.description}`
  ).join('\n\n')

  const prompt = `You are a senior compliance analyst with 15 years of experience in financial services regulation. You specialise in ${jurisdictionExpertise(jurisdiction)}.

You are performing a regulatory gap analysis on a compliance manual submitted by a financial services firm. You will evaluate the document against the following ${library.length} regulatory requirements:

--- REGULATORY LIBRARY START ---
${requirementsContext}
--- REGULATORY LIBRARY END ---

INSTRUCTIONS:
1. Read the compliance manual carefully.
2. For each requirement where you detect a gap (missing, vague, or non-compliant language), create a finding.
3. Only create findings for actual gaps — if a requirement is clearly met, include it in strengths.
4. Every finding MUST include the specific rule citation.
5. Risk levels must use: "High", "Medium", or "Low" (exact strings).
6. You MUST return ONLY valid JSON — no prose before or after the JSON block.

OUTPUT FORMAT (strict JSON, no markdown fences):
{
  "firm_name": "string — infer from document or use 'Unknown Firm'",
  "exec_summary": "string — 2-3 sentence executive summary of overall compliance posture",
  "gaps": [
    {
      "id": "REQ-XXX",
      "rule": "exact rule citation from library",
      "requirement": "short requirement name",
      "policy_says": "verbatim or close paraphrase of what the document actually says (or 'Not addressed')",
      "gap": "specific description of what is missing or non-compliant",
      "risk": "High | Medium | Low",
      "recommendation": "specific, actionable remediation step"
    }
  ],
  "strengths": ["array of short strings describing areas of clear compliance"],
  "priority_actions": ["ordered array of the top 3-5 most urgent remediation actions"]
}`
  _systemPrompts.set(cacheKey, prompt)
  return prompt
}

export async function runGapAnalysis(
  documentText: string,
  firmName?: string,
  jurisdiction: Jurisdiction = 'US',
  framework?: RegulatoryFramework | null
): Promise<AuditResult> {
  const client = getClient()

  const truncated =
    documentText.length > MAX_DOCUMENT_CHARS
      ? documentText.slice(0, MAX_DOCUMENT_CHARS) +
        '\n\n[Document truncated at 12,000 characters]'
      : documentText

  const userMessage = firmName
    ? `Firm: ${firmName}\n\n--- COMPLIANCE MANUAL START ---\n${truncated}\n--- COMPLIANCE MANUAL END ---`
    : `--- COMPLIANCE MANUAL START ---\n${truncated}\n--- COMPLIANCE MANUAL END ---`

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8096,
    system: [
      {
        type: 'text',
        text: buildSystemPrompt(jurisdiction, framework),
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  })

  const rawContent = message.content[0]
  if (rawContent?.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  const rawText = rawContent.text.trim()
  const cleanText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    const result = JSON.parse(cleanText) as AuditResult
    return result
  } catch (err) {
    console.error('Failed to parse Claude response as JSON:', err)
    console.error('Raw Claude response:', rawText)
    throw new Error('Claude returned invalid JSON. See server logs for raw response.')
  }
}

// ── Scenario risk analysis ────────────────────────────────────────────────────

const SCENARIO_SYSTEM_PROMPT = `You are a senior UK compliance analyst. You assess real-world workplace scenarios for compliance risk under UK law and standard corporate policy expectations. You are familiar with the Bribery Act 2010 (including section 7 adequate procedures and the gifts and hospitality implications), UK GDPR and the Data Protection Act 2018, UK sanctions regimes (OFSI), and common UK workplace policy frameworks: conflicts of interest, procurement and pitch-process fairness, and whistleblowing/escalation.

You provide structured risk information for review by qualified professionals. You do NOT provide legal advice and you do NOT make final compliance decisions. Never state that conduct is or is not lawful; describe the risk and what should happen next.

ASSESSMENT RULES:
1. "risk_rating" must be exactly one of: "Low", "Medium", "High", "Critical".
2. "risk_categories" must ONLY use values from this fixed list: ${SCENARIO_CATEGORIES.map((c) => `"${c}"`).join(', ')}. Include every category that genuinely applies; omit ones that do not.
3. Anything resembling a request for a personal benefit in exchange for business (a quid pro quo) is at minimum High and normally Critical. Hospitality offered during a live tender, pitch, or procurement decision raises the rating.
4. "explanation" must be plain English (2-4 short paragraphs): what the risk is, why it matters, and what makes it better or worse. No statutory citations presented as advice.
5. "next_steps" must be concrete and ordered (e.g. do not commit to anything with the counterparty, preserve records and correspondence, declare to line manager or compliance, check the gifts and hospitality policy and register).
6. "escalation_note" must be a short, neutral, factual note the employee could send to compliance or legal: what happened, when, who was involved, what was offered or requested, and what has been done so far. No admissions, no legal conclusions.
7. "key_questions" (optional, max 6) lists facts a human reviewer should establish before deciding.
8. For genuinely low-risk scenarios, say so plainly and avoid exaggerated language — but still point to the relevant policy check (e.g. the gifts and hospitality policy).

You MUST return ONLY valid JSON, no markdown fences, in this exact shape:
{
  "risk_rating": "Low | Medium | High | Critical",
  "risk_categories": ["..."],
  "explanation": "string",
  "next_steps": ["..."],
  "escalation_note": "string",
  "key_questions": ["..."]
}`

// Analyses a free-text workplace scenario and returns a structured, sanitised
// risk assessment. Stateless — persistence is a later phase.
export async function runScenarioAnalysis(scenarioText: string): Promise<ScenarioResult> {
  const client = getClient()

  const truncated =
    scenarioText.length > SCENARIO_MAX_CHARS ? scenarioText.slice(0, SCENARIO_MAX_CHARS) : scenarioText

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: SCENARIO_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `--- SCENARIO START ---\n${truncated}\n--- SCENARIO END ---\n\nAssess this scenario.`,
      },
    ],
  })

  const rawContent = message.content[0]
  if (rawContent?.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  const rawText = rawContent.text.trim()
  const cleanText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    return sanitizeScenarioResult(JSON.parse(cleanText))
  } catch (err) {
    console.error('Failed to parse scenario response as JSON:', err)
    console.error('Raw Claude response:', rawText)
    throw new Error('Claude returned invalid JSON for scenario analysis. See server logs.')
  }
}

// Fields from a finding needed to draft remediation policy language.
type DraftableFinding = Pick<
  Finding,
  'rule' | 'requirement' | 'policy_says' | 'gap' | 'recommendation' | 'risk'
>

// Generates ready-to-paste compliance-manual language that closes a single gap.
// Returns formal policy prose (no markdown), written in the voice of a firm's manual.
export async function draftPolicyLanguage(
  finding: DraftableFinding,
  jurisdiction: Jurisdiction = 'US',
  firmName?: string
): Promise<string> {
  const client = getClient()

  const firm = firmName?.trim() || 'the Firm'

  const system = `You are a senior compliance counsel drafting language for a financial services firm's written compliance manual. You specialise in ${jurisdictionExpertise(jurisdiction)}.

You will be given a single gap identified in a regulatory gap analysis. Your job is to draft the exact policy language the firm should insert into its compliance manual to close that gap.

REQUIREMENTS FOR THE DRAFTED LANGUAGE:
1. Write in the formal, prescriptive voice of a compliance manual (e.g. "${firm} shall...", "Supervisory personnel must...").
2. Be specific and operational — name responsible roles, frequencies, records to retain, and review cadences where appropriate.
3. Cite the governing rule by reference where natural.
4. Make it directly usable: a compliance officer should be able to paste it into the manual with only the firm name and minor specifics to confirm.
5. Aim for 120–300 words. Use short numbered or lettered clauses where it improves clarity. Do NOT use markdown formatting, headings with #, or code fences.
6. Do not add commentary, caveats, or explanation outside the policy text itself.

You MUST return ONLY valid JSON in this exact shape, with no prose before or after:
{ "policy_language": "the drafted manual language as a single string, using \\n for line breaks" }`

  const userMessage = `Firm: ${firm}
Jurisdiction: ${jurisdiction}

GAP TO REMEDIATE:
- Rule: ${finding.rule}
- Requirement: ${finding.requirement}
- Risk level: ${finding.risk}
- What the current policy says: ${finding.policy_says}
- The gap: ${finding.gap}
- Suggested remediation direction: ${finding.recommendation}

Draft the compliance-manual language that closes this gap.`

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [{ type: 'text', text: system }],
    messages: [{ role: 'user', content: userMessage }],
  })

  const rawContent = message.content[0]
  if (rawContent?.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  const rawText = rawContent.text.trim()
  const cleanText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    const parsed = JSON.parse(cleanText) as { policy_language?: unknown }
    if (typeof parsed.policy_language !== 'string' || !parsed.policy_language.trim()) {
      throw new Error('Missing policy_language in response')
    }
    return parsed.policy_language.trim()
  } catch (err) {
    console.error('Failed to parse policy draft response as JSON:', err)
    console.error('Raw Claude response:', rawText)
    throw new Error('Claude returned invalid JSON for policy draft. See server logs.')
  }
}
