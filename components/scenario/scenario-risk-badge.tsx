import type { ScenarioRiskRating } from '@/types'

// Four-level badge for scenario analysis. Kept separate from the audit
// RiskBadge, which is typed to the three-level finding scale.
const styles: Record<ScenarioRiskRating, React.CSSProperties> = {
  Critical: { color: '#fff', backgroundColor: 'var(--red)', borderColor: 'var(--red)' },
  High:     { color: 'var(--red)',   borderColor: 'var(--red)' },
  Medium:   { color: 'var(--amber)', borderColor: 'var(--amber)' },
  Low:      { color: 'var(--blue)',  borderColor: 'var(--blue)' },
}

export function ScenarioRiskBadge({ rating }: { rating: ScenarioRiskRating }) {
  return (
    <span
      className="font-mono text-xs tracking-widest uppercase border px-2 py-0.5"
      style={styles[rating]}
    >
      {rating} Risk
    </span>
  )
}
