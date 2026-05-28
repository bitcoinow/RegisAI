# Plan 04 — EU & UK Regulatory Monitoring Expansion

**Goal:** Extend the regulatory monitoring feed to cover EU and UK sources alongside the existing US (FINRA / SEC via Federal Register). The monitoring page gains a three-tab jurisdiction selector (US / EU / UK) so firms can filter updates relevant to their jurisdiction. The existing fetch → parse → upsert pipeline runs unchanged — only the data sources and a new `jurisdiction` column change.

---

## Phase 0: Documentation Discovery (complete)

**Sources read:**
- `lib/monitoring.ts` — `fetchAndParseFeeds(): Promise<ParsedUpdate[]>` is the only export. Hits Federal Register JSON API, no XML parsing. Returns `ParsedUpdate[]` with no `jurisdiction` field. Two helper functions: `scoreRelevance(text)` and `extractAffectedRules(text)`.
- `app/api/monitoring/refresh/route.ts` — Calls `fetchAndParseFeeds()`, upserts directly to `regulatory_updates` on conflict `url`. 34 lines, no jurisdiction awareness.
- `app/api/monitoring/feed/route.ts` — SELECTs 100 rows, returns typed `FeedResponse`. No jurisdiction filtering.
- `app/(app)/monitoring/page.tsx` — `'use client'`. Calls both API routes. Filters by `regulator` (FINRA vs SEC). Three stat boxes: Total, FINRA, SEC.
- `supabase/migrations/20260504000000_initial.sql` — `regulatory_updates` table: id, regulator, title, summary, url, published_at, relevance_score, affected_rules, raw_content, created_at. No `jurisdiction` column.
- Jurisdiction tab pattern: `components/audit/new-audit-form.tsx` — copy this for the monitoring page tabs.

**Feed sources confirmed:**
- EU: ESMA (`https://www.esma.europa.eu/press-news/esma-news/rss.xml`) — Atom/RSS, public, no auth
- EU: EBA (`https://www.eba.europa.eu/rss/news`) — RSS, public, no auth
- UK: FCA (`https://www.fca.org.uk/news/rss.xml`) — RSS, public, no auth
- UK: PRA / Bank of England (`https://www.bankofengland.co.uk/rss/pressreleases`) — RSS, public, no auth

**Risk:** EU/UK feeds may block server-side fetches (same issue that hit SEC/FINRA RSS in an earlier phase). **Mitigation:** wrap each feed fetch in try/catch, return `[]` on any failure — same pattern as existing Federal Register fetch. The monitoring page stays functional with partial data.

**Anti-patterns to avoid:**
- Do NOT add new npm dependencies for XML parsing — write a zero-dep regex parser inline (same approach used previously for RSS)
- Do NOT call Supabase in `lib/monitoring.ts` — only parse; all DB writes stay in the API route
- Do NOT prefix server env vars with `NEXT_PUBLIC_`
- Do NOT break existing US flow — `fetchAndParseFeeds()` must still return US items with `jurisdiction: 'US'`

---

## Phase 1: Database Migration

**New file:** `supabase/migrations/20260528000000_regulatory_updates_add_jurisdiction.sql`

```sql
ALTER TABLE regulatory_updates
  ADD COLUMN IF NOT EXISTS jurisdiction text NOT NULL DEFAULT 'US';
```

Apply via Supabase MCP (`apply_migration`) targeting project `yitvcsabxrwqjhbdqrzw`.

**Verification:** `SELECT jurisdiction FROM regulatory_updates LIMIT 5;` — returns `'US'` for all existing rows.

---

## Phase 2: `lib/monitoring.ts` — Add EU & UK Feed Parsing

**What to change in `lib/monitoring.ts`:**

### 2a. Add `jurisdiction` to `ParsedUpdate`

```ts
export interface ParsedUpdate {
  regulator: string
  jurisdiction: 'US' | 'EU' | 'UK'    // ← new
  title: string
  summary: string
  url: string
  published_at: string | null
  relevance_score: number
  affected_rules: string[]
  raw_content: string
}
```

### 2b. Add EU & UK RULE_KEYWORDS (append after existing US array)

EU keywords to add:
```ts
{ pattern: /MiFID\s+II?/i, rule: 'MiFID II' },
{ pattern: /GDPR|General\s+Data\s+Protection/i, rule: 'GDPR' },
{ pattern: /AMLD[4-6]?|anti.money\s+laundering\s+directive/i, rule: 'AMLD' },
{ pattern: /DORA|Digital\s+Operational\s+Resilience/i, rule: 'DORA' },
{ pattern: /SFDR|Sustainable\s+Finance\s+Disclosure/i, rule: 'SFDR' },
{ pattern: /MAR|Market\s+Abuse\s+Regulation/i, rule: 'MAR' },
{ pattern: /ESMA/i, rule: 'ESMA' },
{ pattern: /EBA/i, rule: 'EBA' },
```

UK keywords to add:
```ts
{ pattern: /SM&CR|Senior\s+Managers\s+(&|and)\s+Certification/i, rule: 'SM&CR' },
{ pattern: /Consumer\s+Duty|PRIN\s+2A/i, rule: 'FCA Consumer Duty' },
{ pattern: /MLR\s+201[57]|Money\s+Laundering\s+Regulations/i, rule: 'MLR 2017' },
{ pattern: /FCA\s+COBS|Conduct\s+of\s+Business/i, rule: 'FCA COBS' },
{ pattern: /FCA\s+SYSC|Systems\s+and\s+Controls/i, rule: 'FCA SYSC' },
{ pattern: /UK\s+GDPR/i, rule: 'UK GDPR' },
{ pattern: /ICO|Information\s+Commissioner/i, rule: 'ICO' },
{ pattern: /PRA\s+Rulebook|Prudential\s+Regulation/i, rule: 'PRA Rules' },
```

### 2c. Add EU & UK relevance scoring

Extend `HIGH_RELEVANCE` and `MED_RELEVANCE` patterns to include EU/UK terms, or keep a single `scoreRelevance(text)` function that covers all jurisdictions:

```ts
const HIGH_RELEVANCE =
  /supervisory|compliance\s+program|enforcement\s+action|penalty|fine|censure|violation|broker-dealer|investment\s+adviser|registered\s+representative|sanction|supervisory\s+notice|final\s+notice|prohibition\s+order|systemic\s+risk/i
const MED_RELEVANCE =
  /disclosure|registration|reporting|examination|inspection|custod|consultation\s+paper|policy\s+statement|technical\s+standard|regulatory\s+technical/i
```

### 2d. Add a lightweight RSS/Atom parser (no new deps)

```ts
interface RssItem {
  title: string
  link: string
  description: string
  pubDate: string | null
}

function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = []
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>|<entry[^>]*>([\s\S]*?)<\/entry>/gi
  let match: RegExpExecArray | null
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1] ?? match[2] ?? ''
    const get = (tag: string) => {
      const m = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i').exec(block)
      return m?.[1]?.trim() ?? ''
    }
    const link =
      get('link') ||
      (/<link[^>]+href="([^"]+)"/.exec(block)?.[1] ?? '')
    const pubDate =
      get('pubDate') || get('published') || get('updated') || null
    items.push({
      title: get('title'),
      link,
      description: get('description') || get('summary') || get('content'),
      pubDate,
    })
  }
  return items.filter((i) => i.title && i.link)
}
```

### 2e. Add `fetchEUFeeds()` and `fetchUKFeeds()` functions

```ts
const EU_FEEDS = [
  { url: 'https://www.esma.europa.eu/press-news/esma-news/rss.xml', regulator: 'ESMA' },
  { url: 'https://www.eba.europa.eu/rss/news', regulator: 'EBA' },
]

const UK_FEEDS = [
  { url: 'https://www.fca.org.uk/news/rss.xml', regulator: 'FCA' },
  { url: 'https://www.bankofengland.co.uk/rss/pressreleases', regulator: 'PRA' },
]

async function fetchRssFeed(
  feedUrl: string,
  regulator: string,
  jurisdiction: 'EU' | 'UK'
): Promise<ParsedUpdate[]> {
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 0 } })
    if (!res.ok) {
      console.error(`${regulator} feed fetch failed: ${res.status}`)
      return []
    }
    const xml = await res.text()
    const items = parseRssItems(xml)
    return items.map((item) => {
      const text = `${item.title} ${item.description}`
      return {
        regulator,
        jurisdiction,
        title: item.title.slice(0, 500),
        summary: item.description.slice(0, 1000),
        url: item.link,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        relevance_score: scoreRelevance(text),
        affected_rules: extractAffectedRules(text),
        raw_content: item.description.slice(0, 5000),
      }
    })
  } catch (err) {
    console.error(`${regulator} feed error:`, err)
    return []
  }
}
```

### 2f. Update `fetchAndParseFeeds()` to combine all three jurisdictions

```ts
export async function fetchAndParseFeeds(): Promise<ParsedUpdate[]> {
  const [usUpdates, ...euResults, ...ukResults] = await Promise.allSettled([
    fetchUSFeeds(),           // existing Federal Register logic, tagged jurisdiction: 'US'
    ...EU_FEEDS.map(({ url, regulator }) => fetchRssFeed(url, regulator, 'EU')),
    ...UK_FEEDS.map(({ url, regulator }) => fetchRssFeed(url, regulator, 'UK')),
  ])
  // flatten settled results, ignore rejections
  return results.flatMap((r) => r.status === 'fulfilled' ? r.value : [])
}
```

Extract the existing Federal Register logic into `fetchUSFeeds(): Promise<ParsedUpdate[]>` (same code, just adds `jurisdiction: 'US'` to each returned item).

**Verification:** `npm run type-check` — no errors. Spot-check: call `fetchAndParseFeeds()` in a quick test script and confirm items with `jurisdiction: 'EU'` and `jurisdiction: 'UK'` are returned if the feeds are reachable.

---

## Phase 3: API Feed Route — Add `jurisdiction` to Response

**File:** `app/api/monitoring/feed/route.ts`

**Changes:**
1. Add `jurisdiction: string` to the `FeedResponse` update shape
2. Add `jurisdiction` to the Supabase SELECT columns: `'id, regulator, jurisdiction, title, summary, url, published_at, relevance_score, affected_rules, created_at'`

No changes to `app/api/monitoring/refresh/route.ts` — `fetchAndParseFeeds()` now includes `jurisdiction` in every `ParsedUpdate`, and the upsert passes all fields through unchanged.

**Verification:** Call `GET /api/monitoring/feed` after a refresh — each item in `updates[]` has a `jurisdiction` field.

---

## Phase 4: Monitoring Page — Jurisdiction Tabs

**File:** `app/(app)/monitoring/page.tsx`

**Pattern to copy:** `components/audit/new-audit-form.tsx:1-60` — the three-tab selector with `useState<Jurisdiction>`.

**Changes:**

### 4a. Add `jurisdiction` to local `Update` type

```ts
// Update type is derived from FeedResponse — no manual change needed; will pick up
// the new jurisdiction field automatically once the API route is updated
type Update = FeedResponse['updates'][number]
```

### 4b. Add jurisdiction filter state

```ts
type JurisdictionFilter = 'US' | 'EU' | 'UK'
const [jurisdictionFilter, setJurisdictionFilter] = useState<JurisdictionFilter>('US')
```

### 4c. Replace hardcoded `finraCount` / `secCount` stats with jurisdiction-aware counts

```ts
const filtered = updates.filter((u) => u.jurisdiction === jurisdictionFilter)
const jurisCount = {
  US: updates.filter((u) => u.jurisdiction === 'US').length,
  EU: updates.filter((u) => u.jurisdiction === 'EU').length,
  UK: updates.filter((u) => u.jurisdiction === 'UK').length,
}
```

### 4d. Add three-tab selector above the feed

```tsx
{/* ── Jurisdiction Tabs ───────────────────────────────────────────────── */}
<div className="flex border border-rule mb-6">
  {(['US', 'EU', 'UK'] as const).map((j) => (
    <button
      key={j}
      onClick={() => setJurisdictionFilter(j)}
      className={`flex-1 py-2.5 font-mono text-xs tracking-widest uppercase transition-colors
        ${jurisdictionFilter === j
          ? 'bg-green text-white'
          : 'text-ink-3 hover:text-ink hover:bg-bg-2'}`}
    >
      {j === 'US' ? 'United States' : j === 'EU' ? 'European Union' : 'United Kingdom'}
      <span className="ml-2 opacity-70">({jurisCount[j]})</span>
    </button>
  ))}
</div>
```

### 4e. Update stats boxes and feed render to use `filtered`

Replace `updates.length` → `filtered.length` in the stat boxes. Replace `updates.map` → `filtered.map` in the feed list.

Update stats boxes to show regulator breakdown relevant to the selected jurisdiction:
- US: FINRA count + SEC count (same as before)
- EU: ESMA count + EBA count
- UK: FCA count + PRA count

### 4f. Update `RegulatorBadge` to handle EU/UK regulators

```ts
function RegulatorBadge({ regulator }: { regulator: string }) {
  const styles: Record<string, string> = {
    FINRA: 'bg-green text-white',
    SEC:   'text-ink-2 border border-rule bg-bg-2',
    ESMA:  'border text-[var(--blue)] border-[var(--blue)]',
    EBA:   'border text-[var(--blue)] border-[var(--blue)]',
    FCA:   'border text-[var(--gold)] border-[var(--gold)]',
    PRA:   'border text-[var(--gold)] border-[var(--gold)]',
    ICO:   'border text-[var(--gold)] border-[var(--gold)]',
  }
  const cls = styles[regulator] ?? 'text-ink-2 border border-rule bg-bg-2'
  return (
    <span className={`inline-block font-mono text-xs tracking-widest uppercase px-2 py-0.5 ${cls}`}>
      {regulator}
    </span>
  )
}
```

### 4g. Update header subtitle

```tsx
<p className="text-ink-3 text-sm">
  {jurisdictionFilter === 'US' ? 'FINRA · SEC' 
   : jurisdictionFilter === 'EU' ? 'ESMA · EBA'
   : 'FCA · PRA'} · live compliance feed
  {lastUpdated && <span className="ml-3 font-mono text-xs">updated {lastUpdated}</span>}
</p>
```

**Verification:** After refresh, select "European Union" tab — EU items appear with ESMA/EBA badges and EU rule citations. Select "United Kingdom" — FCA/PRA items appear with gold badges.

---

## Phase 5: Documentation Updates

### 5a. `CLAUDE.md`
- Update the **Database** section: note `jurisdiction` column on `regulatory_updates`
- Update the monitoring description to mention EU/UK feeds

### 5b. `README.md`
- Update the API Routes section for `POST /api/monitoring/refresh` — note it now fetches EU (ESMA, EBA) and UK (FCA, PRA) feeds
- Update Database Schema section to show `jurisdiction text default 'US'` on `regulatory_updates`
- Add new migration `20260528000000_regulatory_updates_add_jurisdiction.sql` to the migration list

---

## Final Verification Checklist

- [x] `npm run type-check` — zero errors
- [x] `npm run lint` — zero warnings
- [x] `npm run build` — clean build
- [x] Apply DB migration — `SELECT jurisdiction FROM regulatory_updates LIMIT 5` returns `'US'`
- [x] Refresh feed — new items appear with `jurisdiction` values
- [x] US tab shows FINRA/SEC items with green/neutral badges
- [x] EU tab shows ESMA/EBA items with blue badges (even if 0 items — feed may be blocked)
- [x] UK tab shows FCA/PRA items with gold badges (even if 0 items — feed may be blocked)
- [x] Existing US items unaffected (backward compat — default `'US'`)
- [x] Commit and push to main
