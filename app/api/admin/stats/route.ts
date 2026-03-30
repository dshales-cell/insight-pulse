// GET /api/admin/stats
// Returns all pulse checks, response counts, and newsletter subscribers.
// Requires ?key=ADMIN_KEY for basic auth.

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorised(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') || ''
  const adminKeys = (process.env.ADMIN_KEY || '').split(',').map((k) => k.trim())
  return adminKeys.includes(key)
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // All pulse checks from DB
  const { data: allPulseChecks, error: pcError } = await supabase
    .from('pulse_checks')
    .select('id, title, subtitle, created_at')
    .order('id', { ascending: false })

  if (pcError) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // Response counts per pulse check
  const { data: responseCounts } = await supabase
    .from('responses')
    .select('pulse_check_id')

  const counts: Record<number, number> = {}
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
    pulseChecks: allPulseChecks || [],
    responseCounts: counts,
    totalResponses: responseCounts?.length ?? 0,
    newsletterSubscribers: emailCount ?? 0,
    activePulseCheck: setting ? Number(setting.value) : null,
  })
}
