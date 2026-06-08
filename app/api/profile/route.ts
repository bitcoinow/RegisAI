import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { Profile, FirmType, Regulator } from '@/types'

const VALID_FIRM_TYPES: FirmType[] = ['RIA', 'Fintech', 'Insurance', 'Bank']
const VALID_REGULATORS: Regulator[] = ['FINRA', 'SEC', 'State', 'Multiple']

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const userId = request.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { firm_name?: unknown; firm_type?: unknown; aum_range?: unknown; regulator?: unknown }
  try {
    body = (await request.json()) as typeof body
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

  await db.updateProfile(userId, {
    firm_name: firm_name.trim(),
    firm_type: firm_type as FirmType,
    aum_range: aum_range.trim(),
    regulator: regulator as Regulator,
  })

  const profile = await db.getProfile(userId)
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json(profile as unknown as Profile)
}
