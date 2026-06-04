'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DocumentActionsProps {
  documentId: string
  auditCount: number
}

export function DocumentActions({ documentId, auditCount }: DocumentActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    const auditClause =
      auditCount > 0
        ? ` and its ${auditCount} audit${auditCount === 1 ? '' : 's'} and their findings`
        : ''
    const confirmed = window.confirm(
      `This permanently deletes this document${auditClause}. This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/documents/${documentId}`, { method: 'DELETE' })
      if (!res.ok) {
        setDeleting(false)
        window.alert('Failed to delete document. Please try again.')
        return
      }
      router.refresh()
    } catch {
      setDeleting(false)
      window.alert('Network error. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <a
        href={`/api/documents/${documentId}/download`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green text-xs font-mono tracking-wide hover:underline"
      >
        View PDF →
      </a>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="text-risk-high text-xs font-mono tracking-wide hover:underline disabled:opacity-40"
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}
