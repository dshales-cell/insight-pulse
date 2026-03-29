'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ThankYouContent() {
  const params = useSearchParams()
  const pulseId = params.get('pulse')
  const alreadyDone = params.get('already') === '1'

  const [email, setEmail] = useState('')
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Clear the session flag so they can't be blocked from doing future pulse checks
  useEffect(() => {
    // We keep the flag for this session so they can't resubmit the same pulse check,
    // but we don't clear it here — it clears on browser close naturally.
  }, [])

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setSubmitState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pulseCheckId: pulseId ? Number(pulseId) : 0 }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Subscription failed')
      }

      setSubmitState('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitState('error')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">

      {/* Confirmation */}
      <div className="text-6xl mb-6">{alreadyDone ? '👀' : '🎉'}</div>
      <h1 className="text-3xl font-bold text-brand-purple mb-3">
        {alreadyDone ? 'You've already responded!' : 'Thank you!'}
      </h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        {alreadyDone
          ? 'Looks like you've already completed this Pulse Check. Come back next week for the next one.'
          : 'Your response has been recorded. You're helping build a global picture of women\'s health and wellbeing — that really matters.'}
      </p>

      {!alreadyDone && (
        <div className="bg-brand-light border border-purple-100 rounded-2xl px-6 py-5 mb-10 text-left">
          <p className="text-sm font-semibold text-brand-purple mb-1">What happens next?</p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>We'll compile the findings from this Pulse Check</li>
            <li>Results will be shared via our newsletter</li>
            <li>A new Pulse Check launches every week</li>
          </ul>
        </div>
      )}

      {/* Newsletter signup */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-left">

        {submitState === 'success' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✉️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">You're signed up!</h3>
            <p className="text-sm text-gray-500">
              We'll send you the survey findings and a weekly newsletter. You can unsubscribe at any time.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Become a Founding Participant
                </h3>
                <p className="text-sm text-gray-500">
                  Sign up for our free newsletter and we'll send you the survey findings,
                  plus weekly insights on women's health and wellbeing.
                  <strong className="text-gray-700"> Completely optional.</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:outline-none"
              />

              <p className="text-xs text-gray-400">
                Your email is kept separate from your survey answers — we cannot link them.
                Powered by Beehiiv. Unsubscribe any time.
              </p>

              {submitState === 'error' && (
                <p className="text-red-500 text-xs">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="w-full bg-brand-purple text-white font-semibold py-3 rounded-xl text-sm hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitState === 'loading' ? 'Signing up…' : 'Sign me up for findings & newsletter →'}
              </button>
            </form>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 py-2"
            >
              No thanks, take me back to the home page
            </button>
          </>
        )}
      </div>

      {submitState === 'success' && (
        <a href="/" className="inline-block mt-8 text-sm text-brand-purple underline">
          ← Back to home
        </a>
      )}
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading…</div>}>
      <ThankYouContent />
    </Suspense>
  )
}
