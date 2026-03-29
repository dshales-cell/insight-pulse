'use client'

import { useState, useEffect, useCallback } from 'react'
import { pulseChecks } from '@/lib/pulse-checks'

interface Stats {
  responseCounts: Record<number, number>
  totalResponses: number
  newsletterSubscribers: number
  activePulseCheck: number | null
}

export default function AdminPage() {
  const [key, setKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchStats = useCallback(async (adminKey: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/stats?key=${encodeURIComponent(adminKey)}`)
      if (!res.ok) {
        setAuthed(false)
        setMessage('Incorrect password.')
        return
      }
      const data = await res.json()
      setStats(data)
      setAuthed(true)
    } catch {
      setMessage('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    await fetchStats(key)
  }

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

  // Auto-refresh stats every 30 seconds when authed
  useEffect(() => {
    if (!authed) return
    const interval = setInterval(() => fetchStats(key), 30_000)
    return () => clearInterval(interval)
  }, [authed, key, fetchStats])

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-brand-purple mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mb-6">Enter your admin password to continue.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Admin password"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:outline-none"
              required
            />
            {message && <p className="text-red-500 text-sm">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple text-white font-semibold py-3 rounded-xl text-sm hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? 'Checking…' : 'Login →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-purple">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">Insight Pulse · Women's Health World</p>
        </div>
        <button
          onClick={() => fetchStats(key)}
          className="text-xs text-brand-purple border border-brand-purple rounded-lg px-3 py-1.5 hover:bg-brand-light"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Stats overview ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-brand-purple">{stats.totalResponses}</p>
            <p className="text-xs text-gray-400 mt-1">Total Responses</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-brand-pink">{stats.newsletterSubscribers}</p>
            <p className="text-xs text-gray-400 mt-1">Newsletter Subscribers</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm col-span-2 sm:col-span-1">
            <p className="text-3xl font-bold text-gray-700">
              {stats.activePulseCheck ? `PC${stats.activePulseCheck}` : 'None'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Active Pulse Check</p>
          </div>
        </div>
      )}

      {/* ── Pulse Check controls ── */}
      <div className="space-y-3 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Activate a Pulse Check</h2>
        {pulseChecks.map((pc) => {
          const isActive = stats?.activePulseCheck === pc.id
          const count = stats?.responseCounts?.[pc.id] ?? 0
          return (
            <div
              key={pc.id}
              className={`bg-white border-2 rounded-xl p-4 flex items-center justify-between ${
                isActive ? 'border-brand-purple' : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {pc.title}: {pc.subtitle}
                  </span>
                  {isActive && (
                    <span className="text-xs bg-brand-purple text-white px-2 py-0.5 rounded-full">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {count} response{count !== 1 ? 's' : ''} · {pc.questions.length} questions
                </p>
              </div>
              <button
                onClick={() => activatePulse(pc.id)}
                disabled={isActive}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-brand-light text-brand-purple cursor-default'
                    : 'bg-brand-purple text-white hover:bg-opacity-90'
                }`}
              >
                {isActive ? 'Active' : 'Activate'}
              </button>
            </div>
          )
        })}

        {/* Close survey option */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">Close survey</span>
            <p className="text-xs text-gray-400 mt-0.5">No pulse check will be shown to visitors</p>
          </div>
          <button
            onClick={() => activatePulse(0)}
            disabled={stats?.activePulseCheck === null || stats?.activePulseCheck === 0}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-all"
          >
            Close
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
          {message}
        </div>
      )}

      {/* ── Response counts per pulse check ── */}
      {stats && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Responses by Pulse Check
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {pulseChecks.map((pc, i) => {
              const count = stats.responseCounts?.[pc.id] ?? 0
              const max = Math.max(...Object.values(stats.responseCounts), 1)
              return (
                <div
                  key={pc.id}
                  className={`px-5 py-3 flex items-center gap-4 ${
                    i < pulseChecks.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-xs text-gray-400 w-24 flex-shrink-0">
                    {pc.title}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-brand-purple h-2 rounded-full transition-all"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Data export note ── */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">Exporting data</p>
        <p>
          To download full response data, log in to your{' '}
          <a href="https://supabase.com" target="_blank" className="underline text-brand-purple">
            Supabase dashboard
          </a>
          , open the Table Editor, select the <code>responses</code> table, and click{' '}
          <strong>Export CSV</strong>. For newsletter emails, use the{' '}
          <code>email_captures</code> table.
        </p>
      </div>
    </div>
  )
}
