# RegisAI — Project Status & Living Document

> **Last updated:** 2026-06-09
> This file is the single source of truth for project state, feature history, and planned work. Updated at the end of every session with new plans and changes.

---

## What Is RegisAI

UK Compliance Scenario & Policy Risk Engine. AI-assisted compliance scenario risk assessment, policy gap analysis, and human review workflows for UK compliance, legal, risk, and governance teams. Initial vertical: UK media and advertising companies (hospitality/gifts, agency relationships, vendor onboarding, personal data, anti-bribery, sanctions). FCA/financial services is future expansion.

**Beachhead:** UK media & advertising compliance teams. Platform supports US and EU frameworks — UK is the primary market focus.

**Stack:** Next.js 16 (App Router) · TypeScript · Supabase (Auth + DB + Storage) · Anthropic Claude API · Tailwind CSS · Vercel

---

## Current State (as of 2026-06-04)

**Status: Early Access / Pre-launch — core feature set complete, demo-ready**

### Live Features

| Feature | Status | Notes |
|---|---|---|
| PDF upload + text extraction | ✅ Live | `pdf-parse`, stored in Supabase Storage |
| Gap analysis (Claude Sonnet) | ✅ Live | Structured JSON with gaps, strengths, priority actions |
| Audit report UI | ✅ Live | Sorted by risk, coverage matrix |
| Multi-jurisdiction support | ✅ Live | US (32 req), EU (34 req), UK (19 req) |
| Framework scoping (e.g. GDPR-only) | ✅ Live | Single-framework prompt memoisation |
| Re-scan / delta analysis | ✅ Live | Closed/persisting/improved/new gap classification |
| Posture score (0–100) | ✅ Live | Risk-weighted: High=3, Med=2, Low=1 |
| Coverage matrix | ✅ Live | Every in-scope requirement tagged met/gap |
| Human review workflow | ✅ Live | open → in_progress → resolved / risk_accepted + audit trail |
| Policy language drafting | ✅ Live | Per-finding, AI-generated compliance manual prose |
| Regulatory monitoring feed | ✅ Live | US (Federal Register), EU (ESMA/EBA RSS), UK (FCA/PRA RSS) |
| Document library | ✅ Live | List, view/download original PDF, delete |
| Authentication (email + Google) | ✅ Live | Supabase Auth, PKCE, MFA (TOTP), password reset |
| Demo pages (public) | ✅ Live | `/demo/clearview` (US RIA), `/demo/gdpr` (GDPR re-scan lifecycle) |
| Landing page | ✅ Live | UK media & advertising MVP positioning; 11 sections; early access form |

---

## Architecture Snapshot

```
app/
  (app)/          → Protected routes (dashboard, audit, monitoring, documents, settings)
  (auth)/         → Public auth (login, signup, forgot-password)
  auth/           → Auth callbacks (callback, reset-password, mfa)
  api/            → API routes (documents, analyse, findings/[id]/draft+status, monitoring, profile)
  demo/           → Public demo pages (clearview, gdpr)
  (legal)/        → About, Privacy, Terms, Security
  page.tsx        → Root: auth check → dashboard | LandingPage

lib/
  claude.ts               → runGapAnalysis(), draftPolicyLanguage(), buildSystemPrompt() (memoised)
  coverage.ts             → getScopedRequirements(), buildCoverageMatrix(), computeComplianceScore(), computeDelta()
  regulatory-library.ts   → 32 US requirements
  eu-regulatory-library.ts → 34 EU requirements
  uk-regulatory-library.ts → 19 UK requirements
  monitoring.ts           → fetchAndParseFeeds() (US/EU/UK in parallel)
  supabase.ts / supabase-server.ts → client helpers
  env.ts                  → startup validation

components/
  audit/          → UploadForm, AuditReport, CoverageMatrix, AuditComparison, FindingCard
  marketing/      → LandingPage (single-file, ~1100 lines)
  ui/             → Logo, shared UI primitives
```

### Database Tables
`profiles` · `documents` · `audits` · `findings` · `regulatory_updates`

### Migrations (in order)
| Migration | What it adds |
|---|---|
| `20260504000000_initial.sql` | Base schema |
| `20260527000000_audits_add_jurisdiction.sql` | `jurisdiction` col on `audits` |
| `20260528000000_regulatory_updates_add_jurisdiction.sql` | `jurisdiction` col on `regulatory_updates` |
| `20260601000000_findings_add_drafted_policy.sql` | `drafted_policy` col on `findings` |
| `20260603000000_audits_add_framework_and_rescan.sql` | Framework, re-scan, posture score cols |
| `20260603000001_findings_add_review_and_riskaccept.sql` | Review/risk-accept audit trail cols |
| `20260603000002_documents_add_delete_rls.sql` | RLS policies for document deletion |

---

## Feature History (Chronological)

### 2026-05-04 — Initial scaffold
- Full project scaffold from CLAUDE.md template

### 2026-05-27–29 — Core audit flow + multi-jurisdiction
- PDF upload, gap analysis, audit report, US/EU/UK regulatory libraries
- Monitoring feed (Federal Register, ESMA, EBA, FCA, PRA)
- Policy language drafting per finding

### 2026-06-01 — Drafted policy persistence
- `POST /api/findings/[id]/draft` — generates + stores policy language
- Inline copy + regenerate UI in audit report

### 2026-06-03 — GDPR single-framework proof point
- Framework scoping (pass `framework` param to `/api/analyse`)
- Re-scan delta engine (`computeDelta` in `lib/coverage.ts`)
- Posture score (0–100, risk-weighted)
- Human review workflow (`open → in_progress → resolved / risk_accepted`)
- `risk_accepted` status with rationale/reviewer audit trail
- Coverage matrix component
- Public `/demo/gdpr` page (Northwind Payments GDPR lifecycle demo)
- GDPR Re-scan CTA added to landing page CTAFooter

### 2026-06-03 — Document library
- `/documents` route — list all uploaded PDFs
- Download via signed URL (`/api/documents/[id]/download`)
- Delete with cascade cleanup (`/api/documents/[id]` DELETE)
- RLS migration for delete policies

### 2026-06-04 — Landing page polish
- EU requirement count corrected: 23 → 34 (adds AMLD6, MAR)
- Total requirement count: 74 → 85
- New FAQ entry: "Can I see the product before signing up?" — links both demos
- Demo nav bars: breadcrumbs + cross-demo links on both `/demo/clearview` and `/demo/gdpr`
- GDPR Re-scan Demo CTA added to CTAFooter alongside "View Sample Audit"

### 2026-06-09 — MVP landing page redesign (UK compliance scenario & policy risk engine)
- Complete rewrite of `components/marketing/landing-page.tsx` (~1485 → ~850 lines)
- Product repositioned from FCA-only financial services to UK compliance scenario & policy risk engine targeting media and advertising companies
- Removed: fake testimonials, public pricing (3 tiers), FAQ, FCA framework coverage grid, document types grid, future expansion roadmap, 6-card FCA features, enterprise claims, CTAFooter
- New 11-section structure: Hero → Problem → What Regis Does → How It Works → Core MVP Modules → Example Scenarios → Industry Focus → Compliance Areas & Policy Types → Responsible AI → Early Access Form → Footer
- `ModuleStatusBadge` component: Scenario Risk Analyzer marked "Coming soon"; all other modules marked "Live"
- New `app/api/request-access/route.ts` — Resend email handler for early access form → wordroom33@gmail.com
- Updated `app/layout.tsx` metadata: title + description reflect new positioning
- Deleted untracked `middleware.ts` (was re-exporting proxy.ts, caused pre-existing build conflict)
- Build: `tsc --noEmit` passes, `next build` passes (27 pages, 11 API routes)
- Primary CTA "Analyse a Sample Scenario" routes to `/demo/gdpr`
- Set `RESEND_FROM_EMAIL` env var to a verified Resend domain for production email delivery

### 2026-06-05 — UK/FCA market repositioning
- Landing page repositioned for UK financial services beachhead market
- Hero: new FCA-focused headline ("AI-Assisted FCA Compliance Reviews for UK Financial Firms"), subheadline, CTAs
- PAINS: updated to UK/FCA context (£50K+ spend, 4-8 wks prep, 1 in 3 firms)
- FEATURES: updated "US, EU & UK Coverage" → "FCA Framework Coverage"
- STEPS: expanded from 4 to 5 steps (added "Export Audit-Ready Report")
- UseCases: updated from 3 generic cards to 6 FCA firm-type cards
- AuditMockup: updated to show FCA findings (Consumer Duty, SMCR, OpRes, BCP)
- New sections: DocumentTypes (10 doc types), FrameworkCoverage (10 FCA areas), ExampleFindings (3 illustrative findings), TrustSection (6 trust pillars), FutureExpansion (FCA → DORA/MiFID → SEC roadmap)
- PLANS: updated descriptions for UK firm positioning
- Footer: added compliance disclaimer ("does not provide legal or regulatory advice")
- Testimonials: updated to FCA/UK context
- CTAFooter: "Book a Demo" replaces "GDPR Re-scan Demo" (with "Soon" badge)
- New docs: ROADMAP.md, MVP_SCOPE.md, ARCHITECTURE.md

---

## Planned / Next Up

> Move items here when agreed with user; strike through when shipped.

**Phase 1 (UK media & advertising beachhead — immediate):**
- [ ] Scenario Risk Analyzer module (currently marked "Coming soon" on landing page)
- [ ] Set `RESEND_FROM_EMAIL` to verified Resend sender domain for production early access emails
- [ ] UK media & advertising demo page (currently using `/demo/gdpr` as primary CTA target — mismatch)
- [ ] Profile management UI in Settings (currently only MFA; onboarding promises profile editing)
- [ ] Export audit report as PDF (currently display-only; print-via-browser available)
- [ ] Stripe billing integration (early access → paid tiers)

**Phase 2 (platform maturity):**
- [ ] Multi-user team support (currently 1 user = 1 firm)
- [ ] Role-based access controls (Admin, Editor, Reviewer, Viewer)
- [ ] Bulk upload / multiple documents per audit
- [ ] Webhook / email notification when analysis completes
- [ ] Re-scan available for UK/EU frameworks (currently US only)

**Phase 3 (European expansion):**
- [ ] DORA framework library
- [ ] MiFID II framework library
- [ ] EU GDPR (separate from UK GDPR)
- [ ] AMLD6 updates

**Phase 4 (US market):**
- [ ] SEC/FINRA focused positioning and demo
- [ ] API access (Enterprise tier)
- [ ] SSO / SAML 2.0

---

## Environment Variables

| Variable | Side | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Server | Claude API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Admin DB operations |
| `RESEND_API_KEY` | Server | Transactional email |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key |

---

## Key Design Decisions

- **One firm per user** — `profiles` is 1:1 with `auth.users`; firm isolation via RLS on `user_id`
- **Document text truncated to 12,000 chars** before Claude call (cost + latency)
- **System prompt memoised** per `jurisdiction:framework` key — avoids rebuilding on every request
- **Demo mode** — `isDemo` prop on `<AuditReport>` disables real API calls; seeded data in `lib/demo-data.ts`
- **All border radii are 4px** — house style; do not use `rounded-lg` etc.
- **Fonts**: Inter (body), Playfair Display (headings), DM Mono (mono)
- **Auth flow**: PKCE for password recovery; `exchangeCodeForSession` for OAuth; MFA challenge at AAL2

---

## Useful Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

---

*This document is maintained by Claude Code. Update the "Last updated" date and relevant sections at the end of each working session.*
