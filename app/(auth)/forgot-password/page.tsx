'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { RegisLogo } from '@/components/ui/logo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })

    if (error) {
      setState('error')
      setErrorMsg(error.message)
    } else {
      setState('sent')
    }
  }

  if (state === 'sent') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-10">
          <RegisLogo className="text-4xl" href="/" />
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
            Compliance Operations
          </p>
        </div>
        <div className="border border-rule bg-bg-2 p-10">
          <p className="text-ink text-lg mb-2">Check your email</p>
          <p className="text-ink-3 text-sm">
            If <span className="text-ink-2">{email}</span> is registered, you&apos;ll receive a
            password reset link shortly.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-4 inline-block text-ink-3 text-sm hover:text-ink underline-offset-2 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <RegisLogo className="text-4xl" />
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
          Compliance Operations
        </p>
      </div>

      <div className="border border-rule bg-bg-2 p-8">
        <h2 className="text-ink text-lg mb-1">Reset password</h2>
        <p className="text-ink-3 text-sm mb-6">
          Enter your email and we&apos;ll send a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-ink-2 text-sm mb-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@firm.com"
              className="w-full border border-rule bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
            />
          </div>

          {errorMsg && <p className="text-risk-high text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full bg-green text-white px-4 py-2.5 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
          >
            {state === 'loading' ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-ink-3">
        Remember your password?{' '}
        <Link href="/login" className="text-ink-2 hover:text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}
