import { AiDisclaimer } from '@/components/ui/ai-disclaimer'
import { ScenarioRiskBadge } from '@/components/scenario/scenario-risk-badge'
import type { ScenarioResult as ScenarioResultData } from '@/types'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2">{children}</p>
  )
}

// Structured rendering of a scenario risk analysis. Shared by the live
// Scenario Analyzer and the static demo. The escalation banner is derived from
// the rating prop — never from model-generated text.
export function ScenarioResultView({ result }: { result: ScenarioResultData }) {
  const requiresEscalation = result.risk_rating === 'High' || result.risk_rating === 'Critical'

  return (
    <div className="space-y-6">
      {/* Rating + categories */}
      <div className="border border-rule bg-bg-2 p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <SectionLabel>Risk rating</SectionLabel>
          <ScenarioRiskBadge rating={result.risk_rating} />
        </div>
        {result.risk_categories.length > 0 && (
          <>
            <SectionLabel>Risk categories</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {result.risk_categories.map((cat) => (
                <span
                  key={cat}
                  className="border border-rule bg-bg px-2 py-0.5 text-xs text-ink-2"
                >
                  {cat}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {requiresEscalation && (
        <div className="border p-4" style={{ borderColor: 'var(--red)' }} role="alert">
          <p className="text-sm font-medium" style={{ color: 'var(--red)' }}>
            This scenario should be escalated before further action is taken.
          </p>
        </div>
      )}

      {/* Explanation */}
      <div>
        <SectionLabel>What this means</SectionLabel>
        <div className="text-ink-2 text-sm leading-relaxed space-y-3">
          {result.explanation.split(/\n{2,}|\n/).filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Next steps */}
      {result.next_steps.length > 0 && (
        <div>
          <SectionLabel>Recommended next steps</SectionLabel>
          <ol className="space-y-2">
            {result.next_steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-2">
                <span className="font-mono text-xs text-green pt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Escalation note */}
      {result.escalation_note && (
        <div>
          <SectionLabel>Suggested escalation note</SectionLabel>
          <div className="border border-rule bg-bg-2 p-4">
            <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-line">
              {result.escalation_note}
            </p>
          </div>
          <p className="text-xs text-ink-3 mt-2">
            Review and edit before sending — this is a draft, not a final record.
          </p>
        </div>
      )}

      {/* Key questions for the reviewer */}
      {result.key_questions && result.key_questions.length > 0 && (
        <div>
          <SectionLabel>Questions a reviewer should ask</SectionLabel>
          <ul className="space-y-1.5">
            {result.key_questions.map((q, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-2">
                <span className="text-green text-xs pt-1">·</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AiDisclaimer />
    </div>
  )
}
