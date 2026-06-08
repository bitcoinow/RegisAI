/**
 * D1 database access layer — replaces lib/supabase/server.ts and lib/supabase/client.ts.
 * All queries use parameterized bindings; no user-supplied values are interpolated.
 */

// ── Minimal D1 type declarations ────────────────────────────────────────────────

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = Record<string, unknown>>(): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean }>
  run(): Promise<{ success: boolean; meta: unknown }>
}

interface D1Database {
  prepare(sql: string): D1PreparedStatement
  batch(statements: D1PreparedStatement[]): Promise<Array<{ results: Record<string, unknown>[]; success: boolean }>>
}

// ── Binding access ───────────────────────────────────────────────────────────────
// OpenNext stores CF bindings in AsyncLocalStorage keyed by Symbol.for("__cloudflare-context__").
// String env vars go to process.env; D1/R2/KV objects stay on the context.

const CF_CONTEXT_KEY = Symbol.for('__cloudflare-context__')

function getDB(): D1Database {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (globalThis as any)[CF_CONTEXT_KEY]
  const db = ctx?.env?.DB as D1Database | undefined
  if (!db) throw new Error('D1 binding "DB" not found in Cloudflare context')
  return db
}

// ── Row types (public, matching schema column names) ─────────────────────────────

export interface UserRow {
  id: string
  email: string
  password_hash: string
  email_confirmed_at: string | null
  confirmation_token: string | null
  confirmation_sent_at: string | null
  reset_token: string | null
  reset_sent_at: string | null
  mfa_secret: string | null
  mfa_enabled: number
  created_at: string
  updated_at: string
  jurisdiction: string
  organisation_id: string | null
}

export interface ProfileRow {
  id: string
  firm_name: string | null
  firm_type: 'RIA' | 'Fintech' | 'Insurance' | 'Bank' | null
  aum_range: string | null
  regulator: 'FINRA' | 'SEC' | 'State' | 'Multiple' | null
  plan: string
  created_at: string
}

export interface DocumentRow {
  id: string
  user_id: string
  file_name: string
  file_path: string | null
  extracted_text: string | null
  page_count: number | null
  status: 'uploaded' | 'analysing' | 'complete' | 'error'
  created_at: string
}

export interface AuditRow {
  id: string
  document_id: string
  user_id: string
  jurisdiction: string
  framework: string | null
  firm_name: string
  exec_summary: string | null
  total_gaps: number
  high_risk: number
  medium_risk: number
  low_risk: number
  strengths: string[]
  priority_actions: string[]
  raw_result: string | null
  parent_audit_id: string | null
  scan_number: number
  compliance_score: number | null
  requirements_total: number | null
  requirements_met: number | null
  gaps_closed: number | null
  gaps_new: number | null
  gaps_persisting: number | null
  created_at: string
}

export interface FindingRow {
  id: string
  audit_id: string
  req_id: string | null
  rule: string | null
  requirement: string | null
  policy_says: string | null
  gap: string | null
  risk: 'High' | 'Medium' | 'Low' | null
  recommendation: string | null
  status: 'open' | 'in_progress' | 'resolved' | 'risk_accepted'
  drafted_policy: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  review_note: string | null
  created_at: string
}

export interface RegulatoryUpdateRow {
  id: string
  regulator: string | null
  jurisdiction: string
  title: string | null
  summary: string | null
  url: string | null
  published_at: string | null
  relevance_score: number | null
  affected_rules: string[]
  raw_content: string | null
  created_at: string
}

export interface SessionWithUser {
  id: string
  user_id: string
  expires_at: string
  created_at: string
  email: string
  email_confirmed_at: string | null
}

// ── Input types ──────────────────────────────────────────────────────────────────

export interface UpdateProfileData {
  firm_name?: string
  firm_type?: 'RIA' | 'Fintech' | 'Insurance' | 'Bank'
  aum_range?: string
  regulator?: 'FINRA' | 'SEC' | 'State' | 'Multiple'
  plan?: string
}

export interface CreateAuditData {
  document_id: string
  user_id: string
  jurisdiction?: string
  framework?: string
  firm_name: string
  exec_summary?: string
  total_gaps?: number
  high_risk?: number
  medium_risk?: number
  low_risk?: number
  strengths?: string[]
  priority_actions?: string[]
  raw_result?: string
  parent_audit_id?: string
  scan_number?: number
  compliance_score?: number
  requirements_total?: number
  requirements_met?: number
  gaps_closed?: number
  gaps_new?: number
  gaps_persisting?: number
}

export interface CreateFindingData {
  req_id?: string
  rule?: string
  requirement?: string
  policy_says?: string
  gap?: string
  risk?: 'High' | 'Medium' | 'Low'
  recommendation?: string
  status?: 'open' | 'in_progress' | 'resolved' | 'risk_accepted'
  drafted_policy?: string
}

export interface UpsertRegulatoryUpdateData {
  id?: string
  regulator?: string
  jurisdiction?: string
  title?: string
  summary?: string
  url?: string
  published_at?: string
  relevance_score?: number
  affected_rules?: string[]
  raw_content?: string
}

// ── JSON column parsers ──────────────────────────────────────────────────────────

type RawAuditRow = Omit<AuditRow, 'strengths' | 'priority_actions'> & {
  strengths: string
  priority_actions: string
}

type RawRegulatoryUpdateRow = Omit<RegulatoryUpdateRow, 'affected_rules'> & {
  affected_rules: string
}

function parseAudit(row: RawAuditRow): AuditRow {
  return {
    ...row,
    strengths: JSON.parse(row.strengths ?? '[]') as string[],
    priority_actions: JSON.parse(row.priority_actions ?? '[]') as string[],
  }
}

function parseRegulatoryUpdate(row: RawRegulatoryUpdateRow): RegulatoryUpdateRow {
  return {
    ...row,
    affected_rules: JSON.parse(row.affected_rules ?? '[]') as string[],
  }
}

// ── DB namespace ─────────────────────────────────────────────────────────────────

export const db = {
  // ── Users ──────────────────────────────────────────────────────────────────

  async getUser(id: string): Promise<UserRow | null> {
    return await getDB().prepare('SELECT * FROM users WHERE id = ?').bind(id).first<UserRow>()
  },

  async getUserByEmail(email: string): Promise<UserRow | null> {
    return await getDB().prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>()
  },

  async createUser(email: string, passwordHash: string, confirmationToken?: string, jurisdiction?: string): Promise<string> {
    const id = crypto.randomUUID()
    const d1 = await getDB()
    await d1.batch([
      d1.prepare('INSERT INTO users (id, email, password_hash, confirmation_token, confirmation_sent_at, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(id, email, passwordHash, confirmationToken ?? null, confirmationToken ? new Date().toISOString() : null, jurisdiction ?? 'UK'),
      d1.prepare('INSERT INTO profiles (id) VALUES (?)').bind(id),
    ])
    return id
  },

  async confirmUser(token: string): Promise<string | null> {
    const d1 = await getDB()
    const row = await d1.prepare('SELECT id FROM users WHERE confirmation_token = ?').bind(token).first<{ id: string }>()
    if (!row) return null
    await d1.prepare("UPDATE users SET email_confirmed_at = datetime('now'), confirmation_token = NULL WHERE id = ?")
      .bind(row.id).run()
    return row.id
  },

  // ── Profiles ───────────────────────────────────────────────────────────────

  async getProfile(userId: string): Promise<ProfileRow | null> {
    return await getDB().prepare('SELECT * FROM profiles WHERE id = ?').bind(userId).first<ProfileRow>()
  },

  async updateProfile(userId: string, data: UpdateProfileData): Promise<void> {
    const allowed = ['firm_name', 'firm_type', 'aum_range', 'regulator', 'plan'] as const
    const sets: string[] = []
    const values: unknown[] = []
    for (const key of allowed) {
      if (key in data && data[key] !== undefined) {
        sets.push(`${key} = ?`)
        values.push(data[key])
      }
    }
    if (sets.length === 0) return
    values.push(userId)
    await getDB()
      .prepare(`UPDATE profiles SET ${sets.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run()
  },

  // ── Documents ──────────────────────────────────────────────────────────────

  async listDocuments(userId: string): Promise<DocumentRow[]> {
    const result = await getDB()
      .prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC')
      .bind(userId)
      .all<DocumentRow>()
    return result.results
  },

  async createDocument(
    userId: string,
    fileName: string,
    extractedText: string | null,
    pageCount: number | null
  ): Promise<string> {
    const id = crypto.randomUUID()
    await getDB()
      .prepare('INSERT INTO documents (id, user_id, file_name, extracted_text, page_count) VALUES (?, ?, ?, ?, ?)')
      .bind(id, userId, fileName, extractedText, pageCount)
      .run()
    return id
  },

  async getDocument(id: string, userId: string): Promise<DocumentRow | null> {
    return await getDB()
      .prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .first<DocumentRow>()
  },

  async deleteDocument(id: string, userId: string): Promise<void> {
    await getDB()
      .prepare('DELETE FROM documents WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run()
  },

  // ── Audits ─────────────────────────────────────────────────────────────────

  async createAudit(data: CreateAuditData): Promise<string> {
    const id = crypto.randomUUID()
    await getDB()
      .prepare(
        `INSERT INTO audits (
          id, document_id, user_id, jurisdiction, framework, firm_name,
          exec_summary, total_gaps, high_risk, medium_risk, low_risk,
          strengths, priority_actions, raw_result, parent_audit_id, scan_number,
          compliance_score, requirements_total, requirements_met,
          gaps_closed, gaps_new, gaps_persisting
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        data.document_id,
        data.user_id,
        data.jurisdiction ?? 'US',
        data.framework ?? null,
        data.firm_name,
        data.exec_summary ?? null,
        data.total_gaps ?? 0,
        data.high_risk ?? 0,
        data.medium_risk ?? 0,
        data.low_risk ?? 0,
        JSON.stringify(data.strengths ?? []),
        JSON.stringify(data.priority_actions ?? []),
        data.raw_result ?? null,
        data.parent_audit_id ?? null,
        data.scan_number ?? 1,
        data.compliance_score ?? null,
        data.requirements_total ?? null,
        data.requirements_met ?? null,
        data.gaps_closed ?? null,
        data.gaps_new ?? null,
        data.gaps_persisting ?? null
      )
      .run()
    return id
  },

  async getAudit(id: string, userId: string): Promise<AuditRow | null> {
    const row = await getDB()
      .prepare('SELECT * FROM audits WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .first<RawAuditRow>()
    return row ? parseAudit(row) : null
  },

  async listAudits(userId: string): Promise<AuditRow[]> {
    const result = await getDB()
      .prepare('SELECT * FROM audits WHERE user_id = ? ORDER BY created_at DESC')
      .bind(userId)
      .all<RawAuditRow>()
    return result.results.map(parseAudit)
  },

  // ── Findings ───────────────────────────────────────────────────────────────

  async createFindings(auditId: string, findings: CreateFindingData[]): Promise<void> {
    if (findings.length === 0) return
    const d1 = await getDB()
    const stmts = findings.map((f) =>
      d1
        .prepare(
          `INSERT INTO findings
            (id, audit_id, req_id, rule, requirement, policy_says, gap, risk, recommendation, status, drafted_policy)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          auditId,
          f.req_id ?? null,
          f.rule ?? null,
          f.requirement ?? null,
          f.policy_says ?? null,
          f.gap ?? null,
          f.risk ?? null,
          f.recommendation ?? null,
          f.status ?? 'open',
          f.drafted_policy ?? null
        )
    )
    await d1.batch(stmts)
  },

  async getFindings(auditId: string): Promise<FindingRow[]> {
    const result = await getDB()
      .prepare('SELECT * FROM findings WHERE audit_id = ? ORDER BY created_at ASC')
      .bind(auditId)
      .all<FindingRow>()
    return result.results
  },

  async updateFindingStatus(
    id: string,
    status: FindingRow['status'],
    reviewedBy: string | null,
    reviewNote: string | null
  ): Promise<void> {
    await getDB()
      .prepare("UPDATE findings SET status = ?, reviewed_by = ?, reviewed_at = datetime('now'), review_note = ? WHERE id = ?")
      .bind(status, reviewedBy, reviewNote, id)
      .run()
  },

  async updateFindingDraft(id: string, draftedPolicy: string): Promise<void> {
    await getDB()
      .prepare('UPDATE findings SET drafted_policy = ? WHERE id = ?')
      .bind(draftedPolicy, id)
      .run()
  },

  // ── Regulatory Updates ─────────────────────────────────────────────────────

  async listRegulatoryUpdates(jurisdiction?: string): Promise<RegulatoryUpdateRow[]> {
    const result = jurisdiction
      ? await getDB()
          .prepare('SELECT * FROM regulatory_updates WHERE jurisdiction = ? ORDER BY published_at DESC')
          .bind(jurisdiction)
          .all<RawRegulatoryUpdateRow>()
      : await getDB()
          .prepare('SELECT * FROM regulatory_updates ORDER BY published_at DESC')
          .all<RawRegulatoryUpdateRow>()
    return result.results.map(parseRegulatoryUpdate)
  },

  async upsertRegulatoryUpdates(updates: UpsertRegulatoryUpdateData[]): Promise<void> {
    if (updates.length === 0) return
    const d1 = getDB()
    const stmts = updates.map((u) =>
      d1
        .prepare(
          `INSERT OR REPLACE INTO regulatory_updates
            (id, regulator, jurisdiction, title, summary, url, published_at, relevance_score, affected_rules, raw_content)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          u.id ?? crypto.randomUUID(),
          u.regulator ?? null,
          u.jurisdiction ?? 'US',
          u.title ?? null,
          u.summary ?? null,
          u.url ?? null,
          u.published_at ?? null,
          u.relevance_score ?? null,
          JSON.stringify(u.affected_rules ?? []),
          u.raw_content ?? null
        )
    )
    await d1.batch(stmts)
  },

  // ── Sessions ───────────────────────────────────────────────────────────────

  async createSession(userId: string): Promise<string> {
    const id = crypto.randomUUID()
    await getDB()
      .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))")
      .bind(id, userId)
      .run()
    return id
  },

  async getSession(sessionId: string): Promise<SessionWithUser | null> {
    return await getDB()
      .prepare(
        `SELECT s.id, s.user_id, s.expires_at, s.created_at, u.email, u.email_confirmed_at
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.id = ? AND s.expires_at > datetime('now')`
      )
      .bind(sessionId)
      .first<SessionWithUser>()
  },

  async deleteSession(sessionId: string): Promise<void> {
    getDB().prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
  },

  // ── Password reset ─────────────────────────────────────────────────────────

  async setResetToken(email: string, token: string): Promise<void> {
    await getDB()
      .prepare("UPDATE users SET reset_token = ?, reset_sent_at = datetime('now') WHERE email = ?")
      .bind(token, email)
      .run()
  },

  async resetPassword(token: string, newPasswordHash: string): Promise<boolean> {
    const result = await getDB()
      .prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_sent_at = NULL WHERE reset_token = ?')
      .bind(newPasswordHash, token)
      .run()
    return ((result.meta as Record<string, unknown>)?.['changes'] as number ?? 0) > 0
  },
}
