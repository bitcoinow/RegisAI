export interface ParsedUpdate {
  regulator: string
  jurisdiction: 'US' | 'EU' | 'UK'
  title: string
  summary: string
  url: string
  published_at: string | null
  relevance_score: number
  affected_rules: string[]
  raw_content: string
}

// ── US: Federal Register API ──────────────────────────────────────────────────
const FR_API = 'https://www.federalregister.gov/api/v1/articles.json'

interface FRArticle {
  title: string
  abstract: string | null
  html_url: string
  publication_date: string
  type: string
}

// ── EU feed sources ───────────────────────────────────────────────────────────
const EU_FEEDS = [
  { url: 'https://www.esma.europa.eu/press-news/esma-news/rss.xml', regulator: 'ESMA' },
  { url: 'https://www.eba.europa.eu/rss/news', regulator: 'EBA' },
]

// ── UK feed sources ───────────────────────────────────────────────────────────
const UK_FEEDS = [
  { url: 'https://www.fca.org.uk/news/rss.xml', regulator: 'FCA' },
  { url: 'https://www.bankofengland.co.uk/rss/pressreleases', regulator: 'PRA' },
]

// ── Rule keyword matchers (US + EU + UK) ──────────────────────────────────────
const FINRA_RE = /FINRA|Financial\s+Industry\s+Regulatory/i

const RULE_KEYWORDS: { pattern: RegExp; rule: string }[] = [
  // US — FINRA
  { pattern: /FINRA\s+Rule\s+3110/i, rule: 'FINRA Rule 3110' },
  { pattern: /FINRA\s+Rule\s+3120/i, rule: 'FINRA Rule 3120' },
  { pattern: /FINRA\s+Rule\s+2111/i, rule: 'FINRA Rule 2111' },
  { pattern: /FINRA\s+Rule\s+4511/i, rule: 'FINRA Rule 4511' },
  { pattern: /FINRA\s+Rule\s+3310/i, rule: 'FINRA Rule 3310' },
  { pattern: /FINRA\s+Rule\s+4370/i, rule: 'FINRA Rule 4370' },
  // US — SEC
  { pattern: /Rule\s+17a-[34]/i, rule: 'SEC Rule 17a-3/4' },
  { pattern: /Regulation\s+S-P/i, rule: 'SEC Regulation S-P' },
  { pattern: /Rule\s+206\(4\)-7/i, rule: 'SEC Rule 206(4)-7' },
  { pattern: /Rule\s+204A-1/i, rule: 'SEC Rule 204A-1' },
  { pattern: /Regulation\s+S-ID/i, rule: 'SEC Regulation S-ID' },
  { pattern: /Rule\s+15c3-3/i, rule: 'SEC Rule 15c3-3' },
  { pattern: /Rule\s+206\(4\)-2/i, rule: 'SEC Rule 206(4)-2' },
  { pattern: /Rule\s+15l-1|Reg(?:ulation)?\s+Best\s+Interest|Reg\s+BI/i, rule: 'Reg BI' },
  { pattern: /Form\s+CRS/i, rule: 'Form CRS' },
  { pattern: /AML|anti-money\s+laundering/i, rule: 'AML/BSA' },
  { pattern: /BSA|Bank\s+Secrecy\s+Act/i, rule: 'BSA' },
  { pattern: /suspicious\s+activity|SAR/i, rule: 'SAR Reporting' },
  { pattern: /customer\s+identification|CIP/i, rule: 'CIP' },
  { pattern: /customer\s+due\s+diligence|CDD/i, rule: 'CDD' },
  { pattern: /OFAC|sanctions\s+screening/i, rule: 'OFAC Sanctions' },
  { pattern: /beneficial\s+ownership/i, rule: 'Beneficial Ownership' },
  // EU
  { pattern: /MiFID\s+II?/i, rule: 'MiFID II' },
  { pattern: /GDPR|General\s+Data\s+Protection\s+Regulation/i, rule: 'GDPR' },
  { pattern: /AMLD[4-6]?|anti.money\s+laundering\s+directive/i, rule: 'AMLD' },
  { pattern: /DORA|Digital\s+Operational\s+Resilience/i, rule: 'DORA' },
  { pattern: /SFDR|Sustainable\s+Finance\s+Disclosure/i, rule: 'SFDR' },
  { pattern: /\bMAR\b|Market\s+Abuse\s+Regulation/i, rule: 'MAR' },
  { pattern: /ESMA/i, rule: 'ESMA' },
  { pattern: /\bEBA\b/i, rule: 'EBA' },
  // UK
  { pattern: /SM&CR|Senior\s+Managers\s+(?:&|and)\s+Certification/i, rule: 'SM&CR' },
  { pattern: /Consumer\s+Duty|PRIN\s+2A/i, rule: 'FCA Consumer Duty' },
  { pattern: /MLR\s+201[57]|Money\s+Laundering\s+Regulations/i, rule: 'MLR 2017' },
  { pattern: /FCA\s+COBS|Conduct\s+of\s+Business/i, rule: 'FCA COBS' },
  { pattern: /FCA\s+SYSC|Systems\s+and\s+Controls/i, rule: 'FCA SYSC' },
  { pattern: /UK\s+GDPR/i, rule: 'UK GDPR' },
  { pattern: /ICO|Information\s+Commissioner/i, rule: 'ICO' },
  { pattern: /PRA\s+Rulebook|Prudential\s+Regulation\s+Authority/i, rule: 'PRA Rules' },
]

const HIGH_RELEVANCE =
  /supervisory|compliance\s+program|enforcement\s+action|penalty|fine|censure|violation|broker-dealer|investment\s+adviser|registered\s+representative|sanction|supervisory\s+notice|final\s+notice|prohibition\s+order|systemic\s+risk/i
const MED_RELEVANCE =
  /disclosure|registration|reporting|examination|inspection|custod|consultation\s+paper|policy\s+statement|technical\s+standard|regulatory\s+technical/i

function scoreRelevance(text: string): number {
  if (HIGH_RELEVANCE.test(text)) return 5
  if (MED_RELEVANCE.test(text)) return 3
  return 2
}

function extractAffectedRules(text: string): string[] {
  const found = new Set<string>()
  for (const { pattern, rule } of RULE_KEYWORDS) {
    if (pattern.test(text)) found.add(rule)
  }
  return Array.from(found)
}

// Strip verbose "Self-Regulatory Organizations; ORG; " prefix common in Federal Register titles
function cleanTitle(title: string): string {
  return title.replace(/^Self-Regulatory\s+Organizations;\s+[^;]+;\s*/i, '').trim()
}

// ── Lightweight RSS/Atom parser (zero deps) ───────────────────────────────────
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

    const get = (tag: string): string => {
      const m = new RegExp(
        `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
        'i'
      ).exec(block)
      return m?.[1]?.trim() ?? ''
    }

    // Atom feeds use <link href="..."/> self-closing; RSS uses <link>url</link>
    const linkText = get('link')
    const linkHref = /<link[^>]+href="([^"]+)"/.exec(block)?.[1] ?? ''
    const link = linkHref || linkText

    const pubDate = get('pubDate') || get('published') || get('updated') || null

    items.push({
      title: get('title'),
      link,
      description: get('description') || get('summary') || get('content'),
      pubDate,
    })
  }
  return items.filter((i) => i.title && i.link)
}

// ── Per-jurisdiction fetch helpers ────────────────────────────────────────────

async function fetchUSFeeds(): Promise<ParsedUpdate[]> {
  const params = new URLSearchParams({
    'conditions[agencies][]': 'securities-and-exchange-commission',
    per_page: '80',
    order: 'newest',
  })
  const fields = ['title', 'abstract', 'html_url', 'publication_date', 'type']
  for (const f of fields) params.append('fields[]', f)

  try {
    const res = await fetch(`${FR_API}?${params.toString()}`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      console.error(`Federal Register fetch failed: ${res.status}`)
      return []
    }
    const data = (await res.json()) as { results?: FRArticle[] }
    const articles = data.results ?? []

    return articles.map((article) => {
      const title = cleanTitle(article.title)
      const summary = article.abstract ?? article.type ?? ''
      const text = `${title} ${summary}`
      return {
        regulator: FINRA_RE.test(article.title) ? 'FINRA' : 'SEC',
        jurisdiction: 'US' as const,
        title: title.slice(0, 500),
        summary: summary.slice(0, 1000),
        url: article.html_url,
        published_at: article.publication_date
          ? new Date(article.publication_date).toISOString()
          : null,
        relevance_score: scoreRelevance(text),
        affected_rules: extractAffectedRules(text),
        raw_content: summary.slice(0, 5000),
      }
    })
  } catch (err) {
    console.error('Federal Register feed error:', err)
    return []
  }
}

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

// ── Public entry point ────────────────────────────────────────────────────────

export async function fetchAndParseFeeds(): Promise<ParsedUpdate[]> {
  const allFetches = [
    fetchUSFeeds(),
    ...EU_FEEDS.map(({ url, regulator }) => fetchRssFeed(url, regulator, 'EU')),
    ...UK_FEEDS.map(({ url, regulator }) => fetchRssFeed(url, regulator, 'UK')),
  ]

  const results = await Promise.allSettled(allFetches)
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
}
