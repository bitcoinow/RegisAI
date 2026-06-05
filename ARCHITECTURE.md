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
profiles         — user/firm context (firm_name, firm_type, aum_range, regulator, plan)
documents        — uploaded PDFs (file_name, extracted_text, page_count, status)
audits           — analysis runs (jurisdiction, framework, findings JSON, compliance_score, parent_audit_id)
findings         — individual gaps (req_id, risk, gap, recommendation, status, drafted_policy, review metadata)
regulatory_updates — monitoring feed (regulator, jurisdiction, title, url, relevance_score)
```

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
  (auth)/             Public auth routes (login, signup, forgot-password)
  (legal)/            Legal pages (about, privacy, terms, security)
  api/                API routes (documents, analyse, findings, monitoring, profile)
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
  demo-data.ts        Seeded demo audit data

components/
  marketing/          Landing page
  audit/              Audit report, upload form, coverage matrix, comparison
  ui/                 Shared UI primitives (logo, nav, risk-badge, sign-out-button)

types/
  index.ts            All shared TypeScript types and enums

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
