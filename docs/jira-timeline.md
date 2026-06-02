# RegisAI — Git History / Jira Timeline Reference

Chronological development history formatted for Jira epic/sprint planning.

---

## 2026-05-06 — Project Bootstrap

| Commit | Type | Description |
|--------|------|-------------|
| `6919cba` | init | Initial commit |
| `fc57703` | docs | Add README.md explaining project features and setup |

---

## 2026-05-07

| Commit | Type | Description |
|--------|------|-------------|
| `8086a96` | docs | Overhaul README with full project documentation |

---

## 2026-05-09

| Commit | Type | Description |
|--------|------|-------------|
| `4163bb0` | perf | Add prompt caching, singleton client, and parallel DB fetches |
| `f13ea91` | feat | Add finding status tracking with open/in-progress/resolved toggle |
| `8200c4b` | fix | Resolve TypeScript error in findings status route |

---

## 2026-05-10

| Commit | Type | Description |
|--------|------|-------------|
| `da76ed9` | feat | Add Regis glyph logo to nav and login page |
| `b7e92a2` | design | Replace text-based R with path-based glyph for cross-browser rendering |
| `9e71014` | fix | Await dynamic route params for Next.js 15 compatibility |

---

## 2026-05-11 — Phase 2 + Logo Stabilisation

| Commit | Type | Description |
|--------|------|-------------|
| `c17a7ff` | design | Replace SVG logo with official Regis glyph PNG |
| `af018ab` | design | Swap to horizontal wordmark PNG, remove SVG logo |
| `4ceca2e` | design | Use transparent Bodoni Moda SVG wordmark as logo |
| `69181ee` | design | Use browser-rendered transparent Regis SVG wordmark |
| `6bba9ff` | feat | Replace text logo with branded RegisLogo component |
| `3b2aa9b` | feat | Use logo.svg for branding in nav and login page |
| `0e1447d` | fix | Allow SVG files in Next.js Image optimizer |
| `c36c9e2` | fix | Enable RLS on regulatory_updates; add authenticated read policy |
| `fdc4aba` | chore | Add .vercel to gitignore; update local permissions |
| `488cc74` | fix | Await params Promise for Next.js 15+ compatibility in audit page |
| `773c5ea` | fix | Use plain img tag for SVG logo to bypass CSP sandbox |
| `8718df4` | fix | Replace broken SVG logo with pure-CSS RegisLogo component |
| `50fa66b` | feat | Add regulatory monitoring feed with FINRA + SEC RSS |
| `7a22663` | docs | Update README — mark Phase 2 features complete, add routes/files |
| `ab81f92` | fix | Resolve monitoring feed refresh — auth client, Atom parsing, error feedback |
| `2df685d` | fix | Replace blocked RSS feeds with Federal Register JSON API |
| `465c40c` | fix | Use base supabase-js client for service role to bypass RLS |

---

## 2026-05-23 — Phase 2 Complete

| Commit | Type | Description |
|--------|------|-------------|
| `c6607a0` | feat | Implement PDF print stylesheet and weekly regulatory updates email digest (Phase 2 complete) |

---

## 2026-05-27 — Multi-Jurisdiction (EU/UK) Feature

| Commit | Type | Description |
|--------|------|-------------|
| `0d38fc2` | fix | Use cookie-based SSR client in API routes so auth works |
| `4ecff02` | feat | Add Jurisdiction type and EU/UK regulatory frameworks to types |
| `118722e` | feat | Make runGapAnalysis jurisdiction-aware (EU/UK/US) |
| `f8401b8` | feat | Add jurisdiction selector (US/EU/UK) to new audit page |
| `4b7888f` | docs | Update CLAUDE.md and README for Phase 7 EU/UK multi-jurisdiction architecture |
| `4799192` | feat | EU/UK regulatory libraries, DB migration, API + dashboard + report wiring |

---

## 2026-05-28 — EU/UK Feed Fixes

| Commit | Type | Description |
|--------|------|-------------|
| `0feaa56` | feat | Extend regulatory monitoring to EU and UK jurisdictions |
| `103fbec` | fix | Add User-Agent/Accept headers to EU/UK RSS fetches; fix README archive gaps |
| `f75efdc` | docs | Commit all four plan archives; rename plan 01 to correct sequence |
| `0d3e45f` | fix | Safe date parsing for RSS feeds; add XML/bot-challenge detection |
| `2b8c1aa` | fix | Correct EU and UK regulatory feed URLs |

---

## 2026-05-29 — Landing Page + Legal Pages + Design Partner Flow

| Commit | Type | Description |
|--------|------|-------------|
| `3e5d09f` | fix | Raise feed limit 100→500 so EU/UK items are not cut off |
| `69dabe2` | feat | Add design partner onboarding flow |
| `a3a4f58` | feat | Add premium B2B landing page for design partner outreach |
| `f5eb882` | feat | Add Privacy Policy, Terms of Service, and Security pages |
| `5ed355f` | fix | Prevent mobile redirect-to-login from stale session or network failures |

---

## 2026-05-30 — Accessibility Audit + Geo Pricing

| Commit | Type | Description |
|--------|------|-------------|
| `3f274d7` | fix | Landing page a11y, anti-patterns, and responsive audit fixes |
| `a45547d` | feat | Default pricing currency from visitor location (geo-based) |

---

## 2026-05-31

| Commit | Type | Description |
|--------|------|-------------|
| `fde43b1` | feat | Clickable home logo + About page |

---

## 2026-06-01 — Policy Drafting Feature + Lint

| Commit | Type | Description |
|--------|------|-------------|
| `9009c1e` | chore | Fix lint under Next 16 and clear pre-existing lint debt |
| `2e32287` | feat | AI policy update drafting per finding |
| `4b1bc09` | content | Feature policy drafting across marketing and legal pages |
| `e28ee5f` | perf | Lazy loading and copy polish for landing page |

---

## 2026-06-02 — Documentation Update

| Commit | Type | Description |
|--------|------|-------------|
| `a257ab0` | docs | Update README to reflect current project state |
| `312416a` | docs | Update PRODUCT.md to reflect current product state |

---

## Phase Summary

| Phase | Date Range | Key Deliverables |
|-------|-----------|-----------------|
| Phase 1 | May 6–9 | Core audit flow (upload → analyse → report), finding status tracking |
| Phase 2 | May 10–23 | Logo, monitoring feed (US), PDF print stylesheet, email digest |
| Phase 3 | May 27–28 | EU/UK jurisdictions, multi-jurisdiction DB migration, regulatory libraries |
| Phase 4 | May 29–Jun 1 | Landing page, legal pages, design partner flow, geo pricing, policy drafting |
| Docs | Jun 2 | README + PRODUCT.md comprehensive update |
