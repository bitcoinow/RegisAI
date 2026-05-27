import Anthropic from '@anthropic-ai/sdk'
import { REGULATORY_LIBRARY } from '@/lib/regulatory-library'
import { EU_REGULATORY_LIBRARY } from '@/lib/eu-regulatory-library'
import { UK_REGULATORY_LIBRARY } from '@/lib/uk-regulatory-library'
import type { AuditResult, Jurisdiction } from '@/types'

// All Claude API calls live here. Do not call the Anthropic SDK from API routes or components.

const MODEL = 'claude-sonnet-4-20250514'
const MAX_DOCUMENT_CHARS = 12_000

let _client: Anthropic | null = null

function getClient(): Anthropic {
  if (_client) return _client
  const apiKey = process.env['ANTHROPIC_API_KEY']
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
  _client = new Anthropic({ apiKey })
  return _client
}

const _systemPrompts = new Map<Jurisdiction, string>()

function buildSystemPrompt(jurisdiction: Jurisdiction): string {
  if (_systemPrompts.has(jurisdiction)) return _systemPrompts.get(jurisdiction)!

  const library =
    jurisdiction === 'EU' ? EU_REGULATORY_LIBRARY
    : jurisdiction === 'UK' ? UK_REGULATORY_LIBRARY
    : REGULATORY_LIBRARY

  const requirementsContext = library.map(
    (req) =>
      `${req.id} | ${req.rule} | ${req.framework} | ${req.requirement}\n${req.description}`
  ).join('\n\n')

  const jurisdictionExpertise =
    jurisdiction === 'EU'
      ? 'MiFID II, GDPR, AMLD6, DORA, SFDR, and MAR requirements for EU financial services firms'
      : jurisdiction === 'UK'
      ? 'FCA Rules (SYSC, COBS, SM&CR), UK AML (MLR 2017), UK GDPR, FCA Consumer Duty, and FCA Operational Resilience requirements for UK financial services firms'
      : 'FINRA, SEC, AML/BSA, Regulation Best Interest, and business continuity requirements for mid-market firms'

  const prompt = `You are a senior compliance analyst with 15 years of experience in financial services regulation. You specialise in ${jurisdictionExpertise}.

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
  _systemPrompts.set(jurisdiction, prompt)
  return prompt
}

export async function runGapAnalysis(
  documentText: string,
  firmName?: string,
  jurisdiction: Jurisdiction = 'US'
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
        text: buildSystemPrompt(jurisdiction),
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

  try {
    const result = JSON.parse(rawText) as AuditResult
    return result
  } catch (err) {
    console.error('Failed to parse Claude response as JSON:', err)
    console.error('Raw Claude response:', rawText)
    throw new Error('Claude returned invalid JSON. See server logs for raw response.')
  }
}
