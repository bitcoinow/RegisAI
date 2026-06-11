import Link from 'next/link'
import { ScenarioForm } from '@/components/scenario/scenario-form'

export const metadata = {
  title: 'Scenario Risk Analyzer — Regis AI',
}

export default function ScenarioPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-6 py-10">
      <div className="mb-8">
        <Link href="/dashboard" className="text-ink-3 text-xs font-mono hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl text-ink mb-2">Scenario Risk Analyzer</h1>
        <p className="text-ink-3 text-sm mb-2">
          Describe a real-world workplace scenario — a gift, a hospitality offer, a procurement
          conversation, a potential conflict of interest. Regis will return a structured risk
          assessment with UK compliance categories, recommended next steps, and a draft
          escalation note.
        </p>
        <p className="text-ink-3 text-xs mb-8">
          Regis AI supports early risk identification and does not provide legal advice. Avoid
          including names or personal data you do not need to share.
        </p>

        <ScenarioForm />
      </div>
    </div>
  )
}
