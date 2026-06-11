'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Jurisdiction, RegulatoryFramework } from '@/types'

type Stage = 'idle' | 'saving' | 'analysing' | 'error'

const MAX_PASTED_CHARS = 50_000

// Paste-text alternative to UploadForm: saves pasted policy text as a document,
// then runs the same gap analysis flow.
export function PasteTextForm({
  jurisdiction,
  framework = null,
  parentAuditId = null,
}: {
  jurisdiction: Jurisdiction
  framework?: RegulatoryFramework | null
  parentAuditId?: string | null
}) {
  const stageLabel: Record<Stage, string> = {
    idle: '',
    saving: 'Saving policy text…',
    analysing: framework
      ? `Analysing against the ${framework} framework…`
      : 'Analysing against the regulatory library…',
    error: '',
  }
  const [stage, setStage] = useState<Stage>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const router = useRouter()

  const busy = stage === 'saving' || stage === 'analysing'
  const overLimit = text.length > MAX_PASTED_CHARS

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!text.trim() || overLimit) return

    setErrorMsg(null)

    // ── Step 1: Save pasted text as a document ─────────────────────────────
    setStage('saving')
    const uploadRes = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), title: title.trim() || undefined }),
    })

    if (!uploadRes.ok) {
      const body = (await uploadRes.json()) as { error?: string }
      setStage('error')
      setErrorMsg(body.error ?? 'Failed to save policy text. Please try again.')
      return
    }

    const { document_id } = (await uploadRes.json()) as { document_id: string }

    // ── Step 2: Run gap analysis ───────────────────────────────────────────
    setStage('analysing')
    const analyseRes = await fetch('/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id, jurisdiction, framework, parent_audit_id: parentAuditId }),
    })

    if (!analyseRes.ok) {
      const body = (await analyseRes.json()) as { error?: string }
      setStage('error')
      setErrorMsg(body.error ?? 'Analysis failed. Please try again.')
      return
    }

    const { audit_id } = (await analyseRes.json()) as { audit_id: string }
    router.push(`/audit/${audit_id}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="policy-title"
          className="block font-mono text-xs tracking-widest uppercase text-ink-3 mb-2"
        >
          Policy name <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="policy-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Gifts & Hospitality Policy v2"
          disabled={busy}
          maxLength={200}
          className="w-full border border-rule bg-bg-2 text-ink text-sm py-2.5 px-3 focus:outline-none focus:border-green disabled:opacity-50"
        />
      </div>

      <div className="mb-1.5">
        <label
          htmlFor="policy-text"
          className="block font-mono text-xs tracking-widest uppercase text-ink-3 mb-2"
        >
          Policy text
        </label>
        <textarea
          id="policy-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full text of your policy document here…"
          rows={12}
          required
          disabled={busy}
          className="w-full border border-rule bg-bg-2 text-ink text-sm p-3 leading-relaxed focus:outline-none focus:border-green disabled:opacity-50 resize-y"
        />
      </div>
      <p
        className="text-xs font-mono text-right mb-6"
        style={overLimit ? { color: 'var(--red)' } : { color: 'var(--ink-3)' }}
      >
        {text.length.toLocaleString()}/{MAX_PASTED_CHARS.toLocaleString()}
      </p>

      {stage !== 'idle' && stage !== 'error' && (
        <div className="flex items-center gap-3 mb-6 p-4 border border-rule bg-bg-2">
          <span className="inline-block w-3 h-3 border-2 border-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-2">{stageLabel[stage]}</p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 border border-risk-high bg-bg">
          <p className="text-sm" style={{ color: 'var(--red)' }}>
            {errorMsg}
          </p>
          <button
            type="button"
            onClick={() => { setStage('idle'); setErrorMsg(null) }}
            className="mt-2 text-xs text-ink-3 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={busy || !text.trim() || overLimit}
        className="w-full bg-green text-white py-3 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
      >
        {busy ? 'Processing…' : 'Run Gap Analysis'}
      </button>
    </form>
  )
}
