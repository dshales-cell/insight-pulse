-- ─────────────────────────────────────────────────────────────────────────────
-- Insight Pulse — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. Settings table (key/value store for app configuration) ────────────────
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Set the initial active pulse check to 1
-- Change this value via the Admin dashboard, not directly in the database
INSERT INTO settings (key, value)
VALUES ('active_pulse_check', '1')
ON CONFLICT (key) DO NOTHING;


-- ── 2. Responses table (anonymous survey answers) ────────────────────────────
CREATE TABLE IF NOT EXISTS responses (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pulse_check_id  INTEGER NOT NULL CHECK (pulse_check_id BETWEEN 1 AND 4),
  answers         JSONB NOT NULL,          -- { "pc1_q1_pulse_check": "Staying the same", ... }
  age_range       TEXT,
  country         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index to speed up analytics queries grouped by pulse check
CREATE INDEX IF NOT EXISTS idx_responses_pulse_check ON responses(pulse_check_id);
CREATE INDEX IF NOT EXISTS idx_responses_created_at  ON responses(created_at);


-- ── 3. Email captures table (newsletter sign-ups, separate from responses) ───
CREATE TABLE IF NOT EXISTS email_captures (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT NOT NULL,
  pulse_check_id  INTEGER NOT NULL DEFAULT 0,
  beehiiv_synced  BOOLEAN DEFAULT FALSE,
  beehiiv_error   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index to find a subscriber by email quickly
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);


-- ── 4. Row Level Security ────────────────────────────────────────────────────
-- We use the SERVICE ROLE key in our API routes, which bypasses RLS.
-- Enable RLS anyway to block any accidental public/anonymous access.
ALTER TABLE settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- No public policies — all access goes through our API routes using the service role key.
