// POST /api/submit-response
// Saves an anonymous survey response to Supabase.
// Body: { pulseCheckId, answers, ageRange, country }

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pulseCheckId, answers, ageRange, country } = body

    // Basic validation
    if (!pulseCheckId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (pulseCheckId < 1 || pulseCheckId > 4) {
      return NextResponse.json({ error: 'Invalid pulse check id' }, { status: 400 })
    }

    const { error } = await supabase.from('responses').insert({
      pulse_check_id: pulseCheckId,
      answers,
      age_range: ageRange || null,
      country: country || null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('submit-response error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
