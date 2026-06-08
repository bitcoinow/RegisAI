-- RegisAI D1 Schema (SQLite)
-- Converted from Supabase Postgres migrations

-- ── Users (replaces Supabase Auth) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email_confirmed_at TEXT,
  confirmation_token TEXT,
  confirmation_sent_at TEXT,
  reset_token TEXT,
  reset_sent_at TEXT,
  mfa_secret TEXT,
  mfa_enabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_confirmation_token ON users(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- ── Sessions ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  firm_name TEXT,
  firm_type TEXT CHECK (firm_type IN ('RIA', 'Fintech', 'Insurance', 'Bank')),
  aum_range TEXT,
  regulator TEXT CHECK (regulator IN ('FINRA', 'SEC', 'State', 'Multiple')),
  plan TEXT NOT NULL DEFAULT 'design_partner',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Documents ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT,
  extracted_text TEXT,
  page_count INTEGER,
  status TEXT NOT NULL DEFAULT 'uploaded'
    CHECK (status IN ('uploaded', 'analysing', 'complete', 'error')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

-- ── Audits ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audits (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  jurisdiction TEXT NOT NULL DEFAULT 'US',
  framework TEXT,
  firm_name TEXT NOT NULL,
  exec_summary TEXT,
  total_gaps INTEGER NOT NULL DEFAULT 0,
  high_risk INTEGER NOT NULL DEFAULT 0,
  medium_risk INTEGER NOT NULL DEFAULT 0,
  low_risk INTEGER NOT NULL DEFAULT 0,
  strengths TEXT NOT NULL DEFAULT '[]',
  priority_actions TEXT NOT NULL DEFAULT '[]',
  raw_result TEXT,
  parent_audit_id TEXT REFERENCES audits(id) ON DELETE SET NULL,
  scan_number INTEGER NOT NULL DEFAULT 1,
  compliance_score REAL,
  requirements_total INTEGER,
  requirements_met INTEGER,
  gaps_closed INTEGER,
  gaps_new INTEGER,
  gaps_persisting INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audits_user_id ON audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_document_id ON audits(document_id);

-- ── Findings ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  audit_id TEXT NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  req_id TEXT,
  rule TEXT,
  requirement TEXT,
  policy_says TEXT,
  gap TEXT,
  risk TEXT CHECK (risk IN ('High', 'Medium', 'Low')),
  recommendation TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'risk_accepted')),
  drafted_policy TEXT,
  reviewed_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  review_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_findings_audit_id ON findings(audit_id);

-- ── Regulatory Updates ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS regulatory_updates (
  id TEXT PRIMARY KEY,
  regulator TEXT,
  jurisdiction TEXT NOT NULL DEFAULT 'US',
  title TEXT,
  summary TEXT,
  url TEXT UNIQUE,
  published_at TEXT,
  relevance_score INTEGER CHECK (relevance_score BETWEEN 1 AND 5),
  affected_rules TEXT,
  raw_content TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_regulatory_updates_jurisdiction ON regulatory_updates(jurisdiction);
