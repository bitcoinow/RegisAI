import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fetchAndParseFeeds } from '@/lib/monitoring'
import type { ApiError } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<{ inserted: number; parsed: number } | ApiError>> {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updates = await fetchAndParseFeeds()

  if (updates.length === 0) {
    return NextResponse.json({ inserted: 0, parsed: 0 })
  }

  try {
    await db.upsertRegulatoryUpdates(updates.map(u => ({
      ...u,
      published_at: u.published_at ?? undefined,
    })))
    return NextResponse.json({ inserted: updates.length, parsed: updates.length })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
