import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ApiError } from '@/types'

export interface FeedResponse {
  updates: {
    id: string
    regulator: string
    title: string
    summary: string | null
    url: string
    published_at: string | null
    relevance_score: number | null
    affected_rules: string[] | null
    created_at: string
  }[]
}

export async function GET(): Promise<NextResponse<FeedResponse | ApiError>> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('regulatory_updates')
    .select('id, regulator, title, summary, url, published_at, relevance_score, affected_rules, created_at')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ updates: data ?? [] })
}
