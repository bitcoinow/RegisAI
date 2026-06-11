'use client'

import { useState } from 'react'
import { ScenarioResultView } from '@/components/scenario/scenario-result'
import { SCENARIO_MAX_CHARS } from '@/lib/scenario'
import type { ScenarioResult } from '@/types'

const PLACEHOLDER =
  'Example: A sales team is pitching for a new contract with a major UK retailer. During the pitch process, one team member takes the client contact to dinner, then offers hotel accommodation. The client later suggests they will accept the vendor if this hospitality continues every month.'

export function ScenarioForm() {
  const [scenario, setScenario] = useState('')
  const [busy, setBusy] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [result, setResult] = useState<ScenarioResult | null>(null)

  const trimmed = scenario.trim()
  const overLimit = scenario.length > SCENARIO_MAX_CHARS

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!trimmed || overLimit || busy) return

    setBusy(true)
    setErrorMsg(null)
    setResult(null)

    try {
      const res = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: trimmed }),
      })

      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        setErrorMsg(body.error ?? 'Analysis failed. Please try again.')
        return
      }

      setResult((await res.json()) as ScenarioResult)
    } catch {
      setErrorMsg('Analysis failed. Please check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="scenario"
          className="block font-mono text-xs tracking-widest uppercase text-ink-3 mb-2"
        >
          Describe the scenario
        </label>
        <textarea
          id="scenario"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={7}
          required
          disabled={busy}
          className="w-full border border-rule bg-bg-2 text-ink text-sm p-3 leading-relaxed focus:outline-none focus:border-green disabled:opacity-50 resize-y"
        />
        <div className="flex items-center justify-between mt-1.5 mb-4">
          <p className="text-xs text-ink-3">
            Include who was involved, what was offered or requested, and any live tender or
            procurement context.
          </p>
          <p
            className="text-xs font-mono shrink-0 ml-4"
            style={overLimit ? { color: 'var(--red)' } : { color: 'var(--ink-3)' }}
          >
            {scenario.length.toLocaleString()}/{SCENARIO_MAX_CHARS.toLocaleString()}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 border border-risk-high bg-bg">
            <p className="text-sm" style={{ color: 'var(--red)' }}>
              {errorMsg}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !trimmed || overLimit}
          className="w-full bg-green text-white py-3 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
        >
          {busy ? 'Analysing scenario…' : 'Analyse Scenario'}
        </button>
      </form>

      {busy && (
        <div className="flex items-center gap-3 mt-6 p-4 border border-rule bg-bg-2">
          <span className="inline-block w-3 h-3 border-2 border-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-2">
            Identifying risk signals against UK workplace compliance categories…
          </p>
        </div>
      )}

      {result && (
        <div className="mt-10 pt-8 border-t border-rule">
          <h2 className="font-serif text-2xl text-ink mb-6">Analysis</h2>
          <ScenarioResultView result={result} />
        </div>
      )}
    </div>
  )
}
