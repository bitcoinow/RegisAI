import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { fetchAndParseFeeds } from '@/lib/monitoring'
import type { ApiError } from '@/types'

export async function POST(): Promise<NextResponse<{ inserted: number; parsed: number } | ApiError>> {
  const userClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updates = await fetchAndParseFeeds()

  if (updates.length === 0) {
    return NextResponse.json({ inserted: 0, parsed: 0 })
  }

  const serviceClient = await createServiceClient()
  const { error } = await serviceClient
    .from('regulatory_updates')
    .upsert(updates, { onConflict: 'url', ignoreDuplicates: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: updates.length, parsed: updates.length })
}
