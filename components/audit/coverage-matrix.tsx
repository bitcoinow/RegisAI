import type { CoverageItem } from '@/lib/coverage'
import { RiskBadge } from '@/components/ui/risk-badge'

// "Complete coverage" proof: every in-scope requirement and whether the document
// met it or has a gap. This is what a compliance officer wants to see — not just
// the gaps, but evidence that the whole framework was assessed.
export function CoverageMatrix({
  items,
  frameworkLabel,
}: {
  items: CoverageItem[]
  frameworkLabel: string
}) {
  if (items.length === 0) return null
  const met = items.filter((i) => i.status === 'met').length
  const gaps = items.length - met

  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-ink mb-1">Coverage Matrix</h2>
      <p className="font-mono text-xs text-ink-3 mb-4">
        {items.length} of {items.length} {frameworkLabel} requirements assessed
        {' · '}
        <span className="text-green">{met} met</span>
        {' · '}
        <span className="text-ink-2">{gaps} {gaps === 1 ? 'gap' : 'gaps'}</span>
      </p>
      <div className="border border-rule divide-y divide-rule">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-ink-3">{item.rule}</p>
              <p className="text-ink text-sm truncate">{item.requirement}</p>
            </div>
            <div className="flex-shrink-0">
              {item.status === 'met' ? (
                <span className="font-mono text-[10px] tracking-widest uppercase text-green">
                  ✓ Met
                </span>
              ) : (
                <RiskBadge risk={item.risk ?? 'Low'} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
