import type { RiskLevel } from '@/types'

const styles: Record<RiskLevel, React.CSSProperties> = {
  High:   { color: 'var(--red)',   borderColor: 'var(--red)' },
  Medium: { color: 'var(--amber)', borderColor: 'var(--amber)' },
  Low:    { color: 'var(--blue)',  borderColor: 'var(--blue)' },
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className="font-mono text-xs tracking-widest uppercase border px-2 py-0.5"
      style={styles[risk]}
    >
      {risk} Risk
    </span>
  )
}
