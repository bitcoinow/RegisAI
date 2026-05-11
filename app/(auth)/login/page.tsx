'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
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
        <div className="mb-10 text-center">
          <Image src="/logo.svg" alt="Regis" width={153} height={90} className="mx-auto mb-2" />
          <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
            Compliance Operations
          </p>
        </div>
        <div className="border border-rule bg-bg-2 p-10">
          <p className="text-ink text-lg mb-2">Check your email</p>
          <p className="text-ink-3 text-sm">
            We sent a magic link to <span className="text-ink-2">{email}</span>
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
        <Image src="/logo.svg" alt="Regis" width={153} height={90} className="mx-auto mb-2" />
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
          Compliance Operations
        </p>
      </div>

      <div className="border border-rule bg-bg-2 p-8">
        <h2 className="text-ink text-lg mb-1">Sign in</h2>
        <p className="text-ink-3 text-sm mb-6">Enter your email to receive a magic link</p>

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
            {state === 'loading' ? 'Sending…' : 'Send Magic Link'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-ink-3">
        Design partner access only.{' '}
        <a href="mailto:hello@regis.ai" className="underline underline-offset-2">
          Request access
        </a>
      </p>
    </div>
  )
}
