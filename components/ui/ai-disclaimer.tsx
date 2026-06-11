// Standard human-review disclaimer shown beneath every AI-generated analysis.
export function AiDisclaimer() {
  return (
    <div className="border border-rule bg-bg-2 px-4 py-3 mt-6">
      <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-1.5">
        Human review required
      </p>
      <p className="text-ink-3 text-xs leading-relaxed">
        Regis AI provides structured compliance risk information for review. It does not provide
        legal advice or make final compliance decisions. Escalate high-risk matters to qualified
        legal, compliance, HR, or governance professionals.
      </p>
    </div>
  )
}
