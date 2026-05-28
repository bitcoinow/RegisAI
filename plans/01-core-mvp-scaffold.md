# Plan 01 — Core MVP & Compliance Analysis Engine

**Goal:** Establish the foundational RegisAI architecture, database schema, PDF text-extraction pipeline, and the Claude-powered gap analysis engine using a 32-requirement US regulatory library.

---

## Phase 0: Architecture & Research

### Core Objectives
1. Build an AI-native compliance platform using **Next.js 14 (App Router)** and **TypeScript**.
2. Design a Postgres schema in **Supabase** with Row-Level Security (RLS) to ensure rigorous data isolation.
3. Centralize the **Claude API** (`claude-sonnet-4-20250514`) integration inside a single wrapper file (`lib/claude.ts`) and embed the regulatory requirements library.
4. Establish a server-side PDF parsing routine using `pdf-parse` that extracts manual content cleanly.
5. Create a tailored, editorial-style user interface resembling a professional Big 4 compliance audit report (Serif headings, DM Mono metadata badges, and warm paper backgrounds).

---

## Phase 1: Database Schema & Authentication

### 1a. Database Setup (`supabase/migrations/20260504000000_initial.sql`)
The schema focuses on user isolation, document tracking, and audit indexing.

```sql
-- Profile extension
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  firm_name text,
  firm_type text,           -- 'RIA' | 'Fintech' | 'Insurance' | 'Bank'
  aum_range text,
  regulator text,           -- 'FINRA' | 'SEC' | 'State' | 'Multiple'
  plan text DEFAULT 'design_partner',
  created_at timestamptz DEFAULT now()
);

-- PDF Uploads
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text,
  extracted_text text,
  page_count int,
  status text DEFAULT 'uploaded',  -- 'uploaded' | 'analysing' | 'complete' | 'error'
  created_at timestamptz DEFAULT now()
);

-- Gap Audits
CREATE TABLE audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  firm_name text,
  exec_summary text,
  total_gaps int,
  high_risk int,
  medium_risk int,
  low_risk int,
  strengths jsonb,
  priority_actions jsonb,
  raw_result jsonb,
  created_at timestamptz DEFAULT now()
);
```

### 1b. Row-Level Security (RLS)
Enable RLS on all tables to prevent cross-tenant reading/writing. 
* All queries must filter by `auth.uid() = user_id`.
* Create a database trigger on `auth.users` to automatically upsert a matching `profiles` record on new user signups.

### 1c. Authentication
* Integrate Supabase cookie-based authentication (`@supabase/ssr`).
* Restrict authentication to **Magic Link OTP** (email only).
* Wire up `middleware.ts` to refresh the session on every request and protect routes under `(app)/` like `/dashboard` and `/audit`.

---

## Phase 2: Core PDF & Analysis Engines

### 2a. Server-Side PDF Parsing (`lib/pdf.ts`)
* Use `pdf-parse` on the server to extract raw text content.
* Avoid exposing PDF libraries to the client-side bundle.
* Enforce document size and page limits (e.g., maximum 50 pages or 12,000 characters truncated for MVP prompt feasibility).

### 2b. US Regulatory Library (`lib/regulatory-library.ts`)
Define 32 requirements typed as `RegulatoryRequirement[]`, spanning five frameworks:
* **FINRA:** Focuses on supervision (Rule 3110, 3120) and standard of conduct (2010).
* **SEC:** Focuses on books/records (17a-3/4), privacy (Reg S-P), and compliance reviews (206(4)-7).
* **AML/BSA:** Customer Identification Program (CIP), CTR/SAR, and OFAC.
* **Reg BI:** Fiduciary standards, Conflicts of Interest, and Form CRS.
* **BCP:** Disaster recovery and annual operational testing rules.

### 2c. Claude Analysis Wrapper (`lib/claude.ts`)
* Initialize the `@anthropic-ai/sdk` client.
* Construct the `buildSystemPrompt()` function to embed the full 32-requirement regulatory library.
* Implement system prompt caching: store the generated string in `_systemPrompt` to avoid re-generating the string on concurrent or sub-sequent analyses.
* Implement `runGapAnalysis(documentText, firmName?)`:
  * Formulate the user prompt containing the compliance manual text.
  * Explicitly request a strict JSON output matching the `AuditResult` structure:
    ```ts
    interface AuditResult {
      execSummary: string;
      gaps: {
        reqId: string;
        rule: string;
        requirement: string;
        policySays: string;
        gap: string;
        risk: 'High' | 'Medium' | 'Low';
        recommendation: string;
      }[];
      strengths: string[];
      priorityActions: string[];
    }
    ```

---

## Phase 3: API Pipeline Wiring

### 3a. Upload Route (`POST /api/documents`)
* Handle multipart upload of compliance PDFs.
* Extract PDF text using the parser, save the text in `documents.extracted_text`, and return the `document_id`.

### 3b. Analysis Route (`POST /api/analyse`)
* Fetch the `extracted_text` from the database.
* Invoke `runGapAnalysis()`.
* Parse the resulting JSON and commit records to the `audits` table.
* Return `audit_id` to trigger client-side redirect.

---

## Phase 4: UI Design & Presentation

### 4a. Design Tokens (`app/globals.css`)
Implement a premium, editorial design system:
* **Colors:** Warm page background (`#f5f0e8`), deep forest green (`#1a3a2a`), dark ink text (`#1a1714`), and risk levels (High: Red `#8b2020`, Medium: Amber `#8b5a10`, Low: Blue `#1a3060`).
* **Typography:** Elegant headings (Playfair Display), reading-optimized body (Inter), and mono citations (DM Mono).
* **Details:** Strict 4px border-radius, clean dividers (`#ccc4b8`), no heavy drop shadows.

### 4b. Dashboard (`app/(app)/dashboard/page.tsx`)
* List user's historical audits with dates, company names, and high/med/low gap counters.
* Maintain a clean table layout.

### 4c. Upload Form (`components/audit/upload-form.tsx`)
* Build a stateless two-step upload wizard.
* Display custom loading milestones ("Extracting text...", "Analysing against 32 regulatory requirements...").

### 4d. Audit Report Screen (`app/(app)/audit/[id]/page.tsx`)
* Render the full audit report.
* Utilize `<AuditReport>` to list strengths, action priorities, and expandable finding cards.

### 4e. Static Demo Route (`app/demo/clearview/page.tsx`)
* Provide a public, no-auth demo path populated with static seeded audit data (`lib/demo-data.ts`) to immediately showcase capabilities to prospective partners.

---

## Phase 5: Verification Checklist
* [x] Supabase migration applies without errors.
* [x] PDF text extraction handles various text encodings.
* [x] Claude parses structured JSON reliably.
* [x] RLS policies prevent users from viewing other audits.
