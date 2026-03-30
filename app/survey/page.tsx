'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = 'scale' | 'ranked_choice' | 'multi_select' | 'single_choice' | 'binary'

interface Question {
  id: string
  label: string
  text: string
  type: QuestionType
  options: string[]
  required?: boolean
}

interface PulseCheck {
  id: number
  title: string
  subtitle: string
  intro: string
  questions: Question[]
}

// ─── Demographics options ──────────────────────────────────────────────────────

const AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+', 'Prefer not to say']

const COUNTRIES = [
  'United Kingdom', 'United States', 'Australia', 'Canada', 'Ireland', 'New Zealand',
  'Germany', 'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Spain', 'Italy',
  'India', 'Singapore', 'South Africa', 'Nigeria', 'Kenya', 'Brazil', 'Mexico', 'Other',
]

// ─── Question components ───────────────────────────────────────────────────────

function ScaleQuestion({ question, value, onChange }: { question: Question; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      {question.options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
            value === opt ? 'border-brand-purple bg-brand-light text-brand-purple' : 'border-gray-200 bg-white text-gray-700 hover:border-brand-muted hover:bg-gray-50'
          }`}>
          <span className="inline-flex items-center gap-3">
            <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${value === opt ? 'border-brand-purple bg-brand-purple' : 'border-gray-300'}`}>
              {value === opt && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
            {opt}
          </span>
        </button>
      ))}
    </div>
  )
}

const SingleChoiceQuestion = ScaleQuestion

function MultiSelectQuestion({ question, value, onChange }: { question: Question; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => onChange(value.includes(opt) ? value.filter((x) => x !== opt) : [...value, opt])
  return (
    <div className="space-y-3">
      {question.options.map((opt) => {
        const selected = value.includes(opt)
        return (
          <button key={opt} onClick={() => toggle(opt)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
              selected ? 'border-brand-purple bg-brand-light text-brand-purple' : 'border-gray-200 bg-white text-gray-700 hover:border-brand-muted hover:bg-gray-50'
            }`}>
            <span className="inline-flex items-center gap-3">
              <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'border-brand-purple bg-brand-purple' : 'border-gray-300'}`}>
                {selected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {opt}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function BinaryQuestion({ question, value, onChange }: { question: Question; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-4">
      {question.options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`flex-1 py-6 rounded-xl border-2 text-lg font-bold transition-all ${
            value === opt ? 'border-brand-purple bg-brand-purple text-white shadow-md' : 'border-gray-200 bg-white text-gray-700 hover:border-brand-purple hover:bg-brand-light'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  )
}

function RankedChoiceQuestion({ question, value, onChange }: { question: Question; value: string[]; onChange: (v: string[]) => void }) {
  const rank = (opt: string) => value.indexOf(opt) + 1
  const handleClick = (opt: string) => {
    if (rank(opt)) onChange(value.filter((x) => x !== opt))
    else onChange([...value, opt])
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 mb-1">Click each option in order of importance (1 = most important). Click again to remove.</p>
      {question.options.map((opt) => {
        const r = rank(opt)
        return (
          <button key={opt} onClick={() => handleClick(opt)}
            className={`ranked-item w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
              r > 0 ? 'border-brand-purple bg-brand-light text-brand-purple' : 'border-gray-200 bg-white text-gray-700 hover:border-brand-muted hover:bg-gray-50'
            }`}>
            <span className="inline-flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${r > 0 ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-400'}`}>
                {r > 0 ? r : '–'}
              </span>
              {opt}
            </span>
          </button>
        )
      })}
      {value.length === question.options.length && (
        <p className="text-xs text-green-600 font-medium pt-1">✓ All options ranked</p>
      )}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'closed' | 'survey' | 'demographics' | 'submitting' | 'error'

export default function SurveyPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [pulse, setPulse] = useState<PulseCheck | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [ageRange, setAgeRange] = useState('')
  const [country, setCountry] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const done = sessionStorage.getItem('insight_pulse_done')
    if (done) { router.push('/thank-you?already=1'); return }

    fetch('/api/active-pulse')
      .then((r) => r.json())
      .then((d) => {
        if (!d.activePulseCheck) { setPhase('closed'); return }
        setPulse(d.activePulseCheck)
        setPhase('survey')
      })
      .catch(() => setPhase('error'))
  }, [router])

  if (phase === 'loading') return <div className="flex items-center justify-center min-h-64 text-gray-400">Loading…</div>
  if (phase === 'closed') return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No active survey right now</h2>
      <p className="text-gray-500 text-sm mb-6">Check back soon for the next survey.</p>
      <a href="/" className="text-brand-purple underline text-sm">← Back to home</a>
    </div>
  )
  if (phase === 'error') return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
      <a href="/" className="text-brand-purple underline text-sm">← Back to home</a>
    </div>
  )
  if (!pulse) return null

  const questions = pulse.questions
  const totalSteps = questions.length + 1
  const currentQ = questions[step]
  const progress = phase === 'demographics'
    ? Math.round((questions.length / totalSteps) * 100)
    : Math.round((step / totalSteps) * 100)

  function getCurrentAnswer() { return answers[currentQ?.id] }

  function isCurrentAnswerValid(): boolean {
    if (phase === 'demographics') return ageRange !== '' && country !== ''
    const ans = getCurrentAnswer()
    if (!currentQ?.required) return true
    if (currentQ.type === 'multi_select') return Array.isArray(ans) && ans.length > 0
    if (currentQ.type === 'ranked_choice') return Array.isArray(ans) && ans.length === currentQ.options.length
    return ans !== undefined && ans !== '' && ans !== null
  }

  function handleAnswer(value: unknown) { setAnswers((prev) => ({ ...prev, [currentQ.id]: value })) }

  function handleNext() {
    if (step < questions.length - 1) setStep((s) => s + 1)
    else setPhase('demographics')
  }

  function handleBack() {
    if (phase === 'demographics') { setPhase('survey'); setStep(questions.length - 1) }
    else if (step > 0) setStep((s) => s - 1)
    else router.push('/')
  }

  async function handleSubmit() {
    setPhase('submitting' as Phase)
    try {
      const res = await fetch('/api/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pulseCheckId: pulse!.id, answers, ageRange, country }),
      })
      if (!res.ok) throw new Error('Server error')
      sessionStorage.setItem('insight_pulse_done', '1')
      router.push(`/thank-you?pulse=${pulse!.id}`)
    } catch {
      setErrorMsg('Sorry, something went wrong. Please try again.')
      setPhase('demographics')
    }
  }

  function renderQuestion(q: Question) {
    const answer = answers[q.id]
    switch (q.type) {
      case 'scale': return <ScaleQuestion question={q} value={(answer as string) || ''} onChange={handleAnswer} />
      case 'single_choice': return <SingleChoiceQuestion question={q} value={(answer as string) || ''} onChange={handleAnswer} />
      case 'multi_select': return <MultiSelectQuestion question={q} value={(answer as string[]) || []} onChange={handleAnswer} />
      case 'binary': return <BinaryQuestion question={q} value={(answer as string) || ''} onChange={handleAnswer} />
      case 'ranked_choice': return <RankedChoiceQuestion question={q} value={(answer as string[]) || []} onChange={handleAnswer} />
      default: return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{pulse.title} · {pulse.subtitle}</span>
          <span>{phase === 'demographics' ? `${questions.length + 1} of ${totalSteps}` : `${step + 1} of ${totalSteps}`}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-brand-pink h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {phase === 'demographics' ? (
          <div>
            <p className="text-xs font-semibold text-brand-pink uppercase tracking-wide mb-1">Almost done</p>
            <h2 className="text-xl font-bold text-gray-800 mb-6">A couple of quick questions about you</h2>
            <p className="text-xs text-gray-400 mb-6">These help us understand our respondents better. Both fields are required.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What is your age range?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AGE_RANGES.map((age) => (
                    <button key={age} onClick={() => setAgeRange(age)}
                      className={`py-2.5 px-3 rounded-lg border-2 text-xs font-medium transition-all ${
                        ageRange === age ? 'border-brand-purple bg-brand-light text-brand-purple' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {age}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Which country are you based in?</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-brand-purple focus:outline-none">
                  <option value="">Select your country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {errorMsg && <p className="text-red-500 text-sm mt-4">{errorMsg}</p>}
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-brand-pink uppercase tracking-wide mb-1">{currentQ?.label}</p>
            <h2 className="text-xl font-bold text-gray-800 mb-6 leading-snug">{currentQ?.text}</h2>
            {currentQ && renderQuestion(currentQ)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button onClick={handleBack} className="text-sm text-gray-400 hover:text-gray-600 font-medium px-4 py-2">← Back</button>
        {phase === 'demographics' ? (
          <button onClick={handleSubmit} disabled={!isCurrentAnswerValid()}
            className={`font-semibold text-white px-8 py-3 rounded-xl text-sm transition-all ${
              isCurrentAnswerValid() ? 'bg-brand-pink hover:bg-opacity-90 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            Submit my answers →
          </button>
        ) : (
          <button onClick={handleNext} disabled={!isCurrentAnswerValid()}
            className={`font-semibold text-white px-8 py-3 rounded-xl text-sm transition-all ${
              isCurrentAnswerValid() ? 'bg-brand-purple hover:bg-opacity-90 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
