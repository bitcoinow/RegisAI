import Link from 'next/link'
import { CLEARVIEW_DEMO } from '@/lib/demo-data'
import { AuditReport } from '@/components/audit/audit-report'

export const dynamic = 'force-dynamic'

export default function ClearviewDemoPage() {
  return (
    <>
      <div className="border-b border-rule bg-bg print:hidden">
        <div className="max-w-content mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs tracking-widest uppercase text-ink-3 hover:text-ink transition-colors"
            >
              ← Regis
            </Link>
            <span className="text-ink-3 text-xs">/</span>
            <span className="font-mono text-xs tracking-widest uppercase text-ink-3">
              Sample Audit · US · RIA
            </span>
          </div>
          <Link
            href="/demo/gdpr"
            className="font-mono text-[10px] tracking-widest uppercase text-ink-3 hover:text-ink transition-colors"
          >
            EU Legacy Demo →
          </Link>
        </div>
      </div>

      {/* Legacy demo banner */}
      <div className="border-b border-rule bg-bg-2">
        <div className="max-w-content mx-auto px-6 py-3">
          <p className="text-xs text-ink-2 leading-relaxed">
            <span className="font-mono tracking-widest uppercase text-ink-3 mr-2">
              Legacy demo — future jurisdiction example (US RIA).
            </span>
            The Regis AI MVP is currently focused on UK workplace compliance scenarios and
            policy-risk review.{' '}
            <Link href="/demo/uk-gifts-hospitality" className="text-green hover:underline">
              See the current UK sample scenario →
            </Link>
          </p>
        </div>
      </div>

      <AuditReport audit={CLEARVIEW_DEMO} isDemo />
    </>
  )
}
