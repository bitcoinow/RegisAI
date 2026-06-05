# Regis AI — MVP Scope

## MVP Definition

The Regis AI MVP is a complete end-to-end compliance document review workflow for FCA-regulated firms. It is live and functional today.

---

## Target Market

**Jurisdiction:** United Kingdom  
**Regulator:** Financial Conduct Authority (FCA)  
**Firm Types:** Financial Advisers, Wealth Managers, Insurance Brokers, Fintech, Compliance Consultancies, Asset Managers

---

## MVP Workflow

```
Upload Document (PDF)
        ↓
  Extract Text
  (pdf-parse, 12,000 char limit)
        ↓
  Select Framework
  (FCA Handbook | Consumer Duty | OpRes | SMCR)
        ↓
  Map Content Against FCA Controls
  (lib/uk-regulatory-library.ts — 19 requirements)
        ↓
  Generate Potential Findings
  (Claude claude-sonnet-4-6, structured JSON output)
        ↓
  Generate Recommendations + Policy Language
  (draftPolicyLanguage() per finding)
        ↓
  Display Review Report
  (findings by risk, coverage matrix, posture score)
        ↓
  Human Review Workflow
  (open → in_progress → resolved | risk_accepted)
```

---

## In Scope (Built and Live)

### Document Management
- PDF upload via drag-and-drop or file picker
- Text extraction (pdf-parse)
- Document library with download and delete
- Status tracking: uploaded → analysing → complete → error

### Gap Analysis Engine
- Claude-powered analysis against UK regulatory library (19 requirements)
- Structured findings with: gap description, risk level (High/Medium/Low), regulatory citation, remediation recommendation
- Posture score 0–100 (risk-weighted)
- Coverage matrix (every requirement tagged met/gap)

### Re-scan and Delta Analysis
- Re-upload same document after remediation
- Delta comparison: closed / persisting / improved / new gaps
- Side-by-side posture comparison

### Policy Drafting
- Per-finding AI draft of compliance-manual language
- Formal regulatory voice, citing FCA expectation
- Editable inline, copy-to-clipboard, regenerate

### Human Review Workflow
- Status transitions: open → in_progress → resolved → risk_accepted
- Reviewer attribution (name, timestamp)
- Review note / rationale (audit trail)

### Regulatory Monitoring
- FCA, PRA, Bank of England RSS feed parsing
- Relevance scoring (1–5) by firm type
- UK/EU/US tab-filtered monitoring page
- Weekly email digest (Resend)

### Authentication
- Email + password signup/login
- Google OAuth
- Optional TOTP MFA
- Password recovery via email

### Demos (No Auth Required)
- `/demo/clearview` — US/RIA demo (Clearview Capital, 18 gaps)
- `/demo/gdpr` — GDPR re-scan lifecycle demo (Northwind Payments)

---

## Out of Scope for MVP

| Feature | Status | Notes |
|---------|--------|-------|
| PDF export | Not built | Print-via-browser available; structured PDF export in Phase 2 |
| Multi-user organisations | Not built | One user per firm today; multi-user in Phase 2 |
| Role-based access controls | Not built | Phase 2 |
| Stripe billing | Not built | Design partner access; billing in Phase 2 |
| API access | Not built | Enterprise Phase 3 |
| DOCX document support | Not built | PDF only today |
| Bulk upload | Not built | One document per audit today |
| Webhook notifications | Not built | Email digest only |
| SSO / SAML | Not built | Enterprise Phase 3 |
| White-label | Not built | Phase 4 |

---

## Framework Configuration

The MVP uses UK as the first framework configuration. Adding a new jurisdiction = adding a library file + updating `lib/coverage.ts`. No core engine changes required.

| Jurisdiction | Library File | Requirements | Status |
|-------------|-------------|-------------|--------|
| UK | `lib/uk-regulatory-library.ts` | 19 | Live |
| US | `lib/regulatory-library.ts` | 32 | Live |
| EU | `lib/eu-regulatory-library.ts` | 34 | Live |

---

## Technical Constraints

- Document text truncated to 12,000 characters before Claude call (handles most compliance policy documents)
- System prompt memoised per `jurisdiction:framework` key
- Single firm per user account (1:1 with auth.users)
- Row-Level Security enforced at database level for all tables
- No cross-user data access possible by architecture

---

## First Framework Config: UK

Entry point: `getScopedRequirements('UK', framework?)` in `lib/coverage.ts`

UK frameworks available:
- `'FCA_RULES'` — FCA Handbook core rules
- `'UK_AML'` — UK Anti-Money Laundering
- `'UK_GDPR'` — UK GDPR
- `'SMCR'` — Senior Managers & Certification Regime
- `'FCA_OP_RES'` — FCA Operational Resilience
- `undefined` — all UK requirements (whole jurisdiction)
