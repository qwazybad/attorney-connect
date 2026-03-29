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


-- ─── Storage bucket for profile photos ────────────────────────────────────────
-- Run in SQL editor or via the Supabase dashboard Storage UI:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attorney-photos', 'attorney-photos', true)
-- ON CONFLICT DO NOTHING;
