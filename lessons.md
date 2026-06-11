# Lessons Log

## 2026-05-04 — Initial scaffold

- What worked: Setting up the full directory structure upfront from CLAUDE.md before writing any logic makes subsequent sessions faster.
- What didn't: N/A — first session.
- What to do differently next time: Run `npm install` and `tsc --noEmit` after scaffold to catch any missing package type issues before moving to UI work.

## 2026-05-27–29 — Multi-jurisdiction expansion

- Memoising `buildSystemPrompt()` per `jurisdiction:framework` key is critical — rebuild on every request at 19–34 requirements is expensive. Use a `Map<string, string>` keyed on `${jurisdiction}:${framework ?? 'ALL'}`.
- Claude responses sometimes include markdown code fences (` ```json `) even when instructed not to. Strip fences before `JSON.parse()` as a defensive step — a single regex handles it.
- RSS parsing across ESMA, EBA, FCA, PRA varies in XML structure. A zero-dependency regex parser is safer and more portable than adding `xml2js`; graceful `[]` fallback when feeds are blocked prevents cascading failures.

## 2026-06-03 — Framework scoping and re-scan

- `computeDelta()` must match findings by `req_id`, not position — findings lists reorder between scans and array-index matching produces wrong classifications.
- The posture score formula (High=3, Med=2, Low=1, max = total_reqs × 3) needs to be locked in `lib/coverage.ts` as the single source of truth. Having the formula in two places (API + UI) caused a scoring discrepancy.
- SVG files imported as `<img src>` fail in certain browser/CSP contexts. Use the pure-CSS `RegisLogo` component from `components/ui/logo.tsx` instead — never reference SVG as an image source.

## 2026-06-03 — Human review workflow

- `risk_accepted` is a terminal status distinct from `resolved` — it documents that the gap was reviewed and the risk consciously accepted, not closed. This distinction matters for auditors. Keep it as a separate status value, not a flag.
- Always record `reviewed_by` + `reviewed_at` on any status change away from `open`, even `in_progress`. An incomplete audit trail is worse than no trail — reviewers change and attribution is lost.

## 2026-06-09 — Jurisdiction access control

- An `is_dev` boolean on `profiles` is the simplest access control gate that doesn't require a full RBAC system. For a two-tier distinction (dev team vs. regular users), it avoids premature complexity.
- Enforce access at three layers: UI (disable tabs), form prop (`isDevUser`), and server API (HTTP 403). Client-only enforcement is insufficient — the API must also reject non-UK requests from non-dev users.
- Thin RSC wrappers are the right pattern for pages that need server-side data (like `is_dev`) before rendering a client component. Refactoring a 266-line page component into a 15-line RSC + separate client component is a net win.

## 2026-06-10 — Email delivery debugging

- Supabase → Resend SMTP rejections (error 550) are silent from the user's perspective — signup appears to succeed but no confirmation email arrives. Always check Supabase auth logs and Resend send logs together to diagnose delivery failures.
- The root cause of email delivery failure is almost always domain verification, not code. If the sender domain (`regisai.dev`) is not verified in Resend, all sends will be rejected. DNS records (TXT + MX) must be added to the domain registrar before emails will deliver.
- Disabling email confirmation in Supabase is a valid staging workaround but should never be left enabled in production — it removes the email ownership verification step entirely.
