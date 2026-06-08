'use client'

export function SignOutButton() {
  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-ink-3 text-sm hover:text-ink transition-colors"
    >
      Sign out
    </button>
  )
}
