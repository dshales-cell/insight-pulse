'use client'

import { useState, useEffect } from 'react'
import { pulseChecks } from '@/lib/pulse-checks'

export default function HomePage() {
  const [activePulseCheck, setActivePulseCheck] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [consentGiven, setConsentGiven] = useState(false)
  const [ageAck, setAgeAck] = useState(false)

  useEffect(() => {
    fetch('/api/active-pulse')
      .then((r) => r.json())
      .then((d) => setActivePulseCheck(d.activePulseCheck))
      .catch(() => setActivePulseCheck(null))
      .finally(() => setLoading(false))
  }, [])

  const currentPulse = activePulseCheck ? pulseChecks.find((p) => p.id === activePulseCheck) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* ── Hero ── */}
      <div className="text-center mb-10">
        <div className="inline-block bg-brand-light text-brand-purple text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
          Weekly Survey Series
        </div>
        <h1 className="text-4xl font-bold text-brand-purple mb-3 leading-tight">
          Insight Pulse
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
          Your voice matters. Every week we ask a handful of questions to build a
          global picture of women's health and wellbeing — and create a mandate for change.
        </p>
      </div>

      {/* ── Current Pulse Check Card ── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading survey…</div>
      ) : !currentPulse ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No active survey right now</h2>
          <p className="text-gray-500 text-sm">
            Check back soon — a new Pulse Check launches every week.
            Sign up for our newsletter below to be notified.
          </p>
          <a
            href="#newsletter"
            className="mt-6 inline-block bg-brand-purple text-white font-medium px-6 py-3 rounded-xl hover:bg-opacity-90"
          >
            Notify me
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-brand-purple to-purple-800 px-8 py-6 text-white">
            <p className="text-sm font-medium text-purple-200 mb-1">{currentPulse.title}</p>
            <h2 className="text-2xl font-bold">{currentPulse.subtitle}</h2>
            <p className="text-sm text-purple-200 mt-2">{currentPulse.intro}</p>
          </div>

          {/* Card Body — Consent */}
          <div className="px-8 py-6 space-y-6">

            <div className="flex items-start gap-3 text-sm text-gray-500">
              <span className="text-brand-pink text-lg">⏱</span>
              <span>Takes about <strong className="text-gray-700">2 minutes</strong> to complete · {currentPulse.questions.length} questions</span>
            </div>

            {/* What we collect */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800">What we collect and why</p>
              <ul className="space-y-1 list-none">
                <li>✅ Your survey answers are stored <strong>anonymously</strong></li>
                <li>✅ Your email address (optional) is kept <strong>separate</strong> from your answers</li>
                <li>✅ We will never sell your data</li>
                <li>✅ We will share the overall findings with all respondents</li>
              </ul>
              <p className="text-xs text-gray-400 pt-1">
                By participating you agree to our{' '}
                <a href="/privacy" target="_blank" className="underline hover:text-brand-pink">
                  Privacy Policy
                </a>
                . We comply with GDPR and global data protection standards.
              </p>
            </div>

            {/* Consent checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand-purple flex-shrink-0"
                />
                <span className="text-sm text-gray-700">
                  I understand how my data will be used and consent to participating in this survey.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageAck}
                  onChange={(e) => setAgeAck(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand-purple flex-shrink-0"
                />
                <span className="text-sm text-gray-700">
                  I confirm I am old enough to make my own decisions about participating in surveys.
                </span>
              </label>
            </div>

            {/* CTA */}
            <a
              href={consentGiven && ageAck ? '/survey' : '#'}
              onClick={(e) => {
                if (!consentGiven || !ageAck) {
                  e.preventDefault()
                  alert('Please tick both boxes above to continue.')
                }
              }}
              className={`block text-center font-semibold text-white px-8 py-4 rounded-xl text-base ${
                consentGiven && ageAck
                  ? 'bg-brand-pink hover:bg-opacity-90 shadow-md'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Begin Survey →
            </a>
          </div>
        </div>
      )}

      {/* ── How It Works ── */}
      <div className="mt-14">
        <h3 className="text-lg font-semibold text-brand-purple mb-5 text-center">How Insight Pulse works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📅', title: 'Weekly Pulse Checks', desc: 'A new 4–6 question survey drops each week, covering a different theme.' },
            { icon: '🔒', title: 'Anonymous by design', desc: 'Your answers are stored separately from your email — we can\'t link them.' },
            { icon: '📊', title: 'Findings shared with you', desc: 'We publish the results and share them with everyone who signs up.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
