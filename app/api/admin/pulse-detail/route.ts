// GET /api/admin/pulse-detail?id=1&key=ADMIN_KEY
// Returns a full pulse check with all questions for editing in the admin panel.

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isAuthorised(key: string) {
  const adminKeys = (process.env.ADMIN_KEY || '').split(',').map((k) => k.trim())
  return adminKeys.includes(key)
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') || ''
  const id = req.nextUrl.searchParams.get('id')

  if (!isAuthorised(key)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { data: pc, error: pcError } = await supabase
    .from('pulse_checks')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (pcError || !pc) {
    return NextResponse.json({ error: 'Pulse check not found' }, { status: 404 })
  }

  const { data: questions } = await supabase
    .from('pulse_questions')
    .select('*')
    .eq('pulse_check_id', Number(id))
    .order('sort_order')

  return NextResponse.json({
    pulseCheck: {
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
        sort_order: q.sort_order,
      })),
    },
  })
}
