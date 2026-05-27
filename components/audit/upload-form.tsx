'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Jurisdiction } from '@/types'

type Stage = 'idle' | 'uploading' | 'analysing' | 'error'

export function UploadForm({ jurisdiction }: { jurisdiction: Jurisdiction }) {
  const requirementCount: Record<Jurisdiction, number> = { US: 32, EU: 23, UK: 19 }
  const stageLabel: Record<Stage, string> = {
    idle: '',
    uploading: 'Extracting text from PDF…',
    analysing: `Analysing against ${requirementCount[jurisdiction]} regulatory requirements…`,
    error: '',
  }
  const [stage, setStage] = useState<Stage>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const busy = stage === 'uploading' || stage === 'analysing'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setErrorMsg(null)

    // ── Step 1: Upload and extract ─────────────────────────────────────────
    setStage('uploading')
    const formData = new FormData()
    formData.append('file', file)

    const uploadRes = await fetch('/api/documents', { method: 'POST', body: formData })

    if (!uploadRes.ok) {
      const body = (await uploadRes.json()) as { error?: string }
      setStage('error')
      setErrorMsg(body.error ?? 'Upload failed. Please try again.')
      return
    }

    const { document_id } = (await uploadRes.json()) as { document_id: string }

    // ── Step 2: Run gap analysis ───────────────────────────────────────────
    setStage('analysing')
    const analyseRes = await fetch('/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id, jurisdiction }),
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
      <div className="border-2 border-dashed border-rule p-10 text-center mb-6">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          required
          disabled={busy}
          className="w-full text-sm text-ink-2 file:mr-4 file:py-2 file:px-4 file:border file:border-rule file:text-sm file:bg-bg-2 file:text-ink hover:file:bg-bg cursor-pointer disabled:opacity-50"
        />
        <p className="mt-3 text-xs text-ink-3">PDF only · Max 10 MB</p>
      </div>

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
        disabled={busy}
        className="w-full bg-green text-white py-3 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
      >
        {busy ? 'Processing…' : 'Run Gap Analysis'}
      </button>
    </form>
  )
}
