// GET /api/admin/stats
// Returns response counts per pulse check and total newsletter subscribers.
// Requires ?key=ADMIN_KEY header for basic auth.

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorised(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  return key === process.env.ADMIN_KEY
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Response counts per pulse check
  const { data: responseCounts, error: rcError } = await supabase
    .from('responses')
    .select('pulse_check_id')

  if (rcError) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const row of responseCounts ?? []) {
    counts[row.pulse_check_id] = (counts[row.pulse_check_id] || 0) + 1
  }

  // Newsletter subscribers
  const { count: emailCount } = await supabase
    .from('email_captures')
    .select('*', { count: 'exact', head: true })

  // Currently active pulse check
  const { data: setting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'active_pulse_check')
    .single()

  return NextResponse.json({
    responseCounts: counts,
    totalResponses: responseCounts?.length ?? 0,
    newsletterSubscribers: emailCount ?? 0,
    activePulseCheck: setting ? Number(setting.value) : null,
  })
}
