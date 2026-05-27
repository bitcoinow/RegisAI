# Plan 01 — EU & UK Regulatory Expansion

**Goal:** Extend RegisAI to support EU and UK jurisdictions alongside the existing US framework. A jurisdiction selector (tab UI) on the new audit page lets a firm pick their regulatory environment before uploading. The same upload → Claude gap analysis → report pipeline runs unchanged — only the regulatory library fed into the prompt changes.

---

## Phase 0: Documentation Discovery (complete)

**Sources read:**
- `lib/regulatory-library.ts` — 32 US requirements, typed `RegulatoryRequirement[]`, frameworks: `FINRA | SEC | AML | RegBI | BCP`
- `lib/claude.ts` — `buildSystemPrompt()` is memoised (`_systemPrompt` cache), embeds the full library. `runGapAnalysis(text, firmName?)` is the only public export. No jurisdiction awareness today.
- `types/index.ts` — `RegulatoryFramework` is a union type. `Audit` has no `jurisdiction` field. `AuditResult` has no jurisdiction field.
- `app/api/analyse/route.ts` — Accepts `{ document_id }`. Calls `runGapAnalysis()`. Inserts into `audits` table. No jurisdiction column today.
- `components/audit/upload-form.tsx` — Stateless two-step form. Posts to `/api/documents` then `/api/analyse`. No props for jurisdiction.
- `supabase/migrations/20260504000000_initial.sql` — `audits` table has no `jurisdiction` column.

**Allowed APIs confirmed:**
- `lib/claude.ts` exports only `runGapAnalysis(documentText, firmName?)` — needs signature extension
- `buildSystemPrompt()` is a private cached function — cache must be invalidated or made jurisdiction-aware
- `REGULATORY_LIBRARY` is a plain typed array — same pattern works for EU/UK libraries

**Anti-patterns to avoid:**
- Do NOT call the Anthropic SDK directly in API routes — all Claude calls stay in `lib/claude.ts`
- Do NOT prefix server env vars with `NEXT_PUBLIC_`
- Do NOT invalidate `_systemPrompt` cache naively — three separate cached prompts needed (one per jurisdiction)
- Do NOT use `any` — strict TypeScript throughout

---

## Phase 1: Types and Regulatory Libraries

**What to build:**
1. Extend `types/index.ts` — add `Jurisdiction` union type, extend `RegulatoryFramework`, add `jurisdiction` field to `Audit`
2. Create `lib/eu-regulatory-library.ts` — ~23 EU requirements
3. Create `lib/uk-regulatory-library.ts` — ~19 UK requirements

### 1a. Type changes — `types/index.ts`

Add after existing types:

```ts
// New
export type Jurisdiction = 'US' | 'EU' | 'UK'

// Extended (replace existing RegulatoryFramework)
export type RegulatoryFramework =
  // US
  | 'FINRA' | 'SEC' | 'AML' | 'RegBI' | 'BCP'
  // EU
  | 'MiFID II' | 'GDPR' | 'AMLD' | 'DORA' | 'SFDR' | 'MAR'
  // UK
  | 'SM&CR' | 'FCA Conduct' | 'FCA Systems' | 'UK AML' | 'UK GDPR' | 'FCA OpRes'
```

Add `jurisdiction: Jurisdiction` field to the `Audit` interface (default `'US'` for backward compat).

### 1b. EU Regulatory Library — `lib/eu-regulatory-library.ts`

~23 requirements across 6 frameworks. Key requirements:

| ID | Rule | Framework | Requirement | Risk |
|---|---|---|---|---|
| REQ-EU-001 | MiFID II Art 16 | MiFID II | Organisational Requirements | High |
| REQ-EU-002 | MiFID II Art 25 | MiFID II | Suitability & Appropriateness | High |
| REQ-EU-003 | MiFID II Art 27 | MiFID II | Best Execution | High |
| REQ-EU-004 | MiFID II Art 23 | MiFID II | Conflicts of Interest | High |
| REQ-EU-005 | MiFID II Art 24 | MiFID II | Client Communication & Disclosure | Medium |
| REQ-EU-006 | MiFID II Art 68 | MiFID II | Product Governance (POG) | High |
| REQ-EU-007 | GDPR Art 5 | GDPR | Lawfulness of Processing | High |
| REQ-EU-008 | GDPR Art 24 | GDPR | Controller Accountability | High |
| REQ-EU-009 | GDPR Art 32 | GDPR | Security of Processing | High |
| REQ-EU-010 | GDPR Art 33/34 | GDPR | Breach Notification | High |
| REQ-EU-011 | GDPR Art 37 | GDPR | DPO Designation | Medium |
| REQ-EU-012 | AMLD6 Art 8 | AMLD | AML Programme & Internal Controls | High |
| REQ-EU-013 | AMLD6 Art 13 | AMLD | Customer Due Diligence | High |
| REQ-EU-014 | AMLD6 Art 18 | AMLD | Enhanced Due Diligence (PEPs/HRI) | High |
| REQ-EU-015 | AMLD6 Art 30 | AMLD | Beneficial Ownership Register | High |
| REQ-EU-016 | AMLD6 Art 33 | AMLD | Suspicious Transaction Reporting | High |
| REQ-EU-017 | DORA Art 5 | DORA | ICT Risk Management Framework | High |
| REQ-EU-018 | DORA Art 17 | DORA | ICT-Related Incident Reporting | High |
| REQ-EU-019 | DORA Art 26 | DORA | Digital Operational Resilience Testing | Medium |
| REQ-EU-020 | SFDR Art 3 | SFDR | Sustainability Risk Policies | Medium |
| REQ-EU-021 | SFDR Art 4 | SFDR | Principal Adverse Impact Disclosure | Medium |
| REQ-EU-022 | MAR Art 16 | MAR | Market Abuse Prevention | High |
| REQ-EU-023 | MAR Art 17 | MAR | Disclosure of Inside Information | High |

Export: `EU_REGULATORY_LIBRARY: RegulatoryRequirement[]`
Also export `getEURequirementsByFramework()` (same pattern as US library).

### 1c. UK Regulatory Library — `lib/uk-regulatory-library.ts`

~19 requirements across 6 FCA/UK frameworks:

| ID | Rule | Framework | Requirement | Risk |
|---|---|---|---|---|
| REQ-UK-001 | SYSC 2.1 | SM&CR | Senior Management Arrangements | High |
| REQ-UK-002 | SM&CR FSMA s64A | SM&CR | Senior Manager Responsibilities Map | High |
| REQ-UK-003 | SM&CR FSMA s63F | SM&CR | Certification Regime | Medium |
| REQ-UK-004 | FCA PRIN 2A | FCA Conduct | Consumer Duty — Four Outcomes | High |
| REQ-UK-005 | COBS 2.1.1R | FCA Conduct | Client's Best Interests Rule | High |
| REQ-UK-006 | COBS 9A.2 | FCA Conduct | Suitability Assessment | High |
| REQ-UK-007 | COBS 14.3 | FCA Conduct | Product Information to Clients | Medium |
| REQ-UK-008 | SYSC 6.1 | FCA Systems | Compliance Function | High |
| REQ-UK-009 | SYSC 7.1 | FCA Systems | Risk Assessment & Control | High |
| REQ-UK-010 | SYSC 10.1 | FCA Systems | Conflicts of Interest Policy | High |
| REQ-UK-011 | MLR 2017 Reg 18 | UK AML | AML Policies, Controls & Procedures | High |
| REQ-UK-012 | MLR 2017 Reg 28 | UK AML | Customer Due Diligence | High |
| REQ-UK-013 | MLR 2017 Reg 35 | UK AML | Enhanced Due Diligence (PEPs) | High |
| REQ-UK-014 | MLR 2017 Reg 24 | UK AML | Staff AML Training | Medium |
| REQ-UK-015 | UK GDPR Art 5 | UK GDPR | Data Processing Principles | High |
| REQ-UK-016 | UK GDPR Art 32 | UK GDPR | Security of Processing | High |
| REQ-UK-017 | DPA 2018 s137 | UK GDPR | ICO Registration & DPO | Medium |
| REQ-UK-018 | FCA PS21/3 | FCA OpRes | Important Business Services Mapping | High |
| REQ-UK-019 | FCA PS21/3 | FCA OpRes | Impact Tolerances & Testing | Medium |

Export: `UK_REGULATORY_LIBRARY: RegulatoryRequirement[]`

**Verification:** TypeScript compile with `npm run type-check` — no errors.

---

## Phase 2: Claude Integration — Jurisdiction-Aware Prompts

**File:** `lib/claude.ts`

**What to change:**

1. Replace the single `_systemPrompt` cache with a `Map<Jurisdiction, string>`:
   ```ts
   const _systemPrompts = new Map<Jurisdiction, string>()
   ```

2. Update `buildSystemPrompt(jurisdiction: Jurisdiction)` to pick the right library:
   ```ts
   // US → REGULATORY_LIBRARY (existing)
   // EU → EU_REGULATORY_LIBRARY
   // UK → UK_REGULATORY_LIBRARY
   ```
   Also update the analyst persona text to match jurisdiction:
   - US: "FINRA, SEC, AML/BSA, Regulation Best Interest"
   - EU: "MiFID II, GDPR, AMLD6, DORA, SFDR, MAR"
   - UK: "FCA Rules (SYSC, COBS, SM&CR), UK AML (MLR 2017), UK GDPR, FCA Consumer Duty"

3. Update `runGapAnalysis(documentText, firmName?, jurisdiction?)`:
   - New signature: `runGapAnalysis(documentText: string, firmName?: string, jurisdiction: Jurisdiction = 'US'): Promise<AuditResult>`
   - Pass jurisdiction to `buildSystemPrompt(jurisdiction)`

**No other changes to the API surface.** The function still returns `AuditResult` — same JSON shape.

**Verification:** `npm run type-check` passes. Manual test: call `runGapAnalysis('...', undefined, 'EU')` in a dev curl and confirm EU rule citations appear in the output.

---

## Phase 3: Database Migration

**New file:** `supabase/migrations/20260527000000_audits_add_jurisdiction.sql`

```sql
ALTER TABLE audits
  ADD COLUMN IF NOT EXISTS jurisdiction text NOT NULL DEFAULT 'US';
```

Apply via Supabase MCP (`apply_migration`) or Supabase dashboard SQL editor.

**Verification:** `SELECT jurisdiction FROM audits LIMIT 5;` — returns 'US' for all existing rows.

---

## Phase 4: API Route — Accept Jurisdiction

**File:** `app/api/analyse/route.ts`

**Changes:**
1. Parse `jurisdiction` from request body (optional, default `'US'`):
   ```ts
   const body = await req.json() as { document_id?: unknown; jurisdiction?: unknown }
   const jurisdiction: Jurisdiction = 
     ['US', 'EU', 'UK'].includes(body.jurisdiction as string)
       ? (body.jurisdiction as Jurisdiction)
       : 'US'
   ```

2. Pass jurisdiction to `runGapAnalysis()`:
   ```ts
   auditResult = await runGapAnalysis(document.extracted_text, firmName, jurisdiction)
   ```

3. Store jurisdiction in the audit insert:
   ```ts
   .insert({ ..., jurisdiction })
   ```

**Verification:** `curl -X POST /api/analyse -d '{"document_id":"...", "jurisdiction":"EU"}'` — audit record in Supabase has `jurisdiction = 'EU'`.

---

## Phase 5: UI — Jurisdiction Selector

### 5a. New audit page — `app/(app)/audit/new/page.tsx`

Add a three-tab jurisdiction selector above the upload form:

```
[ United States ]  [ European Union ]  [ United Kingdom ]
```

- Active tab styled with `bg-green text-white`, inactive with `border border-rule bg-bg-2`
- Show the count of requirements under each tab label:
  - US: "32 requirements · FINRA, SEC, AML/BSA, Reg BI"
  - EU: "23 requirements · MiFID II, GDPR, AMLD6, DORA, SFDR"
  - UK: "19 requirements · FCA Rules, UK AML, UK GDPR, SM&CR"
- Jurisdiction state (`useState<Jurisdiction>('US')`) lives here and is passed to `<UploadForm>`

### 5b. Upload form component — `components/audit/upload-form.tsx`

**Props change:** Add `jurisdiction: Jurisdiction` prop.

**Behaviour change:**
- Pass `jurisdiction` in the `/api/analyse` JSON body
- Update the stage label from `'Analysing against 32 regulatory requirements…'` to dynamic:
  ```ts
  const requirementCount = { US: 32, EU: 23, UK: 19 }
  `Analysing against ${requirementCount[jurisdiction]} regulatory requirements…`
  ```

**Verification:** Select "European Union", upload a PDF, confirm the loading label says "23 requirements" and the resulting audit report shows EU rule citations (e.g., "MiFID II Art 25").

---

## Phase 6: Dashboard + Audit Report — Jurisdiction Badge

### 6a. Dashboard — `app/(app)/dashboard/page.tsx`

Fetch `jurisdiction` from the `audits` select query. Add a small jurisdiction badge to each audit card row:

```
[ EU ] Clearview Capital — 14 gaps   High: 8  Med: 4  Low: 2
```

Badge styles (DM Mono, uppercase, 4px radius, border):
- US: `border-ink-3 text-ink-3`
- EU: `border-blue text-blue` (reuse existing `--blue`)
- UK: `border-gold text-gold` (reuse existing `--gold`)

### 6b. Audit report — `components/audit/audit-report.tsx`

Add jurisdiction badge in the report header, next to the firm name:

```
Clearview Capital Management  [EU]
MiFID II · GDPR · AMLD6 · DORA · SFDR
```

Show the frameworks in the sub-header line based on jurisdiction:
- US: "FINRA · SEC · AML/BSA · Reg BI · BCP"
- EU: "MiFID II · GDPR · AMLD6 · DORA · SFDR · MAR"
- UK: "FCA Rules · UK AML · UK GDPR · SM&CR · FCA OpRes"

**Verification:** Open an EU audit → header shows `[EU]` badge and EU framework list.

---

## Phase 7: Documentation Updates

### 7a. `CLAUDE.md`

Update the **AI Integration** section:
- Note that `buildSystemPrompt(jurisdiction)` now accepts a `Jurisdiction` param
- Note the three library files: `regulatory-library.ts` (US), `eu-regulatory-library.ts`, `uk-regulatory-library.ts`
- Note the `jurisdiction` column on `audits`

### 7b. `README.md`

- Update the "What It Does" section to mention EU and UK
- Update the Regulatory Library section with EU and UK tables
- Update Phase 3 checklist to include "EU & UK regulatory libraries"
- Update the database schema doc with the `jurisdiction` column

---

## Final Phase: Verification Checklist

- [ ] `npm run type-check` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] `npm run build` — clean build
- [ ] US flow unchanged: upload a PDF, select "United States", get a US audit with FINRA/SEC citations
- [ ] EU flow: select "European Union", upload a PDF, get audit with MiFID II/GDPR citations
- [ ] UK flow: select "United Kingdom", upload a PDF, get audit with FCA/MLR citations
- [ ] Dashboard shows correct jurisdiction badge on each card
- [ ] Existing US audits still load correctly (backward compat — `jurisdiction` defaults to `'US'`)
- [ ] Commit and push to main

---

## File Change Summary

| File | Change |
|---|---|
| `types/index.ts` | Add `Jurisdiction`, extend `RegulatoryFramework`, add `jurisdiction` to `Audit` |
| `lib/eu-regulatory-library.ts` | **New** — 23 EU requirements |
| `lib/uk-regulatory-library.ts` | **New** — 19 UK requirements |
| `lib/claude.ts` | Jurisdiction-aware prompt builder and `runGapAnalysis` signature |
| `supabase/migrations/20260527000000_audits_add_jurisdiction.sql` | **New** — adds `jurisdiction` column |
| `app/api/analyse/route.ts` | Accept and store `jurisdiction` |
| `app/(app)/audit/new/page.tsx` | Three-tab jurisdiction selector |
| `components/audit/upload-form.tsx` | Accept `jurisdiction` prop, pass to API |
| `app/(app)/dashboard/page.tsx` | Fetch and display jurisdiction badge |
| `components/audit/audit-report.tsx` | Show jurisdiction badge + framework list |
| `CLAUDE.md` | Update architecture notes |
| `README.md` | Update regulatory library docs |

**Total: 10 modified files, 2 new library files, 1 new migration.**
