# Plan 02 — Finding Tracking, Monitoring Feed & Exports

**Goal:** Transform RegisAI from a static reporting tool into an interactive, ongoing compliance operations hub by adding finding status tracking, a real-time regulatory RSS/Federal Register feed with AI relevance scoring, and export utilities.

---

## Phase 1: Finding Status Tracking

### 1a. Database Modifications
Add a `findings` table to store individual gap results as discrete rows, rather than a single monolithic JSON blob inside `audits`. This allows granular state management.

```sql
CREATE TABLE findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid REFERENCES audits(id) ON DELETE CASCADE,
  req_id text,              -- e.g. 'REQ-001'
  rule text,                -- e.g. 'FINRA Rule 3110(a)'
  requirement text,
  policy_says text,
  gap text,
  risk text,                -- 'High' | 'Medium' | 'Low'
  recommendation text,
  status text DEFAULT 'open',  -- 'open' | 'in_progress' | 'resolved'
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
```

* RLS Policy: Authenticated users can read/write findings belonging to an audit they own. (Verify ownership by performing a join on the `audits` table in the RLS policy).

### 1b. API Route (`PATCH /api/findings/[id]/status`)
* Secure endpoint accepting `{ status: 'open' | 'in_progress' | 'resolved' }`.
* Verify that the session user owns the audit related to this finding.
* Perform atomic update and return the updated status.

### 1c. UI Integration
* Refactor the findings list in `<AuditReport>` to use interactive status buttons.
* Allow quick toggling of state with micro-animations. Active statuses are styled using design system tokens.

---

## Phase 2: Regulatory Monitoring Feed

### 2a. Database Setup
Create a single global repository of regulatory notices.

```sql
CREATE TABLE regulatory_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regulator text,           -- 'FINRA' | 'SEC' | 'CFPB' | 'FinCEN'
  title text,
  summary text,
  url text UNIQUE,          -- prevent duplicate updates
  published_at timestamptz,
  relevance_score int,      -- 1-5, Claude-generated
  affected_rules text[],
  raw_content text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE regulatory_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read all updates" ON regulatory_updates 
  FOR SELECT TO authenticated USING (true);
```

### 2b. Zero-Dependency Parser & Scoring (`lib/monitoring.ts`)
* Initially read FINRA and SEC RSS feeds.
* Parse RSS XML streams cleanly using regex matching (eliminating heavy external XML parser dependencies).
* Integrate Claude into the feed ingestion pipeline: feed titles/summaries to Claude and ask it to return a **Relevance Score (1-5)** and an array of **Affected Rule Citations** (e.g. `['FINRA 3110', 'Rule 17a-4']`).
* **Stability Improvement:** Because some standard RSS feeds get blocked or are slow, transition the SEC ingestion feed to fetch from the official **Federal Register JSON API** (e.g. searching documents by agency).

### 2c. API Feed Ingestion
* `/api/monitoring/refresh` (POST) — Fetches feeds, parses them, prompts Claude for scoring, and upserts them into the database using a service role client to bypass RLS.
* `/api/monitoring/feed` (GET) — Returns lists of stored updates, ordered by publication date, limited to 100 rows.

---

## Phase 3: Export & Engagement (Phase 2 Closeout)

### 3a. PDF Print Exports
* Avoid the overhead of server-side headless browsers (e.g. Puppeteer) in serverless environments.
* Implement a robust CSS print stylesheet (`@media print`) in `globals.css`:
  * Hide non-essential layout elements (Sidebar, Nav, Status selectors, Action buttons).
  * Expand all collapsed finding cards so the complete detail prints out.
  * Optimize padding, page margins, and prevent ugly text splits across pages with `page-break-inside: avoid`.
  * Trigger print view natively using client-side `window.print()`.

### 3b. Weekly Email Digests (Resend)
* Install `@resend/node` for transactional email delivery.
* Configure a weekly scheduled digest script that fetches regulatory updates scored `relevance_score >= 4` and emails compliance officers a neat recap.

---

## Phase 4: Verification Checklist
* [x] Finding toggles instantly save state to the database on click.
* [x] Ingestion route dedupes on URL and accurately computes relevance scores.
* [x] Printing the audit report via PDF exports every detail cleanly in high-fidelity.
