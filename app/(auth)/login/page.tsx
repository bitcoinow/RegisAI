'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { RegisLogo } from '@/components/ui/logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showResend, setShowResend] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [resendError, setResendError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('error') === 'email_not_confirmed') {
        setErrorMsg('Please verify your email address before logging in.')
        setShowResend(true)
      }
    }
  }, [])

  async function handlePasswordSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setShowResend(false)
    setResendStatus('idle')
    setResendError(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verify')) {
        setErrorMsg('Your email address has not been verified yet. Please check your inbox.')
        setShowResend(true)
      } else {
        setErrorMsg(error.message)
      }
      setLoading(false)
      return
    }

    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut()
      setErrorMsg('Your email address has not been verified yet. Please check your inbox.')
      setShowResend(true)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function handleResendVerification() {
    if (!email) {
      setResendError('Please enter your email address first.')
      setResendStatus('error')
      return
    }

    setResendStatus('loading')
    setResendError(null)

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setResendStatus('error')
      setResendError(error.message)
    } else {
      setResendStatus('success')
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <RegisLogo className="text-4xl" href="/" />
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3">
          Compliance Operations
        </p>
      </div>

      <div className="border border-rule bg-bg-2 p-8">
        <h2 className="text-ink text-lg mb-1">Sign in</h2>
        <p className="text-ink-3 text-sm mb-6">Enter your credentials to continue</p>

        <form onSubmit={handlePasswordSignIn} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-ink-2 text-sm" htmlFor="password">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-ink-3 hover:text-ink transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-rule bg-bg px-3 py-2 text-ink text-sm focus:outline-none focus:border-green placeholder:text-ink-3"
            />
          </div>

          {errorMsg && (
            <div className="space-y-2">
              <p className="text-risk-high text-sm">{errorMsg}</p>
              {showResend && resendStatus !== 'success' && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendStatus === 'loading'}
                  className="text-xs text-ink-3 hover:text-ink underline underline-offset-2 transition-colors disabled:opacity-50"
                >
                  {resendStatus === 'loading' ? 'Resending verification...' : 'Resend verification email'}
                </button>
              )}
              {resendStatus === 'success' && (
                <p className="text-ink-2 text-xs font-medium">
                  Verification email resent! Please check your inbox.
                </p>
              )}
              {resendStatus === 'error' && resendError && (
                <p className="text-risk-high text-xs">{resendError}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green text-white px-4 py-2.5 text-sm hover:bg-green-2 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 border-t border-rule" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink-3">or</span>
          <div className="flex-1 border-t border-rule" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full border border-rule bg-bg px-4 py-2.5 text-sm text-ink-2 hover:bg-bg-2 hover:text-ink disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-ink-3">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-ink-2 hover:text-ink underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
