'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { RegisLogo } from '@/components/ui/logo'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
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

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setState('error')
      setErrorMsg(error.message)
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
          <h2 className="text-ink text-lg mb-1">Set new password</h2>
          <p className="text-ink-3 text-sm mb-6">Choose a strong password for your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-ink-2 text-sm mb-1" htmlFor="password">
                New password
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
              {state === 'loading' ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-3">
          <Link href="/login" className="text-ink-2 hover:text-ink underline underline-offset-2">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
