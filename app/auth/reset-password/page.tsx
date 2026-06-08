'use client'

import { Suspense } from 'react'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { RegisLogo } from '@/components/ui/logo'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-ink-3">Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!token) {
      setErrorMsg('Invalid or missing reset token')
      setState('error')
      return
    }

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

    const resp = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await resp.json()

    if (!resp.ok) {
      setState('error')
      setErrorMsg(data.error ?? 'Failed to reset password')
    } else {
      setState('done')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <RegisLogo />
          <div className="mt-8 border border-rule bg-bg-2 p-8">
            <h2 className="text-xl font-bold text-ink mb-3">Invalid Reset Link</h2>
            <p className="text-sm text-ink-3">This password reset link is invalid or has expired.</p>
            <Link href="/login" className="mt-4 inline-block text-sm text-green underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'done') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <RegisLogo />
          <div className="mt-8 border border-rule bg-bg-2 p-8">
            <h2 className="text-xl font-bold text-ink mb-3">Password Updated</h2>
            <p className="text-sm text-ink-3">Your password has been reset. Redirecting to sign in...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <RegisLogo />
        </div>

        <div className="border border-rule bg-bg-2 p-8">
          <h2 className="text-xl font-bold text-ink mb-1">Reset your password</h2>
          <p className="text-sm text-ink-3 mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-ink bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green"
                required
                minLength={8}
              />
            </div>

            {state === 'error' && errorMsg && (
              <p className="text-sm text-red-700">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={state === 'loading'}
              className="w-full bg-green text-white py-2 px-4 font-mono text-sm tracking-widest uppercase hover:bg-green-2 transition-colors disabled:opacity-50"
            >
              {state === 'loading' ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-3">
          <Link href="/login" className="underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
