// POST /api/admin/set-pulse
// Activates a specific pulse check (1–4) or sets to 0 to close the survey.
// Body: { pulseCheckId: number, key: string }

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pulseCheckId, key } = body

    if (key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    if (pulseCheckId < 0 || pulseCheckId > 4) {
      return NextResponse.json({ error: 'Invalid pulse check id (must be 0–4)' }, { status: 400 })
    }

    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'active_pulse_check', value: String(pulseCheckId), updated_at: new Date().toISOString() })

    if (error) {
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: pulseCheckId === 0
        ? 'Survey is now closed'
        : `Pulse Check ${pulseCheckId} is now active`,
    })
  } catch (err) {
    console.error('set-pulse error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
