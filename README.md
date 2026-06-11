# Regis AI

> AI-assisted FCA compliance reviews for UK financial services firms.

Regis AI is an AI-powered compliance review platform for FCA-regulated firms. Firms upload compliance manuals, Consumer Duty policies, SMCR documentation, and operational resilience plans. Regis maps the content against FCA expectations, surfaces potential gaps with risk ratings, generates remediation recommendations, and drafts compliance-manual language to address each finding.

**Beachhead market:** UK financial services (FCA-regulated firms) — Financial Advisers, Wealth Managers, Insurance Brokers, Fintech, Compliance Consultancies, Asset Managers.

**Long-term vision:** Multi-framework compliance review platform (FCA → DORA/MiFID II/GDPR → SEC/FINRA).

**Stage:** Early Access / Design Partner Programme.

**Live app:** [regis-ai-nine.vercel.app](https://regis-ai-nine.vercel.app)
**Demo (no login required):** `/demo/clearview`

### Current MVP Scope

See [MVP_SCOPE.md](MVP_SCOPE.md) for the full scope definition. Summary:
- UK jurisdiction (FCA Handbook, Consumer Duty, Operational Resilience, SMCR) — live
- US jurisdiction (32 requirements) — live
- EU jurisdiction (34 requirements) — live
- PDF upload, AI gap analysis, policy drafting, human review workflow, regulatory monitoring
- Out of scope: PDF export, multi-user orgs, Stripe billing, API access

### Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full module map. See [ROADMAP.md](ROADMAP.md) for the phased expansion plan.

---

## What It Does

1. A firm uploads their compliance manual (PDF).
2. Regis extracts the text and runs it through a Claude-powered gap analysis engine.
3. The engine checks the document against a jurisdiction-specific regulatory library — 32 US requirements (FINRA, SEC, AML/BSA, Reg BI, BCP), 23 EU requirements (MiFID II, GDPR, AMLD6, DORA, SFDR, MAR), or 19 UK requirements (FCA Rules, UK AML, UK GDPR, SM&CR, FCA OpRes).
4. A structured audit report is returned with:
   - Executive summary
   - Gap findings with risk level (High / Medium / Low), rule citation, and remediation recommendation
   - Strengths identified in the manual
   - Priority action list
5. Per-finding **policy drafting** — Claude generates ready-to-paste compliance manual language that closes each gap. Persisted to the database, copy-to-clipboard inline in the report.
6. Findings are stored per-user with Supabase RLS so data is fully isolated.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | TypeScript strict mode throughout |
| Database & Auth | Supabase | Postgres + Storage + email/password auth (with Google OAuth and optional MFA) |
| AI | Anthropic Claude API | `claude-sonnet-4-20250514` for gap analysis and policy drafting |
| PDF Parsing | `pdf-parse` | Server-side only — do not use pdf.js server-side |
| Styling | Tailwind CSS | Custom design system (editorial compliance aesthetic) |
| Email | Resend | Transactional email — weekly regulatory digest |
| Deployment | Vercel | Auto-deploy from `main` branch; geo headers used for currency detection |
| Payments | Stripe | Phase 4 — not yet integrated |

**Full dependency list:** see [package.json](package.json)

---

## Project Structure

```
RegisAI/
├── app/
│   ├── (app)/                        # Authenticated app shell
│   │   ├── layout.tsx                # App layout with Nav + onboarding gate
│   │   ├── dashboard/page.tsx        # Audit history list with jurisdiction badges
│   │   ├── audit/
│   │   │   ├── new/page.tsx          # Upload + jurisdiction selector + trigger analysis
│   │   │   └── [id]/page.tsx         # Audit report view with policy drafting
│   │   └── monitoring/page.tsx       # Regulatory feed — US / EU / UK tabs
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── login/page.tsx            # Email/password + Google OAuth login
│   ├── (legal)/
│   │   ├── layout.tsx                # Shared legal page wrapper
│   │   ├── about/page.tsx            # About page
│   │   ├── privacy/page.tsx          # Privacy Policy
│   │   ├── security/page.tsx         # Security page
│   │   └── terms/page.tsx            # Terms of Service
│   ├── api/
│   │   ├── analyse/route.ts          # POST — jurisdiction-aware gap analysis pipeline
│   │   ├── documents/route.ts        # POST — PDF upload + text extraction
│   │   ├── findings/[id]/
│   │   │   ├── status/route.ts       # PATCH — update finding status
│   │   │   └── draft/route.ts        # POST — generate + persist policy language
│   │   ├── profile/route.ts          # PATCH — upsert firm profile (onboarding)
│   │   └── monitoring/
│   │       ├── feed/route.ts         # GET — returns stored regulatory updates
│   │       ├── refresh/route.ts      # POST — fetches RSS feeds + upserts to DB
│   │       └── digest/route.ts       # POST — sends weekly email digest via Resend
│   ├── auth/callback/route.ts        # Supabase PKCE callback handler
│   ├── demo/clearview/page.tsx       # Public demo — no login required
│   ├── onboarding/page.tsx           # Post-signup onboarding (firm name, type, size)
│   ├── globals.css                   # Design tokens + global styles + print stylesheet
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Marketing landing page (geo-based currency)
├── components/
│   ├── audit/
│   │   ├── audit-report.tsx          # Full report renderer with findings + policy drafting
│   │   ├── new-audit-form.tsx        # Jurisdiction selector component
│   │   └── upload-form.tsx           # Two-stage upload + analysis form
│   ├── marketing/
│   │   └── landing-page.tsx          # B2B landing page (hero, pricing, testimonials)
│   └── ui/
│       ├── logo.tsx                  # Pure-CSS RegisLogo component
│       ├── nav.tsx                   # Navigation bar with branding + auth
│       ├── risk-badge.tsx            # High/Medium/Low badge component
│       └── sign-out-button.tsx       # Sign out client component
├── lib/
│   ├── claude.ts                     # Anthropic client + gap analysis + policy drafting
│   ├── currency.ts                   # Country-to-currency mapping (USD / EUR / GBP)
│   ├── demo-data.ts                  # Pre-seeded Clearview Capital demo audit
│   ├── env.ts                        # Runtime env validation
│   ├── eu-regulatory-library.ts      # 23 EU requirements (typed)
│   ├── monitoring.ts                 # RSS parser + relevance scoring (no new deps)
│   ├── pdf.ts                        # PDF text extraction wrapper
│   ├── regulatory-library.ts         # 32 US regulatory requirements (typed)
│   ├── uk-regulatory-library.ts      # 19 UK requirements (typed)
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       └── server.ts                 # Server Supabase client (SSR cookies)
├── middleware.ts                     # Auth session refresh + onboarding redirect gate
├── plans/                            # Strategic plans and architectural design documents
│   ├── 01-core-mvp-scaffold.md       # Phase 1 Core MVP scaffold & database setup
│   ├── 02-finding-tracking-and-monitoring.md  # Phase 2 status tracking & monitoring feed
│   ├── 03-eu-uk-regulatory-expansion.md       # Phase 3 regulatory library expansion
│   └── 04-eu-uk-monitoring-expansion.md       # Phase 3 monitoring feed expansion
├── supabase/
│   └── migrations/
│       ├── 20260504000000_initial.sql                          # Full schema
│       ├── 20260509000001_findings_update_policy.sql           # RLS update policy for findings
│       ├── 20260511000000_regulatory_updates_rls.sql           # RLS + read policy for regulatory_updates
│       ├── 20260511000001_regulatory_updates_unique_url.sql    # Unique constraint on url
│       ├── 20260527000000_audits_add_jurisdiction.sql          # jurisdiction column on audits (default 'US')
│       ├── 20260528000000_regulatory_updates_add_jurisdiction.sql  # jurisdiction column on regulatory_updates (default 'US')
│       └── 20260601000000_findings_add_drafted_policy.sql      # drafted_policy column on findings
├── types/
│   └── index.ts                      # Shared domain types (incl. Jurisdiction)
├── .env.example                      # Environment variable template
└── lessons.md                        # Build session learnings log
```

---

## Planning & Strategy

To ensure long-term maintainability, strategic alignment, and the ability to review past decisions, RegisAI enforces a disciplined planning protocol. All architectural changes, major feature implementations, and strategic milestones are documented upfront and preserved historically.

### The Planning Protocol
1. **Design & Strategy Phase:** Before writing any complex code, a comprehensive planning document is created under the `plans/` directory.
2. **Phased Structure:** Plans are written in Markdown, structured by clear execution phases (Types/Libraries, AI Prompts, DB Schema, API routes, UI, Verification).
3. **Permanent Archive:** Documents in the `plans/` folder are committed as source-controlled history, enabling the team to easily go back and study the reasoning behind structural decisions.
4. **Retrospective Log:** Critical takeaways, structural friction, or paradigm shifts are summarized post-implementation in [lessons.md](lessons.md).

### Saved Strategy & Planning Documents
Here is the index of all historic and active planning documents:

- **[Plan 01 — Core MVP & Compliance Analysis Engine](plans/01-core-mvp-scaffold.md)**
  * **Objective:** Establish the foundational RegisAI architecture, database schema, PDF text extraction pipeline, and initial Claude-powered gap analysis engine.
  * **Scope:** Configured Supabase Auth/RLS, built 32-requirement US regulatory library, integrated `pdf-parse`, drafted robust cached prompts in `lib/claude.ts`, and designed the primary audit dashboard and report pages.
  * **Status:** Complete.

- **[Plan 02 — Finding Tracking, Monitoring Feed & Exports](plans/02-finding-tracking-and-monitoring.md)**
  * **Objective:** Enhance platform engagement and interactivity by adding individual finding status toggling, Live RSS/Federal Register updates, and robust PDF exports.
  * **Scope:** Modeled discrete `findings` table with interactive card statuses, designed regulatory feed RSS/Federal Register parsers, integrated relevance scoring via Claude, and developed custom CSS print stylesheets for browser-native PDF export.
  * **Status:** Complete.

- **[Plan 03 — EU & UK Regulatory Expansion](plans/03-eu-uk-regulatory-expansion.md)**
  * **Objective:** Expand the compliance gap analysis engine to handle EU and UK manuals alongside the existing US framework.
  * **Scope:** Added `Jurisdiction` types, built 23 EU and 19 UK regulatory requirements, configured jurisdiction-aware prompt caching in Claude engine, ran Supabase schema migration, and implemented the multi-tab UI selector.
  * **Status:** Complete.

- **[Plan 04 — EU & UK Regulatory Monitoring Expansion](plans/04-eu-uk-monitoring-expansion.md)**
  * **Objective:** Extend the automated regulatory feed parser to ingest live updates from EU and UK watchdogs and implement a dashboard jurisdiction filter.
  * **Scope:** Ingested ESMA, EBA, FCA, and PRA RSS feeds, updated relevance keyword matching patterns, added `jurisdiction` column to the DB schema, and built a dynamic three-tab filtering UI on the monitoring board.
  * **Status:** Complete.

---

## Database Schema

```sql
-- User profiles (extends auth.users)
profiles (
  id uuid references auth.users primary key,
  firm_name text,
  firm_type text,           -- 'RIA' | 'Fintech' | 'Insurance' | 'Bank'
  aum_range text,
  regulator text,           -- 'FINRA' | 'SEC' | 'State' | 'Multiple'
  plan text default 'design_partner',
  created_at timestamptz default now()
)

-- Uploaded compliance documents
documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  file_name text not null,
  file_path text,           -- Supabase storage path
  extracted_text text,
  page_count int,
  status text default 'uploaded',  -- 'uploaded' | 'analysing' | 'complete' | 'error'
  created_at timestamptz default now()
)

-- Audit reports
audits (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  firm_name text,
  exec_summary text,
  total_gaps int,
  high_risk int,
  medium_risk int,
  low_risk int,
  strengths jsonb,
  priority_actions jsonb,
  raw_result jsonb,         -- full Claude response
  jurisdiction text default 'US',  -- 'US' | 'EU' | 'UK'
  created_at timestamptz default now()
)

-- Individual gap findings
findings (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id) on delete cascade,
  req_id text,              -- e.g. 'REQ-001'
  rule text,                -- e.g. 'FINRA Rule 3110(a)'
  requirement text,
  policy_says text,
  gap text,
  risk text,                -- 'High' | 'Medium' | 'Low'
  recommendation text,
  status text default 'open',  -- 'open' | 'in_progress' | 'resolved'
  drafted_policy text,      -- Claude-generated policy language (nullable)
  created_at timestamptz default now()
)

-- Regulatory monitoring feed
regulatory_updates (
  id uuid primary key default gen_random_uuid(),
  regulator text,           -- 'FINRA' | 'SEC' | 'ESMA' | 'EBA' | 'FCA' | 'PRA'
  jurisdiction text default 'US',  -- 'US' | 'EU' | 'UK'
  title text,
  summary text,
  url text,
  published_at timestamptz,
  relevance_score int,      -- 1-5, rule-keyword scored
  affected_rules text[],
  raw_content text,
  created_at timestamptz default now()
)
```

Row-level security is enabled on all tables. `regulatory_updates` is a shared feed — authenticated users can read all rows but cannot write directly (writes go through the service role in the refresh API route).

---

## API Routes

### `POST /api/documents`
Accepts `multipart/form-data` with a `file` field (PDF).
1. Extracts text server-side using `pdf-parse`
2. Saves document record to Supabase
3. Returns `{ document_id, page_count }`

### `POST /api/analyse`
Accepts `{ document_id: string, jurisdiction?: 'US' | 'EU' | 'UK' }`.
1. Fetches extracted text from Supabase
2. Builds jurisdiction-specific prompt from the matching regulatory library (32 US / 23 EU / 19 UK requirements)
3. Calls Claude API (`claude-sonnet-4-20250514`) with prompt caching
4. Parses structured JSON response
5. Persists audit + individual findings to Supabase
6. Returns `{ audit_id }`

All Claude API calls are centralised in `lib/claude.ts`. Never call the Anthropic SDK from components or API routes directly.

### `PATCH /api/findings/[id]/status`
Accepts `{ status: 'open' | 'in_progress' | 'resolved' }`.
1. Verifies auth and that the finding belongs to the authenticated user (via audit ownership)
2. Updates `findings.status` in Supabase
3. Returns `{ status }`

### `POST /api/findings/[id]/draft`
No body required.
1. Verifies auth and finding ownership via the owning audit
2. Calls `draftPolicyLanguage(finding, jurisdiction, firmName)` in `lib/claude.ts`
3. Persists the result to `findings.drafted_policy`
4. Returns `{ drafted_policy: string }`

### `PATCH /api/profile`
Accepts `{ firm_name, firm_type, aum_range, regulator }`.
1. Verifies auth
2. Upserts the authenticated user's profile row
3. Returns `{ profile }`

### `POST /api/monitoring/refresh`
No body required.
1. Fetches regulatory updates from three jurisdiction sources in parallel:
   - **US**: Federal Register JSON API (SEC + FINRA)
   - **EU**: ESMA RSS + EBA RSS (falls back to `[]` gracefully if blocked)
   - **UK**: FCA RSS + PRA/Bank of England RSS (same fallback)
2. Parses RSS/Atom XML with a zero-dependency regex parser in `lib/monitoring.ts`
3. Tags each item with its `jurisdiction` (`'US'` | `'EU'` | `'UK'`)
4. Scores each item 1–5 for relevance and extracts affected rule citations (US, EU, and UK rules)
5. Upserts into `regulatory_updates` (deduped on `url`)
6. Returns `{ inserted: number, parsed: number }`

### `GET /api/monitoring/feed`
Returns all stored `regulatory_updates` ordered by `published_at` descending, limited to 500 rows. Each item includes a `jurisdiction` field for client-side tab filtering.

### `POST /api/monitoring/digest`
Sends the weekly regulatory updates email digest via Resend to the authenticated user's email address.

---

## Regulatory Library

Three jurisdiction-specific typed arrays, each consumed by `buildSystemPrompt(jurisdiction)` in `lib/claude.ts`. The prompt builder is memoised per jurisdiction using a `Map<Jurisdiction, string>`.

### United States — `lib/regulatory-library.ts` (32 requirements)

| Framework | Coverage |
|---|---|
| FINRA | Rules 3110, 3120, 2010, 2111, 4511, 3310, 3130 |
| SEC | Rules 17a-3, 17a-4, Reg S-P, 206(4)-7, 204A-1, Reg S-ID, 15c3-3, 206(4)-2 |
| AML/BSA | Customer ID, SAR, CTR, CDD, Beneficial Ownership, OFAC Sanctions |
| Reg BI | Best Interest, Form CRS, Conflicts of Interest, Compliance, Fiduciary Duty |
| BCP | Business Continuity, Annual Review, Internal Inspections, Incident Response |

### European Union — `lib/eu-regulatory-library.ts` (23 requirements)

| Framework | Coverage |
|---|---|
| MiFID II | Organisational Requirements, Suitability, Best Execution, Conflicts of Interest, Client Communication, Product Governance |
| GDPR | Lawfulness of Processing, Controller Accountability, Security, Breach Notification, DPO Designation |
| AMLD6 | AML Programme, CDD, Enhanced Due Diligence, Beneficial Ownership, Suspicious Transaction Reporting |
| DORA | ICT Risk Management, Incident Reporting, Resilience Testing |
| SFDR | Sustainability Risk Policy, Principal Adverse Impact Disclosure |
| MAR | Market Abuse Prevention, Disclosure of Inside Information |

### United Kingdom — `lib/uk-regulatory-library.ts` (19 requirements)

| Framework | Coverage |
|---|---|
| SM&CR | Senior Management Arrangements, Statements of Responsibilities, Certification Regime |
| FCA Conduct | Consumer Duty, Best Interests Rule, Suitability Assessment, Financial Promotions |
| FCA Systems | Compliance Function, Risk Assessment & Control, Conflicts of Interest Policy |
| UK AML | AML Policies & Procedures, CDD, Enhanced Due Diligence (PEPs), Training |
| UK GDPR | Data Processing Principles, Security of Processing, ICO Registration & DPO |
| FCA OpRes | Important Business Services & Impact Tolerances, Resilience Testing & Self-Assessment |

Each requirement has: `id`, `rule`, `framework`, `requirement`, `description`, `defaultRisk`.

---

## Design System

**Aesthetic:** Editorial compliance — Big 4 audit report aesthetic. Serif headings, mono for citations and codes, clean data tables. Nothing that looks like a generic SaaS tool.

**Fonts:** Playfair Display (headings) · Inter (body) · DM Mono (citations, codes, risk badges)

**Colours:**
```
--green:      #1a3a2a   (primary brand)
--green-2:    #2d5c44   (hover/active)
--green-tint: #e4efe8   (backgrounds)
--bg:         #f5f0e8   (page background)
--bg-2:       #ede7d9   (card backgrounds)
--ink:        #1a1714   (primary text)
--ink-2:      #3d3830   (secondary text)
--ink-3:      #7a7268   (tertiary/labels)
--rule:       #ccc4b8   (borders/dividers)
--red:        #8b2020   (High risk)
--amber:      #8b5a10   (Medium risk)
--blue:       #1a3060   (Low risk)
--gold:       #b8820a   (accents)
```

**Rules:** Risk badges always use `DM Mono`, uppercase, colour-coded. Max border-radius: 4px. No drop shadows — use borders.

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend
RESEND_API_KEY=re_...

# App URL (set to production URL on Vercel)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are server-only and must never be prefixed with `NEXT_PUBLIC_`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (with the migrations in `supabase/migrations/` applied)
- An Anthropic API key

### Installation

```bash
git clone https://github.com/bitcoinow/RegisAI.git
cd RegisAI
npm install
cp .env.example .env.local
# fill in .env.local with your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Setup

Apply all migrations to your Supabase project via the CLI:

```bash
supabase db push
```

Or run each file in `supabase/migrations/` in chronological order via the Supabase SQL editor.

---

## Build Status

### Phase 1 — Demo-ready (complete)
- [x] Gap analysis engine (Claude prompt + 32-requirement US regulatory library)
- [x] Next.js 16 App Router scaffold
- [x] PDF upload + server-side text extraction
- [x] Gap analysis API route (`/api/analyse`)
- [x] Audit report page with expandable findings
- [x] Supabase auth (email/password + Google OAuth)
- [x] User dashboard (audit history with risk summary)
- [x] Demo environment (`/demo/clearview` — no login required)
- [x] Deployed to Vercel (auto-deploy from `main`)

### Phase 2 — Design partner onboarding (complete)
- [x] Finding status tracking (open / in-progress / resolved toggle on finding cards)
- [x] Regulatory monitoring feed (Federal Register / ESMA / EBA / FCA / PRA → `/monitoring`)
- [x] PDF export of audit report (browser `window.print()` with print stylesheet)
- [x] Weekly email digest of regulatory updates (Resend)

### Phase 3 — Pre-YC (complete)
- [x] EU & UK regulatory libraries (MiFID II, GDPR, AMLD6, DORA, SFDR, MAR + FCA Rules, SM&CR, UK GDPR)
- [x] EU & UK regulatory monitoring feed (ESMA, EBA, FCA, PRA — jurisdiction tab selector on monitoring page)
- [x] Policy drafting per finding (Claude generates ready-to-paste compliance manual language, persisted + copy-to-clipboard)
- [x] Design partner onboarding flow (firm profile collection post-signup)
- [x] B2B marketing landing page (hero, pricing, testimonials, CTA)
- [x] Geo-based default pricing currency (USD / EUR / GBP from Vercel geo headers)
- [x] Legal pages (Privacy Policy, Terms of Service, Security, About)
- [x] Mobile auth stability (stale session and network timeout handling)

### Phase 4 — Revenue
- [ ] Stripe billing integration
- [ ] Multi-document support per firm
- [ ] Audit prep package export (ZIP of all evidence)

---

## Coding Standards

- TypeScript strict mode. No `any`.
- All API routes handle errors and return typed responses.
- Supabase: use server client in API routes, browser client in components.
- Claude API calls live only in `lib/claude.ts`.
- Server-only env vars are never prefixed with `NEXT_PUBLIC_`.

---

## Demo Script

When running a CCO demo:

1. Open `/demo/clearview` — pre-seeded, no login required
2. Walk through High-risk findings first
3. Point to rule citations — every finding maps to a specific FINRA or SEC requirement
4. Show risk breakdown (High / Medium / Low counts)
5. Click "Draft Policy Language" on a finding — Claude generates ready-to-paste remediation text in seconds
6. Close: "We're onboarding 3 design partners at no cost. Is your firm a fit?"

---

## Disclaimer

All outputs are recommendations, not legal advice. High-risk findings always require human review. Regis is not a replacement for a qualified compliance officer — it is a tool to augment one.
