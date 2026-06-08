'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RegisLogo } from '@/components/ui/logo'

function ConfirmFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setState('error')
      setErrorMsg('Invalid or missing confirmation token')
      return
    }

    // Navigate to the API endpoint — browser processes Set-Cookie + redirect natively
    window.location.href = `/api/auth/confirm?token=${encodeURIComponent(token)}`
  }, [token])
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <RegisLogo className="text-3xl" />
        </div>

        <div className="border border-rule bg-bg-2 p-8">
          {state === 'loading' && (
            <>
              <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-bold text-ink mb-2">Confirming your email...</h2>
              <p className="text-sm text-ink-3">This will only take a moment.</p>
            </>
          )}

          {state === 'success' && (
            <>
              <div className="w-12 h-12 rounded-full bg-green flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">✓</span>
              </div>
              <h2 className="text-lg font-bold text-ink mb-2">Email confirmed</h2>
              <p className="text-sm text-ink-3">Redirecting to set up your firm...</p>
            </>
          )}

          {state === 'error' && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-700 text-xl">✕</span>
              </div>
              <h2 className="text-lg font-bold text-ink mb-2">Confirmation failed</h2>
              <p className="text-sm text-ink-3 mb-4">{errorMsg}</p>
              <a href="/signup" className="text-sm text-green underline">Sign up again</a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <p className="text-ink-3">Loading...</p>
        </div>
      }
    >
      <ConfirmFlow />
    </Suspense>
  )
}
