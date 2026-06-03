# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking (no emit)
```

There are no tests configured in this project.

## Architecture

**Regis AI** is a compliance auditing SaaS for financial firms (RIA, Fintech, Insurance, Banks). Users upload PDF compliance documents; the app extracts text, runs a gap analysis via Claude, and presents findings with risk ratings.

### Core Audit Flow

1. **Upload** (`POST /api/documents`) — PDF upload → pdf-parse extracts text → stored in Supabase Storage + `documents` table with status `uploaded`
2. **Analyse** (`POST /api/analyse`) — Retrieves document text → calls `runGapAnalysis()` in `lib/claude.ts` → creates record in `audits` table with findings JSON → status becomes `complete`. The request may include a `framework` (scopes the analysis to a single framework, e.g. GDPR) and a `parent_audit_id` (marks the run as a re-scan and triggers delta computation).
3. **Display** (`app/(app)/audit/[id]/page.tsx`) — Renders `<AuditReport>` with findings sorted by risk, a coverage matrix of every in-scope requirement, and (for re-scans) an `<AuditComparison>` before→after view.

### Scope, Posture & Re-scan (`lib/coverage.ts`)

The single source of truth for "what is in scope" and the derived metrics. Reused by the analysis prompt, the analyse route, and the report UI:
- `getScopedRequirements(jurisdiction, framework?)` — the in-scope requirement list (whole jurisdiction, or one framework).
- `buildCoverageMatrix(jurisdiction, framework, findings)` — every requirement tagged `met` or `gap` (the "complete coverage" proof).
- `computeComplianceScore(requirementsTotal, {high,medium,low})` — risk-weighted **posture score** 0–100 (High=3, Med=2, Low=1).
- `computeDelta(parentFindings, currentFindings)` — matches by requirement id and classifies each as `closed` / `persisting` / `improved` / `new`.

### Key Directories

- `app/(app)/` — Protected routes (dashboard, audit, monitoring); auth checked in layout
- `app/(auth)/` — Public auth routes (login, signup, forgot-password)
- `app/auth/` — Auth flow handlers (callback, reset-password, mfa challenge)
- `app/api/` — API routes: `documents`, `analyse`, `findings/[id]/draft`, `findings/[id]/status`, `monitoring/*`, `profile`
- `lib/` — Server-side utilities: Claude integration, Supabase clients, PDF parsing, regulatory libraries, `coverage.ts` (scope/score/delta)
- `components/audit/` — Upload form, audit report, coverage matrix, re-scan comparison
- `types/index.ts` — All shared TypeScript types and enums

### AI Integration (`lib/claude.ts`)

Uses `claude-sonnet-4-20250514`. The system prompt embeds the in-scope regulatory requirements (a whole jurisdiction, or a single framework) from one of three libraries:
- `lib/regulatory-library.ts` — 32 US requirements (FINRA, SEC, AML/BSA, Reg BI, BCP)
- `lib/eu-regulatory-library.ts` — 34 EU requirements (MiFID II, **16 GDPR articles**, AMLD6, DORA, SFDR, MAR)
- `lib/uk-regulatory-library.ts` — 19 UK requirements (FCA Rules, UK AML, UK GDPR, SM&CR, FCA OpRes)

Each library exports a `get…RequirementsByFramework(framework)` helper; `lib/coverage.ts` wraps them in `getScopedRequirements(jurisdiction, framework?)`. `buildSystemPrompt(jurisdiction, framework?)` is memoised on a `${jurisdiction}:${framework ?? 'ALL'}` key (`Map<string, string>`). `runGapAnalysis(text, firmName?, jurisdiction?, framework?)` defaults to `'US'` / whole-jurisdiction. Document text is truncated to 12,000 characters before sending. Returns structured JSON with `gaps[]`, `strengths[]`, and `priorityActions[]`.

`draftPolicyLanguage(finding, jurisdiction?, firmName?)` generates ready-to-paste compliance-manual language that closes a single finding's gap. It returns formal policy prose (parsed from a `{ "policy_language": "..." }` JSON response). Invoked from `POST /api/findings/[id]/draft`, which verifies ownership via the owning audit, persists the result to `findings.drafted_policy`, and returns it. The audit report renders the draft inline per finding with a copy-to-clipboard and regenerate action.

### Human Review Workflow

`PATCH /api/findings/[id]/status` sets a finding's status to `open` / `in_progress` / `resolved` / `risk_accepted` (a documented residual-risk acceptance). Any move away from `open` records `reviewed_by`, `reviewed_at`, and an optional `review_note` (rationale) — the audit trail. The report renders the attribution line and lets reviewers edit the rationale inline.

### Authentication & Authorization

- **Middleware** (`proxy.ts`): Refreshes Supabase sessions on every request; protects `/dashboard`, `/audit`, `/monitoring`, `/onboarding`; redirects unauthenticated users to `/login` and authenticated users away from `/login`
- **Sign-in methods** — Email + password (`signInWithPassword`) and Google OAuth (`signInWithOAuth`). Signup at `app/(auth)/signup`. No magic link.
- **MFA (optional TOTP)** — Enrolled/managed in `app/(app)/settings` via the `MfaSettings` component. The app layout enforces an AAL2 challenge at `app/auth/mfa` before dashboard access when a verified factor exists.
- **Password recovery** — `app/(auth)/forgot-password` calls `resetPasswordForEmail`; the recovery email link must point at `/auth/callback?token_hash=...&type=recovery` (configured in the Supabase email template). The callback (`app/auth/callback/route.ts`) verifies via `verifyOtp` for the `token_hash` flow (and `exchangeCodeForSession` for the OAuth `code` flow), then redirects recovery sessions to `app/auth/reset-password` to set a new password.
- **Row-Level Security**: Supabase RLS policies enforce user isolation at the database level for all tables

### Database (Supabase)

Tables: `profiles`, `documents`, `audits`, `findings`, `regulatory_updates`

Migrations in `supabase/migrations/`. The initial schema is `20260504000000_initial.sql`. `20260527000000_audits_add_jurisdiction.sql` adds the `jurisdiction` column (default `'US'`) to the `audits` table. `20260528000000_regulatory_updates_add_jurisdiction.sql` adds the `jurisdiction` column (default `'US'`) to the `regulatory_updates` table. `20260601000000_findings_add_drafted_policy.sql` adds the nullable `drafted_policy` column to the `findings` table. `20260603000000_audits_add_framework_and_rescan.sql` adds `framework`, `parent_audit_id`, `scan_number`, `compliance_score`, `requirements_total`/`requirements_met`, and `gaps_closed`/`gaps_new`/`gaps_persisting` to `audits` (re-scan + posture support). `20260603000001_findings_add_review_and_riskaccept.sql` adds `reviewed_by`/`reviewed_at`/`review_note` to `findings` and widens the status check to include `risk_accepted`. A trigger auto-creates a profile row on new user signup.

### Regulatory Monitoring (`lib/monitoring.ts`)

`fetchAndParseFeeds()` fetches from three jurisdiction sources in parallel and returns a combined `ParsedUpdate[]` (each item has a `jurisdiction` field):
- US: Federal Register JSON API (SEC/FINRA articles)
- EU: ESMA RSS + EBA RSS — fetched with a zero-dep regex parser; returns `[]` gracefully if blocked
- UK: FCA RSS + PRA/Bank of England RSS — same fallback behaviour

Each `ParsedUpdate` includes: `regulator`, `jurisdiction`, `title`, `summary`, `url`, `published_at`, `relevance_score` (1–5), `affected_rules[]`, `raw_content`. Items are upserted to `regulatory_updates` on `url` conflict. The monitoring page (`app/(app)/monitoring/page.tsx`) filters the feed by a US/EU/UK tab selector.

### Environment Variables

Required server-side: `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`
Required public: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Validated at startup in `lib/env.ts` — the app will throw at import time if any are missing.

### Demo Mode

`app/demo/clearview/page.tsx` is a public (no auth) page that renders a seeded demo audit from `lib/demo-data.ts` (Clearview Capital Management, 18 gaps, US). Use this to test report rendering without going through the full upload/analyse flow.

`app/demo/gdpr/page.tsx` is the single-framework proof point: a public page that toggles between two linked seeded audits for Northwind Payments (`GDPR_DEMO_V1` → `GDPR_DEMO_V2` in `lib/demo-data.ts`), showing the full lifecycle for GDPR — 13 gaps at 40% posture, then a re-scan with 10 gaps closed at 90%, the coverage matrix, and the review audit trail (including a `risk_accepted` finding). Each `<AuditReport>` is keyed by `audit.id` so toggling remounts cleanly (demo findings share requirement-id keys).

### Styling Conventions

Custom Tailwind colors: `green` (dark, #1a3a2a), `ink` (text), `rule` (borders), `risk-high/medium/low` (findings). All border radii are 4px. Fonts: Inter (body), Playfair Display (headings), DM Mono (code/mono).
