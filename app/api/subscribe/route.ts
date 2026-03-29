// POST /api/subscribe
// Saves email to Supabase and subscribes to Beehiiv newsletter.
// Body: { email, pulseCheckId }

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { subscribeToNewsletter } from '@/lib/beehiiv'

// Simple email format check
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, pulseCheckId } = body

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // 1. Subscribe via Beehiiv API
    const beehiivResult = await subscribeToNewsletter(email.toLowerCase().trim())

    // 2. Save to our own database regardless of Beehiiv result
    //    (so we never lose an email even if Beehiiv is down)
    const { error: dbError } = await supabase.from('email_captures').insert({
      email: email.toLowerCase().trim(),
      pulse_check_id: pulseCheckId || 0,
      beehiiv_synced: beehiivResult.success,
      beehiiv_error: beehiivResult.error || null,
    })

    if (dbError) {
      console.error('Email capture DB error:', dbError)
      // Don't fail the request — the Beehiiv subscription may have worked
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('subscribe error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
