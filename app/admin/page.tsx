'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type QuestionType = 'scale' | 'ranked_choice' | 'multi_select' | 'single_choice' | 'binary'

interface PulseCheckMeta {
  id: number
  title: string
  subtitle: string
  created_at: string
}

interface Stats {
  pulseChecks: PulseCheckMeta[]
  responseCounts: Record<number, number>
  totalResponses: number
  newsletterSubscribers: number
  activePulseCheck: number | null
}

interface NewQuestion {
  label: string
  text: string
  type: QuestionType
  options: string[]
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  scale: '5-point Scale',
  ranked_choice: 'Ranked Choice',
  multi_select: 'Multi-select (tick all that apply)',
  single_choice: 'Single Choice',
  binary: 'Yes / No',
}

const TYPES_WITH_OPTIONS: QuestionType[] = ['scale', 'ranked_choice', 'multi_select', 'single_choice']

// ─── Create Pulse Check Form ───────────────────────────────────────────────────

function CreatePulseCheckForm({ adminKey, onCreated }: { adminKey: string; onCreated: (id: number) => void }) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [intro, setIntro] = useState('')
  const [questions, setQuestions] = useState<NewQuestion[]>([
    { label: '', text: '', type: 'scale', options: ['', '', '', '', ''] },
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addQuestion() {
    setQuestions((prev) => [...prev, { label: '', text: '', type: 'scale', options: ['', '', '', '', ''] }])
  }

  function removeQuestion(i: number) {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateQuestion(i: number, field: keyof NewQuestion, value: string | string[] | QuestionType) {
    setQuestions((prev) => prev.map((q, idx) => {
      if (idx !== i) return q
      if (field === 'type') {
        const type = value as QuestionType
        const options = type === 'binary' ? ['Yes', 'No']
          : type === 'scale' ? ['', '', '', '', '']
          : ['', '']
        return { ...q, type, options }
      }
      return { ...q, [field]: value }
    }))
  }

  function updateOption(qi: number, oi: number, value: string) {
    setQuestions((prev) => prev.map((q, idx) => {
      if (idx !== qi) return q
      const options = [...q.options]
      options[oi] = value
      return { ...q, options }
    }))
  }

  function addOption(qi: number) {
    setQuestions((prev) => prev.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ''] } : q))
  }

  function removeOption(qi: number, oi: number) {
    setQuestions((prev) => prev.map((q, idx) => {
      if (idx !== qi) return q
      return { ...q, options: q.options.filter((_, i) => i !== oi) }
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/create-pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: adminKey,
          title,
          subtitle,
          intro,
          questions: questions.map((q) => ({
            ...q,
            options: q.type === 'binary' ? ['Yes', 'No'] : q.options.filter(Boolean),
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create')
      onCreated(data.pulseCheckId)
      // Reset form
      setTitle(''); setSubtitle(''); setIntro('')
      setQuestions([{ label: '', text: '', type: 'scale', options: ['', '', '', '', ''] }])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pulse Check details */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title <span className="text-gray-400 normal-case font-normal">(e.g. "Pulse Check 5")</span></label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-purple focus:outline-none"
            placeholder="Pulse Check 5" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Subtitle <span className="text-gray-400 normal-case font-normal">(short theme name)</span></label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-purple focus:outline-none"
            placeholder="The Workplace" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Intro text <span className="text-gray-400 normal-case font-normal">(shown at top of survey)</span></label>
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} required rows={2}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-purple focus:outline-none resize-none"
            placeholder="Tell us about your experience in the workplace…" />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Questions</p>
        {questions.map((q, qi) => (
          <div key={qi} className="border-2 border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-purple">Question {qi + 1}</span>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qi)}
                  className="text-xs text-red-400 hover:text-red-600">Remove</button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Label <span className="text-gray-400">(short tag, e.g. "The Priority")</span></label>
                <input value={q.label} onChange={(e) => updateQuestion(qi, 'label', e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-brand-purple focus:outline-none"
                  placeholder="The Priority" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Response type</label>
                <select value={q.type} onChange={(e) => updateQuestion(qi, 'type', e.target.value as QuestionType)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-brand-purple focus:outline-none">
                  {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((t) => (
                    <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Question text</label>
              <textarea value={q.text} onChange={(e) => updateQuestion(qi, 'text', e.target.value)} required rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-brand-purple focus:outline-none resize-none"
                placeholder="What do you think about…?" />
            </div>

            {/* Options */}
            {q.type === 'binary' && (
              <p className="text-xs text-gray-400 italic">Fixed options: Yes / No</p>
            )}
            {q.type === 'scale' && (
              <div>
                <label className="block text-xs text-gray-500 mb-2">Scale labels (first → last, 5 required)</label>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">{oi + 1}</span>
                      <input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} required
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:border-brand-purple focus:outline-none"
                        placeholder={oi === 0 ? 'e.g. Strongly agree' : oi === 4 ? 'e.g. Strongly disagree' : ''} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {TYPES_WITH_OPTIONS.includes(q.type) && q.type !== 'scale' && (
              <div>
                <label className="block text-xs text-gray-500 mb-2">Options</label>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} required
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:border-brand-purple focus:outline-none"
                        placeholder={`Option ${oi + 1}`} />
                      {q.options.length > 2 && (
                        <button type="button" onClick={() => removeOption(qi, oi)}
                          className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qi)}
                    className="text-xs text-brand-purple hover:underline mt-1">+ Add option</button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button type="button" onClick={addQuestion}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-brand-purple hover:text-brand-purple transition-all">
          + Add question
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={saving}
        className="w-full bg-brand-purple text-white font-semibold py-3 rounded-xl text-sm hover:bg-opacity-90 disabled:opacity-50">
        {saving ? 'Creating…' : 'Create Pulse Check →'}
      </button>
    </form>
  )
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [key, setKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const fetchStats = useCallback(async (adminKey: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/stats?key=${encodeURIComponent(adminKey)}`)
      if (res.status === 401) { setAuthed(false); setMessage('Incorrect password.'); return }
      if (!res.ok) { setAuthed(false); setMessage(`Server error (${res.status}) — check your Supabase environment variables in Vercel.`); return }
      setStats(await res.json())
      setAuthed(true)
    } catch { setMessage('Could not connect to the server.') }
    finally { setLoading(false) }
  }, [])

  async function handleLogin(e: React.FormEvent) { e.preventDefault(); await fetchStats(key) }

  async function activatePulse(pulseId: number) {
    setMessage('')
    const res = await fetch('/api/admin/set-pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pulseCheckId: pulseId, key }),
    })
    const data = await res.json()
    setMessage(data.message || data.error || '')
    fetchStats(key)
  }

  useEffect(() => {
    if (!authed) return
    const interval = setInterval(() => fetchStats(key), 30_000)
    return () => clearInterval(interval)
  }, [authed, key, fetchStats])

  // Sort: active first, then by id descending
  const sortedPulseChecks = [...(stats?.pulseChecks || [])].sort((a, b) => {
    if (a.id === stats?.activePulseCheck) return -1
    if (b.id === stats?.activePulseCheck) return 1
    return b.id - a.id
  })
  const visiblePulseChecks = showAll ? sortedPulseChecks : sortedPulseChecks.slice(0, 4)
  const hasMore = sortedPulseChecks.length > 4

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="WHW" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold text-brand-purple">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Insight Pulse · Women&apos;s Health World</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={key} onChange={(e) => setKey(e.target.value)}
              placeholder="Admin password" required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:outline-none" />
            {message && <p className="text-red-500 text-sm">{message}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-brand-purple text-white font-semibold py-3 rounded-xl text-sm hover:bg-opacity-90 disabled:opacity-50">
              {loading ? 'Checking…' : 'Login →'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL || 'hello@womenshealth.world'}?subject=Insight%20Pulse%20Admin%20Password&body=Hi%2C%20could%20you%20share%20the%20Insight%20Pulse%20admin%20password%20please%3F`}
              className="text-xs text-gray-400 hover:text-brand-purple underline">
              Forgot password? Email the admin →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-purple">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">Insight Pulse · Women&apos;s Health World</p>
        </div>
        <button onClick={() => fetchStats(key)}
          className="text-xs text-brand-purple border border-brand-purple rounded-lg px-3 py-1.5 hover:bg-brand-light">
          ↻ Refresh
        </button>
      </div>

      {/* Stats overview */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-brand-purple">{stats.totalResponses}</p>
            <p className="text-xs text-gray-400 mt-1">Total Responses</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-brand-pink">{stats.newsletterSubscribers}</p>
            <p className="text-xs text-gray-400 mt-1">Subscribers</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-gray-700">
              {stats.activePulseCheck ? `#${stats.activePulseCheck}` : 'None'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Active Survey</p>
          </div>
        </div>
      )}

      {/* Pulse Check list */}
      <div className="space-y-3 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Surveys</h2>

        {visiblePulseChecks.map((pc) => {
          const isActive = stats?.activePulseCheck === pc.id
          const count = stats?.responseCounts?.[pc.id] ?? 0
          return (
            <div key={pc.id}
              className={`bg-white border-2 rounded-xl p-4 flex items-center justify-between ${isActive ? 'border-brand-purple' : 'border-gray-200'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{pc.title}: {pc.subtitle}</span>
                  {isActive && <span className="text-xs bg-brand-purple text-white px-2 py-0.5 rounded-full">LIVE</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{count} response{count !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => activatePulse(pc.id)} disabled={isActive}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                  isActive ? 'bg-brand-light text-brand-purple cursor-default' : 'bg-brand-purple text-white hover:bg-opacity-90'
                }`}>
                {isActive ? 'Active' : 'Activate'}
              </button>
            </div>
          )
        })}

        {hasMore && (
          <button onClick={() => setShowAll((v) => !v)}
            className="w-full py-2.5 text-xs text-gray-400 hover:text-brand-purple border border-gray-200 rounded-xl hover:border-brand-purple transition-all">
            {showAll ? '↑ Show fewer surveys' : `↓ Show ${sortedPulseChecks.length - 4} more survey${sortedPulseChecks.length - 4 !== 1 ? 's' : ''}`}
          </button>
        )}

        {/* Close survey */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">Close survey</span>
            <p className="text-xs text-gray-400 mt-0.5">No survey will be shown to visitors</p>
          </div>
          <button onClick={() => activatePulse(0)} disabled={!stats?.activePulseCheck}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-all">
            Close
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">{message}</div>
      )}

      {/* Response bar chart */}
      {stats && stats.pulseChecks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Responses by Survey</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {sortedPulseChecks.map((pc, i) => {
              const count = stats.responseCounts?.[pc.id] ?? 0
              const max = Math.max(...Object.values(stats.responseCounts), 1)
              return (
                <div key={pc.id} className={`px-5 py-3 flex items-center gap-4 ${i < sortedPulseChecks.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-xs text-gray-400 w-20 flex-shrink-0 truncate">{pc.title}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-brand-purple h-2 rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Create new pulse check */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden">
        <button onClick={() => setShowCreateForm((v) => !v)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-all">
          <div>
            <p className="font-semibold text-gray-800 text-sm">Create a new survey</p>
            <p className="text-xs text-gray-400">Build a new Pulse Check with custom questions</p>
          </div>
          <span className="text-brand-purple text-xl font-light">{showCreateForm ? '−' : '+'}</span>
        </button>
        {showCreateForm && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="pt-4">
              <CreatePulseCheckForm
                adminKey={key}
                onCreated={(id) => {
                  setMessage(`Pulse Check created (ID: ${id}). You can now activate it above.`)
                  setShowCreateForm(false)
                  fetchStats(key)
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Data export note */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">Exporting data</p>
        <p>
          Log in to your{' '}
          <a href="https://supabase.com" target="_blank" className="underline text-brand-purple">Supabase dashboard</a>
          {' '}→ Table Editor → select <code>responses</code> or <code>email_captures</code> → click <strong>Export CSV</strong>.
        </p>
      </div>
    </div>
  )
}
