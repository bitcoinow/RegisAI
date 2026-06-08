import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiError } from '@/types'

export interface FeedResponse {
  updates: {
    id: string
    regulator: string
    jurisdiction: string
    title: string
    summary: string | null
    url: string
    published_at: string | null
    relevance_score: number | null
    affected_rules: string[] | null
    created_at: string
  }[]
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jurisdiction = searchParams.get('jurisdiction') ?? undefined

  try {
    const updates = await db.listRegulatoryUpdates(jurisdiction)
    return NextResponse.json({ updates })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
