// POST /api/admin/set-pulse
// Activates a specific pulse check by id, or 0 to close the survey.
// Supports multiple comma-separated admin keys in ADMIN_KEY env var.
// Body: { pulseCheckId: number, key: string }

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorised(key: string) {
  const adminKeys = (process.env.ADMIN_KEY || '').split(',').map((k) => k.trim())
  return adminKeys.includes(key)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pulseCheckId, key } = body

    if (!isAuthorised(key || '')) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    if (typeof pulseCheckId !== 'number' || pulseCheckId < 0) {
      return NextResponse.json({ error: 'Invalid pulse check id' }, { status: 400 })
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
