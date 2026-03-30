-- ─────────────────────────────────────────────────────────────────────────────
-- Insight Pulse — Schema Update
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- This adds dynamic pulse check creation. Run AFTER the original schema.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Pulse Checks table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pulse_checks (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  subtitle    TEXT NOT NULL,
  intro       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Questions table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pulse_questions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pulse_check_id   INTEGER REFERENCES pulse_checks(id) ON DELETE CASCADE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  label            TEXT NOT NULL,
  question_text    TEXT NOT NULL,
  question_type    TEXT NOT NULL CHECK (question_type IN ('scale','ranked_choice','multi_select','single_choice','binary')),
  options          JSONB NOT NULL DEFAULT '[]',
  required         BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pulse_questions_pc ON pulse_questions(pulse_check_id);

-- Enable RLS (access goes through service role key in API routes)
ALTER TABLE pulse_checks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_questions ENABLE ROW LEVEL SECURITY;

-- ── 3. Seed the original 4 Pulse Checks ──────────────────────────────────────
INSERT INTO pulse_checks (id, title, subtitle, intro) VALUES
(1, 'Pulse Check 1', 'The Core Mandate',   'Help us understand the state of society''s support for health and wellbeing — and what needs to change.'),
(2, 'Pulse Check 2', 'The Data Frontier',  'Share your views on data ownership and how personal health data should be used.'),
(3, 'Pulse Check 3', 'The Brand Mandate',  'Tell us how you feel about health information online — and the role brands should play.'),
(4, 'Pulse Check 4', 'The Impact Fund',    'Help us understand your appetite for social investment and the role of data in driving positive change.')
ON CONFLICT (id) DO NOTHING;

-- Ensure the auto-increment starts after 4
SELECT setval('pulse_checks_id_seq', 4, true);

-- ── 4. Seed questions for Pulse Check 1 ──────────────────────────────────────
INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 1, 1, 'Pulse Check',
  'Do you feel society today is becoming more supportive of people''s health and wellbeing, or is it falling behind?',
  'scale',
  '["Improving significantly","Improving slightly","Staying the same","Falling behind slightly","Falling behind rapidly"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 1 AND sort_order = 1);

INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 1, 2, 'The Priority',
  'If society could solve ONE issue affecting women''s wellbeing in the next five years, what should it be? Rank these in order of importance to you.',
  'ranked_choice',
  '["Healthcare access","Workplace equality","Financial security","Safety","Mental wellbeing"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 1 AND sort_order = 2);

INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 1, 3, 'Responsibility',
  'Who is best placed to lead the change required to help individuals and society improve? Select all that apply.',
  'multi_select',
  '["Governments","Healthcare systems","Employers","Brands / Companies","Communities"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 1 AND sort_order = 3);

-- ── 5. Seed questions for Pulse Check 2 ──────────────────────────────────────
INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 2, 1, 'Ownership',
  'Would you support a shift where individuals, rather than "Big Tech" or large organisations, own and control their own health and wellbeing data?',
  'scale',
  '["Strongly support","Somewhat support","Neutral","Somewhat oppose","Strongly oppose"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 2 AND sort_order = 1);

INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 2, 2, 'Conditions of Trust',
  'What is the most important factor for you to share your data anonymously for research? Select all that apply.',
  'multi_select',
  '["I must own it","I choose who accesses it","I can withdraw it at any time","Independent oversight"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 2 AND sort_order = 2);

INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 2, 3, 'The Value Exchange',
  'If you share your "lived experience" to help research, what is the most meaningful value you should receive in return?',
  'single_choice',
  '["Personal health insights","Better community care","Financial rewards / Discounts","Supporting global research"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 2 AND sort_order = 3);

-- ── 6. Seed questions for Pulse Check 3 ──────────────────────────────────────
INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 3, 1, 'The Trust Gap',
  'How often do you feel overwhelmed or misled by health information managed by social media algorithms?',
  'scale',
  '["Always","Often","Sometimes","Rarely","Never"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 3 AND sort_order = 1);

INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 3, 2, 'Brand Behaviour',
  'If brands invested part of their advertising budget into improving societal health infrastructure (like this platform) rather than just ads, how would you feel about them?',
  'scale',
  '["Much more positive","Somewhat more positive","No difference","Somewhat more negative","More negative"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 3 AND sort_order = 2);

INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 3, 3, 'Brand Boundaries',
  'What role should brands be allowed to play on a health and wellbeing platform? Select all that apply.',
  'multi_select',
  '["Fund research","Share educational content","Offer products / services","No role at all"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 3 AND sort_order = 3);

-- ── 7. Seed questions for Pulse Check 4 ──────────────────────────────────────
INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 4, 1, 'Social Investment',
  'Would you favour a brand that contributes a portion of its profits to a "Wellbeing Impact Fund" to solve societal health gaps?',
  'binary',
  '["Yes","No"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 4 AND sort_order = 1);

INSERT INTO pulse_questions (pulse_check_id, sort_order, label, question_text, question_type, options)
SELECT 4, 2, 'Commercial Participation',
  'Would you choose to share anonymised data for commercial innovation (e.g. travel companies exploring travel stress) if you benefited directly from better services?',
  'single_choice',
  '["Yes, if I benefit directly","Yes, for the greater good","No"]'
WHERE NOT EXISTS (SELECT 1 FROM pulse_questions WHERE pulse_check_id = 4 AND sort_order = 2);
