// GET /api/active-pulse
// Returns the currently active pulse check id (1–4), or null if none is active.

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'active_pulse_check')
    .single()

  if (error || !data) {
    return NextResponse.json({ activePulseCheck: null })
  }

  return NextResponse.json({ activePulseCheck: Number(data.value) })
}
