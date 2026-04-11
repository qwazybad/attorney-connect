-- AttorneyCompete — Supabase Schema
-- Run this in your Supabase SQL editor to create the required tables.

-- ─── Attorneys ────────────────────────────────────────────────────────────────
-- id matches the Clerk user ID (e.g. "user_2abc...")
CREATE TABLE IF NOT EXISTS attorneys (
  id            TEXT PRIMARY KEY,          -- Clerk user ID
  name          TEXT,
  firm          TEXT,
  bio           TEXT,
  phone         TEXT,
  website       TEXT,
  photo_url     TEXT,
  webhook_url   TEXT,
  field_mapping JSONB DEFAULT '{}'::jsonb, -- maps our field names → CRM field names
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: attorneys can only read/write their own row
ALTER TABLE attorneys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attorneys_select_own" ON attorneys
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "attorneys_insert_own" ON attorneys
  FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "attorneys_update_own" ON attorneys
  FOR UPDATE USING (auth.uid()::text = id);


-- ─── Leads ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attorney_id     TEXT NOT NULL REFERENCES attorneys(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  legal_issue     TEXT NOT NULL,
  state           TEXT NOT NULL,
  message         TEXT,
  sent_to_webhook BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_attorney_id_idx ON leads (attorney_id);
CREATE INDEX IF NOT EXISTS leads_created_at_idx  ON leads (created_at DESC);

-- RLS: attorneys can only see leads assigned to them
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select_own" ON leads
  FOR SELECT USING (auth.uid()::text = attorney_id);

-- Service-role key bypasses RLS; the API route uses supabaseAdmin
-- so it can insert leads and read attorney webhook config freely.


-- ─── Migration: add missing columns to existing attorneys table ───────────────
-- Run this block if the table already exists (e.g. in production).
-- Safe to re-run — IF NOT EXISTS / IF NOT COLUMN guards every statement.
ALTER TABLE attorneys
  ADD COLUMN IF NOT EXISTS status               TEXT    DEFAULT 'pending'
                                                        CHECK (status IN ('pending','active','suspended')),
  ADD COLUMN IF NOT EXISTS practice_areas       TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS licensed_states      TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS billing_type         TEXT    DEFAULT 'contingency',
  ADD COLUMN IF NOT EXISTS fee_percent          INTEGER,
  ADD COLUMN IF NOT EXISTS hourly_rate          INTEGER,
  ADD COLUMN IF NOT EXISTS flat_fee             INTEGER,
  ADD COLUMN IF NOT EXISTS bar_license          TEXT,
  ADD COLUMN IF NOT EXISTS malpractice_insurance TEXT,
  ADD COLUMN IF NOT EXISTS years_experience     INTEGER,
  ADD COLUMN IF NOT EXISTS firm_size            TEXT,
  ADD COLUMN IF NOT EXISTS notes                TEXT,
  ADD COLUMN IF NOT EXISTS cases_won            INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_cases          INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS recent_result        TEXT,
  ADD COLUMN IF NOT EXISTS recent_result_amount TEXT,
  ADD COLUMN IF NOT EXISTS city                 TEXT,
  ADD COLUMN IF NOT EXISTS response_time_hours  INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS unclaimed            BOOLEAN DEFAULT FALSE;

-- Fast index for public queries that filter by status
CREATE INDEX IF NOT EXISTS attorneys_status_idx ON attorneys (status);

-- RLS: allow anyone to read active attorney profiles (public marketplace)
CREATE POLICY IF NOT EXISTS "attorneys_select_active" ON attorneys
  FOR SELECT USING (status = 'active');


-- ─── Storage bucket for profile photos ────────────────────────────────────────
-- Run in SQL editor or via the Supabase dashboard Storage UI:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attorney-photos', 'attorney-photos', true)
-- ON CONFLICT DO NOTHING;
