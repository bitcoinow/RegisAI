import Link from 'next/link'
import { ScenarioResultView } from '@/components/scenario/scenario-result'
import { UK_GIFTS_DEMO } from '@/lib/demo-data'

export const metadata = {
  title: 'Sample UK Scenario Analysis — Regis AI',
  description:
    'A sample Regis AI risk analysis of a UK gifts and hospitality scenario during a live pitch process.',
}

export default function UkGiftsHospitalityDemoPage() {
  return (
    <>
      {/* Demo nav bar */}
      <div className="border-b border-rule bg-bg print:hidden">
        <div className="max-w-content mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs tracking-widest uppercase text-ink-3 hover:text-ink transition-colors"
            >
              ← Regis
            </Link>
            <span className="text-ink-3 text-xs">/</span>
            <span className="font-mono text-xs tracking-widest uppercase text-ink-3">
              Sample Scenario · UK Gifts &amp; Hospitality
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-ink-3">
            Pre-computed demo
          </span>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 md:px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase text-green mb-2">
            Scenario Risk Analyzer — Sample
          </p>
          <h1 className="font-serif text-3xl text-ink mb-3">
            Hospitality during a live pitch process
          </h1>
          <p className="text-ink-3 text-sm mb-8">
            This is a sample analysis of a common UK workplace scenario. With an account, you can
            submit your own scenarios and receive the same structured assessment.
          </p>

          {/* Scenario input */}
          <div className="mb-8">
            <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2">
              Submitted scenario
            </p>
            <div className="border border-rule bg-bg-2 p-4">
              <p className="text-sm text-ink-2 leading-relaxed">{UK_GIFTS_DEMO.scenario}</p>
            </div>
          </div>

          {/* Analysis */}
          <h2 className="font-serif text-2xl text-ink mb-6">Analysis</h2>
          <ScenarioResultView result={UK_GIFTS_DEMO.result} />

          {/* CTAs */}
          <div className="mt-10 pt-8 border-t border-rule flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="bg-green text-white px-6 py-3 text-sm text-center hover:bg-green-2 transition-colors"
            >
              Try your own scenario
            </Link>
            <Link
              href="/signup"
              className="border border-rule text-ink px-6 py-3 text-sm text-center hover:bg-bg-2 transition-colors"
            >
              Upload a policy for review
            </Link>
          </div>
          <p className="text-xs text-ink-3 mt-3">
            Create a free account to use the Scenario Risk Analyzer and Policy Gap Analyzer with
            your own scenarios and policies.
          </p>
        </div>
      </div>
    </>
  )
}
