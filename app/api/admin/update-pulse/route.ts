// POST /api/admin/update-pulse
// Updates an existing pulse check's details and questions.
// Replaces all questions with the new set (delete old, insert new).
// Body: { key, id, title, subtitle, intro, questions: [{id?, label, text, type, options}] }

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorised(key: string) {
  const adminKeys = (process.env.ADMIN_KEY || '').split(',').map((k) => k.trim())
  return adminKeys.includes(key)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { key, id, title, subtitle, intro, questions } = body

    if (!isAuthorised(key || '')) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    if (!id || !title?.trim() || !subtitle?.trim() || !intro?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'At least one question is required' }, { status: 400 })
    }

    // Update the pulse check details
    const { error: pcError } = await supabase
      .from('pulse_checks')
      .update({ title: title.trim(), subtitle: subtitle.trim(), intro: intro.trim() })
      .eq('id', id)

    if (pcError) {
      console.error('Update pulse check error:', pcError)
      return NextResponse.json({ error: 'Failed to update pulse check' }, { status: 500 })
    }

    // Delete all existing questions and replace with the new set
    // This is simpler than trying to diff and is safe for small question sets
    const { error: deleteError } = await supabase
      .from('pulse_questions')
      .delete()
      .eq('pulse_check_id', id)

    if (deleteError) {
      console.error('Delete questions error:', deleteError)
      return NextResponse.json({ error: 'Failed to update questions' }, { status: 500 })
    }

    // Insert the updated questions
    const questionsToInsert = questions.map(
      (q: { label: string; text: string; type: string; options: string[] }, i: number) => ({
        pulse_check_id: id,
        sort_order: i + 1,
        label: q.label?.trim() || '',
        question_text: q.text?.trim() || '',
        question_type: q.type,
        options: q.type === 'binary' ? ['Yes', 'No'] : (q.options || []).filter(Boolean),
        required: true,
      })
    )

    const { error: insertError } = await supabase
      .from('pulse_questions')
      .insert(questionsToInsert)

    if (insertError) {
      console.error('Insert questions error:', insertError)
      return NextResponse.json({ error: 'Failed to save updated questions' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('update-pulse error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
