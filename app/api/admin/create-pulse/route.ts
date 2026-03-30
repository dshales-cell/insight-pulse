// POST /api/admin/create-pulse
// Creates a new pulse check with questions in the database.
// Body: { key, title, subtitle, intro, questions: [{label, text, type, options}] }

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorised(key: string) {
  const adminKeys = (process.env.ADMIN_KEY || '').split(',').map((k) => k.trim())
  return adminKeys.includes(key)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { key, title, subtitle, intro, questions } = body

    if (!isAuthorised(key || '')) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    if (!title?.trim() || !subtitle?.trim() || !intro?.trim()) {
      return NextResponse.json({ error: 'Title, subtitle and intro are required' }, { status: 400 })
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'At least one question is required' }, { status: 400 })
    }

    // Insert the pulse check
    const { data: pc, error: pcError } = await supabase
      .from('pulse_checks')
      .insert({ title: title.trim(), subtitle: subtitle.trim(), intro: intro.trim() })
      .select()
      .single()

    if (pcError || !pc) {
      console.error('Create pulse check error:', pcError)
      return NextResponse.json({ error: 'Failed to create pulse check' }, { status: 500 })
    }

    // Insert questions
    const questionsToInsert = questions.map((q: { label: string; text: string; type: string; options: string[] }, i: number) => ({
      pulse_check_id: pc.id,
      sort_order: i + 1,
      label: q.label?.trim() || '',
      question_text: q.text?.trim() || '',
      question_type: q.type,
      options: q.type === 'binary' ? ['Yes', 'No'] : (q.options || []),
      required: true,
    }))

    const { error: qError } = await supabase.from('pulse_questions').insert(questionsToInsert)

    if (qError) {
      console.error('Create questions error:', qError)
      // Clean up the pulse check we just created
      await supabase.from('pulse_checks').delete().eq('id', pc.id)
      return NextResponse.json({ error: 'Failed to create questions' }, { status: 500 })
    }

    return NextResponse.json({ success: true, pulseCheckId: pc.id })
  } catch (err) {
    console.error('create-pulse error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
