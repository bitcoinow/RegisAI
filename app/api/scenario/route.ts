import { NextRequest, NextResponse } from 'next/server'
import { runScenarioAnalysis } from '@/lib/claude'
import { SCENARIO_MAX_CHARS } from '@/lib/scenario'
import { createClient } from '@/lib/supabase/server'
import type { ApiError, ScenarioResult } from '@/types'

// Stateless scenario risk analysis — no DB writes. Per-user history is a
// later phase (see plan: scenarios table + RLS).
export async function POST(
  req: NextRequest
): Promise<NextResponse<ScenarioResult | ApiError>> {
  let scenario: string
  try {
    const body = (await req.json()) as { scenario?: unknown }
    if (typeof body.scenario !== 'string' || body.scenario.trim().length === 0) {
      return NextResponse.json({ error: 'scenario is required' }, { status: 400 })
    }
    scenario = body.scenario.trim()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (scenario.length > SCENARIO_MAX_CHARS) {
    return NextResponse.json(
      { error: `Scenario must be ${SCENARIO_MAX_CHARS.toLocaleString()} characters or fewer.` },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runScenarioAnalysis(scenario)
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('Scenario analysis failed:', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
