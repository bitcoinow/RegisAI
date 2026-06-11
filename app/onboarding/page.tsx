'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisLogo } from '@/components/ui/logo'
import type { FirmType, Regulator } from '@/types'

const FIRM_TYPES: { id: FirmType; label: string }[] = [
  { id: 'Financial Services', label: 'Financial Services' },
  { id: 'Professional Services', label: 'Professional Services' },
  { id: 'Technology', label: 'Technology' },
  { id: 'Public Sector', label: 'Public Sector' },
  { id: 'Other', label: 'Other' },
]

// Stored in profiles.aum_range (free-text column); now captures organisation size.
const AUM_RANGES: { id: string; label: string }[] = [
  { id: '1–50', label: '1 – 50 people' },
  { id: '51–250', label: '51 – 250 people' },
  { id: '251–1000', label: '251 – 1,000 people' },
  { id: '1000+', label: '1,000+ people' },
]

const REGULATORS: { id: Regulator; label: string }[] = [
  { id: 'FCA', label: 'FCA' },
  { id: 'ICO', label: 'ICO' },
  { id: 'Multiple', label: 'Multiple' },
  { id: 'None / Other', label: 'None / Other' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [firmName, setFirmName] = useState('')
  const [firmType, setFirmType] = useState<FirmType | null>(null)
  const [aumRange, setAumRange] = useState<string | null>(null)
  const [regulator, setRegulator] = useState<Regulator | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isComplete =
    firmName.trim().length > 0 && firmType !== null &&
    aumRange !== null && regulator !== null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isComplete) return
    setStatus('loading')
    setErrorMsg(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_name: firmName.trim(),
          firm_type: firmType,
          aum_range: aumRange,
          regulator,
        }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setErrorMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
        return
      }
      router.push('/dashboard')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        <div className="mb-10 text-center">
          <RegisLogo className="text-4xl" href="/" />
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mt-1">
            Compliance Operations
          </p>
        </div>

        <div className="border border-rule bg-bg-2 p-8">
          <h1 className="font-serif text-2xl text-ink mb-1">Set up your organisation</h1>
          <p className="text-ink-3 text-sm mb-8">
            This takes 30 seconds and tailors every analysis to your organisation&rsquo;s context.
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">

            <div>
              <label
                className="block font-mono text-xs tracking-widest uppercase text-ink-3 mb-2"
                htmlFor="firm-name"
              >
                Organisation name
              </label>
              <input
                id="firm-name"
                type="text"
                required
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="Acme Media Ltd"
                className="w-full border border-rule bg-bg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
              />
            </div>

            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2">
                Organisation type
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px border border-rule bg-rule">
                {FIRM_TYPES.map((ft) => (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => setFirmType(ft.id)}
                    className={[
                      'py-2.5 px-3 text-sm transition-colors',
                      firmType === ft.id
                        ? 'bg-green text-white'
                        : 'bg-bg-2 text-ink-2 hover:bg-bg',
                    ].join(' ')}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2">
                Organisation size
              </p>
              <div className="flex border border-rule">
                {AUM_RANGES.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAumRange(a.id)}
                    className={[
                      'flex-1 py-2.5 px-3 text-sm transition-colors border-r border-rule last:border-r-0',
                      aumRange === a.id
                        ? 'bg-green text-white'
                        : 'bg-bg-2 text-ink-2 hover:bg-bg',
                    ].join(' ')}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-2">
                Primary regulator
              </p>
              <div className="flex border border-rule">
                {REGULATORS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegulator(r.id)}
                    className={[
                      'flex-1 py-2.5 px-3 text-sm transition-colors border-r border-rule last:border-r-0',
                      regulator === r.id
                        ? 'bg-green text-white'
                        : 'bg-bg-2 text-ink-2 hover:bg-bg',
                    ].join(' ')}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-risk-high text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={!isComplete || status === 'loading'}
              className="w-full bg-green text-white px-5 py-2.5 text-sm hover:bg-green-2 disabled:opacity-40 transition-colors"
            >
              {status === 'loading' ? 'Saving…' : 'Continue to dashboard'}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-3">
          You can update these details later in your account settings.
        </p>

      </div>
    </div>
  )
}
