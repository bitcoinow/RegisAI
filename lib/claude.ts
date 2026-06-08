import OpenAI from 'openai'
import { getScopedRequirements } from '@/lib/coverage'
import type { AuditResult, Finding, Jurisdiction, RegulatoryFramework } from '@/types'

// All AI API calls live here. Do not call the AI SDK from API routes or components.
// Provider priority: CF_AI_PROXY_URL > OPENROUTER_API_KEY > ANTHROPIC_API_KEY

const MODEL = process.env['AI_MODEL'] ?? '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
const MAX_DOCUMENT_CHARS = 12_000

let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (_client) return _client
  // Cloudflare Workers AI proxy (free, no key needed)
  const cfProxy = process.env['CF_AI_PROXY_URL']
  if (cfProxy) {
    _client = new OpenAI({ apiKey: 'cf-proxy', baseURL: cfProxy })
    return _client
  }
  // OpenRouter or Anthropic fallback
  const apiKey = process.env['OPENROUTER_API_KEY'] ?? process.env['ANTHROPIC_API_KEY']
  if (!apiKey) throw new Error('CF_AI_PROXY_URL, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY must be set')
  const baseURL = process.env['OPENROUTER_API_KEY']
    ? 'https://openrouter.ai/api/v1'
    : 'https://api.anthropic.com/v1'
  _client = new OpenAI({ apiKey, baseURL })
  return _client
}

function jurisdictionExpertise(jurisdiction: Jurisdiction): string {
  return jurisdiction === 'EU'
    ? 'MiFID II, GDPR, AMLD6, DORA, SFDR, and MAR requirements for EU financial services firms'
    : jurisdiction === 'UK'
    ? 'FCA Rules (SYSC, COBS, SM&CR), UK AML (MLR 2017), UK GDPR, FCA Consumer Duty, and FCA Operational Resilience requirements for UK financial services firms'
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
  "exec_summary": "string — 2-3 sentence compliance posture overview: key strengths, material gaps, and overall readiness assessment",
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

  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 8096,
    messages: [
      { role: 'system', content: buildSystemPrompt(jurisdiction, framework) },
      { role: 'user', content: userMessage },
    ],
  })

  const rawText = (completion.choices[0]?.message?.content ?? '').trim()
  if (!rawText) {
    throw new Error('Empty response from AI API')
  }
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

  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userMessage },
    ],
  })

  const rawText = (completion.choices[0]?.message?.content ?? '').trim()
  if (!rawText) {
    throw new Error('Empty response from AI API')
  }
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
