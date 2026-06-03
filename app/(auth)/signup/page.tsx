'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { RegisLogo } from '@/components/ui/logo'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      setState('error')
      return
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters')
      setState('error')
      return
    }

    setState('loading')
    setErrorMsg(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
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
            We sent a confirmation link to{' '}
            <span className="text-ink-2">{email}</span>. Click it to activate your account.
          </p>
        </div>
        <button
          onClick={() => setState('idle')}
          className="mt-4 text-ink-3 text-sm hover:text-ink underline-offset-2 hover:underline"
        >
          Use a different email
        </button>
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
        <h2 className="text-ink text-lg mb-1">Create account</h2>
        <p className="text-ink-3 text-sm mb-6">Start your compliance audit workflow</p>

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

          <div>
            <label className="block text-ink-2 text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full border border-rule bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
            />
          </div>

          <div>
            <label className="block text-ink-2 text-sm mb-1" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full border border-rule bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
            />
          </div>

          {errorMsg && <p className="text-risk-high text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full bg-green text-white px-4 py-2.5 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
          >
            {state === 'loading' ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-ink-3">
        Already have an account?{' '}
        <Link href="/login" className="text-ink-2 hover:text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}
