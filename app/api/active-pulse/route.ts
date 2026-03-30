// GET /api/active-pulse
// Returns the full active pulse check (title, questions, etc.) from the database,
// or { activePulseCheck: null } if no pulse check is active.

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: setting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'active_pulse_check')
    .single()

  if (!setting || setting.value === '0') {
    return NextResponse.json({ activePulseCheck: null })
  }

  const id = Number(setting.value)

  const { data: pc } = await supabase
    .from('pulse_checks')
    .select('*')
    .eq('id', id)
    .single()

  if (!pc) {
    return NextResponse.json({ activePulseCheck: null })
  }

  const { data: questions } = await supabase
    .from('pulse_questions')
    .select('*')
    .eq('pulse_check_id', id)
    .order('sort_order')

  return NextResponse.json({
    activePulseCheck: {
      id: pc.id,
      title: pc.title,
      subtitle: pc.subtitle,
      intro: pc.intro,
      questions: (questions || []).map((q) => ({
        id: q.id,
        label: q.label,
        text: q.question_text,
        type: q.question_type,
        options: q.options,
        required: q.required,
      })),
    },
  })
}
