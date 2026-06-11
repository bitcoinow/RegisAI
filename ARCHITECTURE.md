# Regis AI — Architecture

## Overview

Regis AI is a Next.js application with a Supabase backend. The platform is built as a set of reusable, framework-agnostic service modules. UK/FCA is the first regulatory framework configuration — not a hardcoded assumption.

**Stack:** Next.js (App Router) · TypeScript · Supabase (Postgres + Storage + Auth) · Claude (Anthropic) · Resend · Vercel

---

## AIOS Module Map

The platform is structured around eight logical service modules. Each maps to existing code today. As the platform scales, these modules become independently deployable services.

| Module | Description | Current Code |
|--------|-------------|-------------|
| **Document Intelligence** | PDF ingestion, text extraction, storage | `lib/pdf.ts`, `app/api/documents/` |
| **Framework Mapping** | Regulatory requirements library, scope resolution | `lib/uk-regulatory-library.ts`, `lib/eu-regulatory-library.ts`, `lib/regulatory-library.ts`, `lib/coverage.ts` |
| **Gap Analysis** | AI-powered content-to-requirement mapping | `lib/claude.ts` → `runGapAnalysis()` |
| **Recommendation Engine** | Policy language drafting per finding | `lib/claude.ts` → `draftPolicyLanguage()` |
| **Audit Report Generator** | Findings display, coverage matrix, posture score | `app/(app)/audit/[id]/page.tsx`, `components/audit/` |
| **Organisation Service** | User profiles, firm context, onboarding | `lib/supabase/`, `app/api/profile/`, `app/onboarding/` |
| **Activity Logging** | Finding status transitions, reviewer attribution, audit trail | `findings.reviewed_by`, `reviewed_at`, `review_note` columns |
| **Notification Service** | Regulatory digest emails, monitoring alerts | `app/api/monitoring/digest/route.ts` (Resend) |

---

## Framework Architecture

Regulatory frameworks are configurable modules, not hardcoded logic. The entry point for all framework-scoped operations is:

```typescript
// lib/coverage.ts
getScopedRequirements(jurisdiction: Jurisdiction, framework?: RegulatoryFramework): RegulatoryRequirement[]
```

Adding a new jurisdiction or framework requires:
1. A new library file (e.g. `lib/sg-regulatory-library.ts` for MAS/Singapore)
2. Updating `getScopedRequirements()` to include the new library
3. Adding the new `Jurisdiction` and `RegulatoryFramework` values to `types/index.ts`

No changes to the Claude integration, API routes, or UI components are required.

---

## Data Flow

```
User uploads PDF
    ↓
POST /api/documents
  → pdf-parse extracts text
  → stored in Supabase Storage
  → document record created (status: 'uploaded')
    ↓
POST /api/analyse
  → getScopedRequirements(jurisdiction, framework)
  → buildSystemPrompt(jurisdiction, framework) [memoised]
  → Claude: runGapAnalysis(text, firmName, jurisdiction, framework)
  → audit record created with findings JSON
  → buildCoverageMatrix() → coverage saved
  → computeComplianceScore() → posture score saved
  → (if re-scan) computeDelta(parentFindings, currentFindings)
    ↓
GET /app/audit/[id]
  → AuditReport renders findings, coverage matrix, posture score
  → (if re-scan) AuditComparison renders delta view
    ↓
POST /api/findings/[id]/draft
  → draftPolicyLanguage(finding, jurisdiction, firmName)
  → drafted_policy persisted to findings table
    ↓
PATCH /api/findings/[id]/status
  → status: open | in_progress | resolved | risk_accepted
  → reviewed_by, reviewed_at, review_note recorded
```

---

## Database Schema

```
profiles         — user/firm context (firm_name, firm_type, aum_range, regulator, plan, is_dev)
documents        — uploaded PDFs (file_name, extracted_text, page_count, status)
audits           — analysis runs (jurisdiction, framework, parent_audit_id, compliance_score, requirements_total/met, gaps_closed/new/persisting)
findings         — individual gaps (req_id, risk, gap, recommendation, status, drafted_policy, reviewed_by, reviewed_at, review_note)
regulatory_updates — monitoring feed (regulator, jurisdiction, title, url, relevance_score)
```

`profiles.is_dev` controls jurisdiction access. Regular users are locked to UK; `is_dev = true` grants US/EU/UK access (enforced in `NewAuditForm`, `MonitoringClient`, and `/api/analyse`).

`findings.status` values: `open` | `in_progress` | `resolved` | `risk_accepted`. Any move away from `open` records the reviewer's name, timestamp, and an optional rationale note.

All tables have Row-Level Security (RLS) policies enforcing user isolation. No cross-user data access is possible.

---

## Key Boundaries

| Rule | Why |
|------|-----|
| FCA/UK is the first framework config, not the only one | Architecture must support SEC, MiFID II, DORA without refactor |
| All framework logic lives in `lib/*-regulatory-library.ts` | Keeps framework knowledge out of API routes and UI |
| `getScopedRequirements()` is the single entry point | One function to change when adding/removing frameworks |
| System prompt is memoised per `jurisdiction:framework` key | Avoids redundant string construction on every request |
| Document text truncated to 12,000 chars | Fits within Claude context window; chunking strategy planned for Phase 2 |
| `createClient()` for auth operations, `createServiceClient()` for DB operations | Service role key bypasses RLS; never use for auth |

---

## Directory Structure

```
app/
  (app)/              Protected routes (dashboard, audit, documents, monitoring, settings)
    monitoring/
      page.tsx              Thin RSC wrapper — fetches is_dev, passes to MonitoringClient
      monitoring-client.tsx Client component with jurisdiction locking
  (auth)/             Public auth routes (login, signup, forgot-password)
  (legal)/            Legal pages (about, privacy, terms, security)
  api/
    analyse/          POST — gap analysis pipeline (jurisdiction enforcement, re-scan delta)
    documents/        POST — upload; [id]/ DELETE + download/GET
    findings/[id]/    draft/POST + status/PATCH (incl. risk_accepted)
    monitoring/       feed/GET, refresh/POST, digest/POST
    profile/          PATCH — upsert firm profile
    request-access/   POST — early access form → Resend email
  auth/               Auth flow handlers (callback, reset-password, mfa)
  demo/               Public demos (clearview, gdpr)
  onboarding/         Post-signup onboarding
  page.tsx            Root: auth check → dashboard or landing page

lib/
  claude.ts           Claude integration (runGapAnalysis, draftPolicyLanguage, buildSystemPrompt)
  coverage.ts         Framework scope, coverage matrix, posture score, delta computation
  regulatory-library.ts       32 US requirements (FINRA, SEC, AML/BSA, Reg BI, BCP)
  eu-regulatory-library.ts    34 EU requirements (MiFID II, GDPR, AMLD6, DORA, SFDR, MAR)
  uk-regulatory-library.ts    19 UK requirements (FCA Rules, UK AML, UK GDPR, SMCR, FCA OpRes)
  monitoring.ts       Regulatory feed fetching (FCA, PRA, SEC/FINRA, ESMA, EBA)
  supabase/           Supabase client helpers (client.ts, server.ts)
  pdf.ts              PDF text extraction
  currency.ts         Country-to-currency mapping
  env.ts              Startup environment variable validation
  demo-data.ts        Seeded demo audit data (Clearview Capital + Northwind GDPR)

components/
  marketing/          Landing page (UK compliance scenario & policy risk engine)
  audit/              AuditReport, UploadForm, CoverageMatrix, AuditComparison, NewAuditForm
  documents/          DocumentActions (download + delete)
  settings/           MfaSettings (TOTP enrol/manage)
  ui/                 Shared UI primitives (logo, nav, risk-badge, sign-out-button)

types/
  index.ts            All shared TypeScript types and enums (Jurisdiction, RegulatoryFramework, Profile incl. is_dev)

supabase/
  migrations/         SQL migration files (applied in order)
```

---

## Authentication Architecture

- **Session refresh:** `proxy.ts` middleware refreshes Supabase sessions on every request
- **Route protection:** Middleware protects `/dashboard`, `/audit`, `/monitoring`, `/onboarding`
- **Sign-in methods:** Email + password, Google OAuth
- **MFA:** Optional TOTP via `app/auth/mfa`
- **Password recovery:** PKCE flow via `app/auth/callback` → `app/auth/reset-password`
- **Callback handler:** Handles both PKCE (recovery) and OAuth code exchange flows

---

## Environment Variables

```bash
# Server-side (secret)
ANTHROPIC_API_KEY          # Claude API
SUPABASE_SERVICE_ROLE_KEY  # DB operations (bypasses RLS — never expose)
RESEND_API_KEY             # Email delivery

# Public (client-safe)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Validated at startup in `lib/env.ts` — the app throws at import time if any are missing.
