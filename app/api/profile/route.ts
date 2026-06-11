import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Profile, FirmType, Regulator } from '@/types'

const VALID_FIRM_TYPES: FirmType[] = [
  'Financial Services',
  'Professional Services',
  'Technology',
  'Public Sector',
  'Other',
]
const VALID_REGULATORS: Regulator[] = ['FCA', 'ICO', 'Multiple', 'None / Other']

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { firm_name?: unknown; firm_type?: unknown; aum_range?: unknown; regulator?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { firm_name, firm_type, aum_range, regulator } = body

  if (
    typeof firm_name !== 'string' || firm_name.trim().length === 0 ||
    !VALID_FIRM_TYPES.includes(firm_type as FirmType) ||
    typeof aum_range !== 'string' || aum_range.trim().length === 0 ||
    !VALID_REGULATORS.includes(regulator as Regulator)
  ) {
    return NextResponse.json({ error: 'Invalid profile fields' }, { status: 400 })
  }

  const { data: profile, error: updateError } = await supabase
    .from('profiles')
    .update({
      firm_name: firm_name.trim(),
      firm_type: firm_type as FirmType,
      aum_range: aum_range.trim(),
      regulator: regulator as Regulator,
    })
    .eq('id', user.id)
    .select()
    .single()

  if (updateError || !profile) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json(profile as Profile)
}
