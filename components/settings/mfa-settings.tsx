'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface Props {
  enrolledFactorId: string | null
}

type EnrollState = 'idle' | 'enrolling' | 'verifying' | 'error'

export function MfaSettings({ enrolledFactorId }: Props) {
  const [factorId, setFactorId] = useState<string | null>(enrolledFactorId)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [state, setState] = useState<EnrollState>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function startEnrollment() {
    setState('enrolling')
    setErrorMsg(null)

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'Regis',
      friendlyName: 'Authenticator App',
    })

    if (error || !data) {
      setState('error')
      setErrorMsg(error?.message ?? 'Failed to start enrollment')
      return
    }

    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setPendingFactorId(data.id)
    setState('verifying')
  }

  async function verifyEnrollment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pendingFactorId) return

    setSubmitting(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: pendingFactorId,
      code,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      setCode('')
    } else {
      setFactorId(pendingFactorId)
      setPendingFactorId(null)
      setQrCode(null)
      setSecret(null)
      setCode('')
      setState('idle')
      router.refresh()
    }
  }

  async function disableMfa() {
    if (!factorId) return
    setState('enrolling')
    setErrorMsg(null)

    const { error } = await supabase.auth.mfa.unenroll({ factorId })

    if (error) {
      setState('error')
      setErrorMsg(error.message)
    } else {
      setFactorId(null)
      setState('idle')
      router.refresh()
    }
  }

  function cancelEnrollment() {
    setPendingFactorId(null)
    setQrCode(null)
    setSecret(null)
    setCode('')
    setState('idle')
    setErrorMsg(null)
  }

  // MFA is active — show status + disable option
  if (factorId && state === 'idle') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green" />
          <span className="text-sm text-ink">Two-factor authentication is enabled</span>
        </div>
        <button
          onClick={disableMfa}
          className="border border-rule px-4 py-2 text-sm text-ink-2 hover:text-risk-high hover:border-risk-high transition-colors"
        >
          Disable 2FA
        </button>
      </div>
    )
  }

  // QR code step
  if (state === 'verifying' && qrCode) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-ink-2 text-sm mb-3">
            Scan this QR code with your authenticator app, then enter the 6-digit code below.
          </p>
          <div className="border border-rule bg-bg p-4 inline-block">
            {/* qr_code is a PNG data URL from Supabase */}
            <Image src={qrCode} alt="MFA QR code" width={160} height={160} unoptimized />
          </div>
        </div>

        {secret && (
          <details className="text-xs">
            <summary className="font-mono uppercase tracking-widest text-ink-3 cursor-pointer select-none">
              Can&apos;t scan? Enter code manually
            </summary>
            <p className="mt-2 font-mono text-ink-2 break-all bg-bg border border-rule px-3 py-2">
              {secret}
            </p>
          </details>
        )}

        <form onSubmit={verifyEnrollment} className="space-y-3">
          <div>
            <label className="block text-ink-2 text-sm mb-1" htmlFor="totp-code">
              Verification code
            </label>
            <input
              id="totp-code"
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
              className="w-40 border border-rule bg-bg px-3 py-2 text-ink text-sm font-mono tracking-widest text-center focus:outline-none focus:border-green placeholder:text-ink-3"
            />
          </div>

          {errorMsg && <p className="text-risk-high text-sm">{errorMsg}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || code.length < 6}
              className="bg-green text-white px-4 py-2 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Verifying…' : 'Activate 2FA'}
            </button>
            <button
              type="button"
              onClick={cancelEnrollment}
              className="text-sm text-ink-3 hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Default: MFA not enabled
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-rule" />
        <span className="text-sm text-ink-3">Two-factor authentication is not enabled</span>
      </div>

      {errorMsg && <p className="text-risk-high text-sm">{errorMsg}</p>}

      <button
        onClick={startEnrollment}
        disabled={state === 'enrolling'}
        className="bg-green text-white px-4 py-2 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
      >
        {state === 'enrolling' ? 'Setting up…' : 'Enable 2FA'}
      </button>
    </div>
  )
}
