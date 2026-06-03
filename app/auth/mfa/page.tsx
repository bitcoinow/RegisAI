'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RegisLogo } from '@/components/ui/logo'

export default function MfaChallengePage() {
  const [code, setCode] = useState('')
  const [factorId, setFactorId] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'idle' | 'verifying' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadFactor() {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error || !data?.totp?.length) {
        // No enrolled factors — send to dashboard (nothing to verify)
        router.replace('/dashboard')
        return
      }
      setFactorId(data.totp[0]?.id ?? null)
      setState('idle')
    }
    loadFactor()
  }, [supabase, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!factorId) return

    setState('verifying')
    setErrorMsg(null)

    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code })

    if (error) {
      setState('error')
      setErrorMsg(error.message)
      setCode('')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <RegisLogo className="text-4xl" />
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
            Compliance Operations
          </p>
        </div>

        <div className="border border-rule bg-bg-2 p-8">
          <h2 className="text-ink text-lg mb-1">Two-factor verification</h2>
          <p className="text-ink-3 text-sm mb-6">
            Enter the 6-digit code from your authenticator app
          </p>

          {state === 'loading' ? (
            <p className="text-ink-3 text-sm text-center py-4">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-ink-2 text-sm mb-1" htmlFor="code">
                  Verification code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full border border-rule bg-bg px-3 py-2 text-ink text-sm font-mono tracking-widest text-center focus:outline-none focus:border-green placeholder:text-ink-3 placeholder:tracking-widest"
                />
              </div>

              {errorMsg && <p className="text-risk-high text-sm">{errorMsg}</p>}

              <button
                type="submit"
                disabled={state === 'verifying' || code.length < 6}
                className="w-full bg-green text-white px-4 py-2.5 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
              >
                {state === 'verifying' ? 'Verifying…' : 'Verify'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
