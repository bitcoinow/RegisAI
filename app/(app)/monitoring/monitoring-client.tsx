'use client'

import { useState } from 'react'
import type { FeedResponse } from '@/app/api/monitoring/feed/route'

type Update = FeedResponse['updates'][number]
type JurisdictionFilter = 'US' | 'EU' | 'UK'

const JURISDICTION_LABELS: Record<JurisdictionFilter, string> = {
  US: 'United States',
  EU: 'European Union',
  UK: 'United Kingdom',
}

const JURISDICTION_SOURCES: Record<JurisdictionFilter, string> = {
  US: 'FINRA · SEC',
  EU: 'ESMA · EBA',
  UK: 'FCA · PRA',
}

const REGULATOR_STYLES: Record<string, string> = {
  FINRA: 'bg-green text-white',
  SEC: 'text-ink-2 border border-rule bg-bg-2',
}

function RegulatorBadge({ regulator }: { regulator: string }) {
  const staticCls = REGULATOR_STYLES[regulator]
  if (staticCls) {
    return (
      <span className={`inline-block font-mono text-xs tracking-widest uppercase px-2 py-0.5 ${staticCls}`}>
        {regulator}
      </span>
    )
  }
  // EU badges = blue, UK badges = gold
  const euRegs = new Set(['ESMA', 'EBA'])
  const color = euRegs.has(regulator) ? 'var(--blue)' : 'var(--gold)'
  return (
    <span
      className="inline-block font-mono text-xs tracking-widest uppercase px-2 py-0.5 border"
      style={{ color, borderColor: color }}
    >
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

interface MonitoringClientProps {
  initialUpdates: Update[]
  jurisdiction?: JurisdictionFilter
}

export function MonitoringClient({ initialUpdates, jurisdiction }: MonitoringClientProps) {
  const [updates, setUpdates] = useState<Update[]>(initialUpdates)
  // Lock to the jurisdiction from the subdomain — no tabs
  const jurisdictionFilter: JurisdictionFilter = jurisdiction ?? 'UK'
  const [refreshState, setRefreshState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [refreshDetail, setRefreshDetail] = useState<string | null>(null)

  async function loadFeed() {
    const res = await fetch('/api/monitoring/feed')
    if (!res.ok) return
    const data: FeedResponse = await res.json()
    setUpdates(data.updates)
  }

  async function handleRefresh() {
    setRefreshState('loading')
    setRefreshDetail(null)
    try {
      const res = await fetch('/api/monitoring/refresh', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        setRefreshDetail(body.error ?? `HTTP ${res.status}`)
        throw new Error()
      }
      const body = await res.json() as { parsed: number; inserted: number }
      await loadFeed()
      setRefreshDetail(`${body.parsed} items fetched`)
      setRefreshState('done')
    } catch {
      setRefreshState('error')
    } finally {
      setTimeout(() => { setRefreshState('idle'); setRefreshDetail(null) }, 4000)
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

  const jurisCount: Record<JurisdictionFilter, number> = {
    US: updates.filter((u) => u.jurisdiction === 'US').length,
    EU: updates.filter((u) => u.jurisdiction === 'EU').length,
    UK: updates.filter((u) => u.jurisdiction === 'UK').length,
  }

  const filtered = updates.filter((u) => u.jurisdiction === jurisdictionFilter)

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
            {JURISDICTION_SOURCES[jurisdictionFilter]} · live compliance feed
            {lastUpdated && (
              <span className="ml-3 font-mono text-xs">updated {lastUpdated}</span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleRefresh}
            disabled={refreshState === 'loading'}
            className="bg-green text-white text-sm px-5 py-2.5 hover:bg-green-2 transition-colors disabled:opacity-50"
          >
            {refreshLabel}
          </button>
          {refreshDetail && (
            <span className={`font-mono text-xs ${refreshState === 'error' ? 'text-red' : 'text-ink-3'}`}>
              {refreshDetail}
            </span>
          )}
        </div>
      </div>

      {/* ── Jurisdiction badge (locked to subdomain) ──────────────────────── */}
      <div className="flex items-center gap-2 border border-rule px-4 py-2.5 mb-6 bg-bg-2">
        <span className="font-mono text-xs tracking-widest uppercase text-green font-bold">
          {JURISDICTION_LABELS[jurisdictionFilter]}
        </span>
        <span className="font-mono text-xs text-ink-3">
          {filtered.length} update{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      {updates.length > 0 && (
        <div className="flex gap-4 mb-6">
          {[
            { label: 'Total', value: filtered.length },
            ...JURISDICTION_SOURCES[jurisdictionFilter].split(' · ').map((reg) => ({
              label: reg,
              value: filtered.filter((u) => u.regulator === reg).length,
            })),
          ].map(({ label, value }) => (
            <div key={label} className="border border-rule bg-bg-2 px-4 py-3 min-w-[80px]">
              <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-1">{label}</p>
              <p className="font-serif text-2xl text-ink">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Feed ───────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="border border-rule bg-bg-2 p-16 text-center">
          <p className="font-serif text-2xl text-ink mb-2">No updates yet</p>
          <p className="text-ink-3 text-sm">
            Click <span className="text-ink">Refresh Feed</span> to pull the latest{' '}
            {JURISDICTION_SOURCES[jurisdictionFilter]} notices.
          </p>
        </div>
      ) : (
        <div className="border border-rule overflow-hidden">
          {filtered.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
