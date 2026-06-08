import { Suspense } from 'react'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { SkeletonFeed } from '@/components/ui/skeleton'
import { MonitoringClient } from './monitoring-client'
import type { FeedResponse } from '@/app/api/monitoring/feed/route'

type Update = FeedResponse['updates'][number]

function MonitoringSkeleton() {
  return (
    <div className="max-w-content mx-auto px-6 py-10">
      <div className="border border-rule divide-y divide-rule">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-5">
            <SkeletonFeed />
          </div>
        ))}
      </div>
    </div>
  )
}

async function MonitoringContent() {
  const hdrs = await headers()
  const jurisdiction = (hdrs.get('x-jurisdiction') ?? 'UK') as 'UK' | 'EU' | 'US'
  const rows = await db.listRegulatoryUpdates(jurisdiction)
  const updates: Update[] = rows.map((r) => ({
    id: r.id,
    regulator: r.regulator ?? '',
    jurisdiction: r.jurisdiction,
    title: r.title ?? '',
    summary: r.summary,
    url: r.url ?? '#',
    published_at: r.published_at,
    relevance_score: r.relevance_score,
    affected_rules: r.affected_rules.length > 0 ? r.affected_rules : null,
    created_at: r.created_at,
  }))
  return <MonitoringClient initialUpdates={updates} jurisdiction={jurisdiction} />
}

export default function MonitoringPage() {
  return (
    <Suspense fallback={<MonitoringSkeleton />}>
      <MonitoringContent />
    </Suspense>
  )
}
