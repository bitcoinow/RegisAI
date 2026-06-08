import { Suspense } from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { RiskBadge } from '@/components/ui/risk-badge'
import { SkeletonCard } from '@/components/ui/skeleton'
import type { RiskLevel } from '@/types'

interface AuditRow {
  id: string
  firm_name: string
  total_gaps: number
  high_risk: number
  medium_risk: number
  low_risk: number
  jurisdiction: string
  created_at: string
}

function JurisdictionBadge({ jurisdiction }: { jurisdiction: string }) {
  const colorMap: Record<string, string> = {
    US: 'var(--ink-3)',
    EU: 'var(--blue)',
    UK: 'var(--gold)',
  }
  const color = colorMap[jurisdiction] ?? 'var(--ink-3)'
  return (
    <span
      className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 border"
      style={{ color, borderColor: color }}
    >
      {jurisdiction}
    </span>
  )
}

function dominantRisk(row: AuditRow): RiskLevel {
  if (row.high_risk > 0) return 'High'
  if (row.medium_risk > 0) return 'Medium'
  return 'Low'
}

function DashboardSkeleton() {
  return (
    <div className="max-w-content mx-auto px-6 py-10">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  )
}

async function DashboardContent() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')
  if (!userId) return null

  const audits = await db.listAudits(userId)
  const rows = audits as AuditRow[]

  return (
    <div className="max-w-content mx-auto px-6 py-10">

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">Compliance Audits</h1>
        </div>
        <Link
          href="/audit/new"
          className="bg-green text-white text-sm px-5 py-2.5 hover:bg-green-2 transition-colors"
        >
          New Audit
        </Link>
      </div>

      {/* ── Audit table ────────────────────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="border border-rule bg-bg-2 p-16 text-center">
          <p className="font-serif text-2xl text-ink mb-2">No audits yet</p>
          <p className="text-ink-3 text-sm mb-6">
            Upload a compliance manual to run your first gap analysis.
          </p>
          <Link
            href="/audit/new"
            className="inline-block bg-green text-white text-sm px-6 py-2.5 hover:bg-green-2 transition-colors"
          >
            Run First Audit
          </Link>
        </div>
      ) : (
        <div className="border border-rule overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-bg-2">
                <th className="text-left px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  Firm
                </th>
                <th className="text-left px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  Date
                </th>
                <th className="text-center px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  Gaps
                </th>
                <th className="text-left px-5 py-3 font-mono text-xs tracking-widest uppercase text-ink-3">
                  Risk
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((audit, i) => (
                <tr
                  key={audit.id}
                  className={`border-b border-rule last:border-b-0 hover:bg-bg-2 transition-colors ${
                    i % 2 === 0 ? 'bg-bg' : 'bg-bg-2'
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-medium">{audit.firm_name}</span>
                      <JurisdictionBadge jurisdiction={audit.jurisdiction ?? 'US'} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-3 font-mono text-xs">
                    {new Date(audit.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4 text-center font-serif text-lg text-ink">
                    {audit.total_gaps}
                  </td>
                  <td className="px-5 py-4">
                    <RiskBadge risk={dominantRisk(audit)} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/audit/${audit.id}`}
                      className="text-green text-xs font-mono tracking-wide hover:underline"
                    >
                      View Report →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
