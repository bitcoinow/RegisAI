'use client'

import { useState, useEffect } from 'react'
import type { FeedResponse } from '@/app/api/monitoring/feed/route'

type Update = FeedResponse['updates'][number]

function RegulatorBadge({ regulator }: { regulator: string }) {
  const cls =
    regulator === 'FINRA'
      ? 'bg-green text-white'
      : 'text-ink-2 border border-rule bg-bg-2'
  return (
    <span className={`inline-block font-mono text-xs tracking-widest uppercase px-2 py-0.5 ${cls}`}>
      {regulator}
    </span>
  )
}

function RelevanceDots({ score }: { score: number | null }) {
  const s = score ?? 0
  return (
    <span className="flex items-center gap-0.5" title={`Relevance ${s}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-1.5 h-1.5 rounded-full ${i < s ? 'bg-green' : 'bg-rule'}`}
        />
      ))}
    </span>
  )
}

function FeedItem({ item }: { item: Update }) {
  const date = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <div className="border-b border-rule last:border-b-0 px-5 py-5 hover:bg-bg-2 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <RegulatorBadge regulator={item.regulator} />
            <RelevanceDots score={item.relevance_score} />
            {date && <span className="font-mono text-xs text-ink-3">{date}</span>}
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink text-sm font-medium hover:text-green transition-colors leading-snug block mb-1"
          >
            {item.title}
          </a>
          {item.summary && (
            <p className="text-ink-3 text-xs leading-relaxed line-clamp-2">{item.summary}</p>
          )}
          {item.affected_rules && item.affected_rules.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.affected_rules.map((rule) => (
                <span key={rule} className="font-mono text-xs text-ink-3 border border-rule px-1.5 py-0.5">
                  {rule}
                </span>
              ))}
            </div>
          )}
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-green text-xs font-mono tracking-wide hover:underline"
        >
          Read →
        </a>
      </div>
    </div>
  )
}

export default function MonitoringPage() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [fetching, setFetching] = useState(true)
  const [refreshState, setRefreshState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function loadFeed() {
    const res = await fetch('/api/monitoring/feed')
    if (!res.ok) return
    const data: FeedResponse = await res.json()
    setUpdates(data.updates)
  }

  useEffect(() => {
    loadFeed().finally(() => setFetching(false))
  }, [])

  async function handleRefresh() {
    setRefreshState('loading')
    try {
      const res = await fetch('/api/monitoring/refresh', { method: 'POST' })
      if (!res.ok) throw new Error()
      await loadFeed()
      setRefreshState('done')
    } catch {
      setRefreshState('error')
    } finally {
      setTimeout(() => setRefreshState('idle'), 3000)
    }
  }

  const refreshLabel =
    refreshState === 'loading'
      ? 'Fetching…'
      : refreshState === 'done'
        ? 'Updated'
        : refreshState === 'error'
          ? 'Error — retry'
          : 'Refresh Feed'

  const finraCount = updates.filter((u) => u.regulator === 'FINRA').length
  const secCount = updates.filter((u) => u.regulator === 'SEC').length
  const firstUpdate = updates[0]
  const lastUpdated = firstUpdate
    ? new Date(firstUpdate.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      : null

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">Regulatory Updates</h1>
          <p className="text-ink-3 text-sm">
            FINRA · SEC · live compliance feed
            {lastUpdated && (
              <span className="ml-3 font-mono text-xs">updated {lastUpdated}</span>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshState === 'loading'}
          className="bg-green text-white text-sm px-5 py-2.5 hover:bg-green-2 transition-colors disabled:opacity-50"
        >
          {refreshLabel}
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      {updates.length > 0 && (
        <div className="flex gap-4 mb-6">
          {[
            { label: 'Total', value: updates.length },
            { label: 'FINRA', value: finraCount },
            { label: 'SEC', value: secCount },
          ].map(({ label, value }) => (
            <div key={label} className="border border-rule bg-bg-2 px-4 py-3 min-w-[80px]">
              <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-1">{label}</p>
              <p className="font-serif text-2xl text-ink">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Feed ───────────────────────────────────────────────────────────── */}
      {fetching ? (
        <div className="border border-rule bg-bg-2 p-12 text-center">
          <p className="text-ink-3 text-sm">Loading feed…</p>
        </div>
      ) : updates.length === 0 ? (
        <div className="border border-rule bg-bg-2 p-16 text-center">
          <p className="font-serif text-2xl text-ink mb-2">No updates yet</p>
          <p className="text-ink-3 text-sm">
            Click <span className="text-ink">Refresh Feed</span> to pull the latest FINRA and SEC notices.
          </p>
        </div>
      ) : (
        <div className="border border-rule overflow-hidden">
          {updates.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
