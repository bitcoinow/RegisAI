import type { Finding } from '@/types'
import { RiskBadge } from '@/components/ui/risk-badge'

interface RiskCounts {
  high: number
  medium: number
  low: number
  total: number
}

export interface ComparisonData {
  scanNumber: number
  previousDate: string
  previousScore: number | null
  currentScore: number | null
  previous: RiskCounts
  current: RiskCounts
  gaps_closed: number
  gaps_persisting: number
  gaps_new: number
  closed: Finding[]
  persisting: Finding[]
  added: Finding[]
  improvedReqIds: string[]
}

function ScoreDelta({ from, to }: { from: number | null; to: number | null }) {
  const delta = from != null && to != null ? to - from : null
  return (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <div className="font-serif text-3xl text-ink-3">{from ?? '—'}%</div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3">Before</div>
      </div>
      <div className="text-ink-3 text-2xl pb-3">→</div>
      <div className="text-center">
        <div className="font-serif text-5xl text-green">{to ?? '—'}%</div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3">After</div>
      </div>
      {delta != null && (
        <div
          className="pb-3 font-mono text-sm font-medium"
          style={{ color: delta >= 0 ? 'var(--green)' : 'var(--red)' }}
        >
          {delta >= 0 ? '▲' : '▼'} {delta >= 0 ? '+' : ''}
          {delta}
        </div>
      )}
    </div>
  )
}

function GroupHeading({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color }}>
      {label} <span className="text-ink-3">({count})</span>
    </p>
  )
}

function CompactFinding({
  finding,
  strike,
  badge,
}: {
  finding: Finding
  strike?: boolean
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <div className="min-w-0">
        <p className="font-mono text-[11px] text-ink-3">{finding.rule}</p>
        <p className={`text-sm truncate ${strike ? 'text-ink-3 line-through' : 'text-ink'}`}>
          {finding.requirement}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {badge && (
          <span className="font-mono text-[10px] tracking-widest uppercase text-green">{badge}</span>
        )}
        <RiskBadge risk={finding.risk} />
      </div>
    </div>
  )
}

// Re-scan comparison: the heart of the proof point — what changed since the last
// audit, with a measurable posture movement.
export function AuditComparison({ data }: { data: ComparisonData }) {
  const improved = new Set(data.improvedReqIds)

  return (
    <section className="mb-10 border border-green bg-green-tint/30 p-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-green mb-1">
            Re-scan #{data.scanNumber} · improvement vs previous audit
          </p>
          <h2 className="font-serif text-2xl text-ink">Compliance posture</h2>
        </div>
        <ScoreDelta from={data.previousScore} to={data.currentScore} />
      </div>

      {/* Headline counts */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-rule bg-bg p-4 text-center">
          <div className="font-serif text-3xl text-green">{data.gaps_closed}</div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3">Closed</div>
        </div>
        <div className="border border-rule bg-bg p-4 text-center">
          <div className="font-serif text-3xl text-risk-medium">{data.gaps_persisting}</div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3">
            Persisting
          </div>
        </div>
        <div className="border border-rule bg-bg p-4 text-center">
          <div className="font-serif text-3xl text-risk-high">{data.gaps_new}</div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3">
            Newly identified
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {data.closed.length > 0 && (
          <div>
            <GroupHeading count={data.closed.length} label="Gaps closed" color="var(--green)" />
            <div className="border border-rule bg-bg divide-y divide-rule">
              {data.closed.map((f) => (
                <CompactFinding key={f.id} finding={f} strike badge="Closed ✓" />
              ))}
            </div>
          </div>
        )}

        {data.persisting.length > 0 && (
          <div>
            <GroupHeading
              count={data.persisting.length}
              label="Gaps still open"
              color="var(--amber)"
            />
            <div className="border border-rule bg-bg divide-y divide-rule">
              {data.persisting.map((f) => (
                <CompactFinding
                  key={f.id}
                  finding={f}
                  {...(improved.has(f.req_id ?? f.id) ? { badge: 'Improved' } : {})}
                />
              ))}
            </div>
          </div>
        )}

        {data.added.length > 0 && (
          <div>
            <GroupHeading count={data.added.length} label="Newly identified" color="var(--red)" />
            <div className="border border-rule bg-bg divide-y divide-rule">
              {data.added.map((f) => (
                <CompactFinding key={f.id} finding={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
