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
2. **Analyse** (`POST /api/analyse`) — Retrieves document text → calls `runGapAnalysis()` in `lib/claude.ts` → creates record in `audits` table with findings JSON → status becomes `complete`
3. **Display** (`app/(app)/audit/[id]/page.tsx`) — Renders `<AuditReport>` component with findings sorted by risk level

### Key Directories

- `app/(app)/` — Protected routes (dashboard, audit, monitoring); auth checked in layout
- `app/(auth)/` — Public auth routes (login, magic link callback)
- `app/api/` — Two API routes: `documents` and `analyse`
- `lib/` — Server-side utilities: Claude integration, Supabase clients, PDF parsing, regulatory library
- `components/audit/` — Upload form and audit report display
- `types/index.ts` — All shared TypeScript types and enums

### AI Integration (`lib/claude.ts`)

Uses `claude-sonnet-4-20250514`. The system prompt embeds all regulatory requirements for the selected jurisdiction from one of three libraries:
- `lib/regulatory-library.ts` — 32 US requirements (FINRA, SEC, AML/BSA, Reg BI, BCP)
- `lib/eu-regulatory-library.ts` — 23 EU requirements (MiFID II, GDPR, AMLD6, DORA, SFDR, MAR)
- `lib/uk-regulatory-library.ts` — 19 UK requirements (FCA Rules, UK AML, UK GDPR, SM&CR, FCA OpRes)

`buildSystemPrompt(jurisdiction)` is memoised per jurisdiction using a `Map<Jurisdiction, string>`. `runGapAnalysis(text, firmName?, jurisdiction?)` defaults to `'US'`. Document text is truncated to 12,000 characters before sending. Returns structured JSON with `gaps[]`, `strengths[]`, and `priorityActions[]`.

`draftPolicyLanguage(finding, jurisdiction?, firmName?)` generates ready-to-paste compliance-manual language that closes a single finding's gap. It returns formal policy prose (parsed from a `{ "policy_language": "..." }` JSON response). Invoked from `POST /api/findings/[id]/draft`, which verifies ownership via the owning audit, persists the result to `findings.drafted_policy`, and returns it. The audit report renders the draft inline per finding with a copy-to-clipboard and regenerate action.

### Authentication & Authorization

- **Middleware** (`middleware.ts`): Refreshes Supabase sessions on every request; protects `/dashboard`, `/audit`, `/monitoring`; redirects unauthenticated users to `/login`
- **Magic link only** — No password auth; handled via `app/auth/callback/route.ts`
- **Row-Level Security**: Supabase RLS policies enforce user isolation at the database level for all tables

### Database (Supabase)

Tables: `profiles`, `documents`, `audits`, `findings`, `regulatory_updates`

Migrations in `supabase/migrations/`. The initial schema is `20260504000000_initial.sql`. `20260527000000_audits_add_jurisdiction.sql` adds the `jurisdiction` column (default `'US'`) to the `audits` table. `20260528000000_regulatory_updates_add_jurisdiction.sql` adds the `jurisdiction` column (default `'US'`) to the `regulatory_updates` table. `20260601000000_findings_add_drafted_policy.sql` adds the nullable `drafted_policy` column to the `findings` table. A trigger auto-creates a profile row on new user signup.

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

`app/demo/clearview/page.tsx` is a public (no auth) page that renders a seeded demo audit from `lib/demo-data.ts` (Clearview Capital Management, 18 gaps). Use this to test report rendering without going through the full upload/analyse flow.

### Styling Conventions

Custom Tailwind colors: `green` (dark, #1a3a2a), `ink` (text), `rule` (borders), `risk-high/medium/low` (findings). All border radii are 4px. Fonts: Inter (body), Playfair Display (headings), DM Mono (code/mono).
