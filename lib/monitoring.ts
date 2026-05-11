export interface ParsedUpdate {
  regulator: string
  title: string
  summary: string
  url: string
  published_at: string | null
  relevance_score: number
  affected_rules: string[]
  raw_content: string
}

const FEEDS: { regulator: string; url: string }[] = [
  { regulator: 'SEC', url: 'https://www.sec.gov/rss/rules/proposed.xml' },
  { regulator: 'SEC', url: 'https://www.sec.gov/rss/rules/final.xml' },
  { regulator: 'SEC', url: 'https://www.sec.gov/rss/litigation/litreleases.xml' },
  {
    regulator: 'FINRA',
    url: 'https://www.finra.org/rules-guidance/notices/regulatory-notices.rss',
  },
]

const RULE_KEYWORDS: { pattern: RegExp; rule: string }[] = [
  { pattern: /FINRA\s+Rule\s+3110/i, rule: 'FINRA Rule 3110' },
  { pattern: /FINRA\s+Rule\s+3120/i, rule: 'FINRA Rule 3120' },
  { pattern: /FINRA\s+Rule\s+2111/i, rule: 'FINRA Rule 2111' },
  { pattern: /FINRA\s+Rule\s+4511/i, rule: 'FINRA Rule 4511' },
  { pattern: /FINRA\s+Rule\s+3310/i, rule: 'FINRA Rule 3310' },
  { pattern: /FINRA\s+Rule\s+4370/i, rule: 'FINRA Rule 4370' },
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
]

const HIGH_RELEVANCE =
  /supervisory|compliance\s+program|enforcement\s+action|penalty|fine|censure|violation|broker-dealer|investment\s+adviser|registered\s+representative/i
const MED_RELEVANCE = /disclosure|registration|reporting|examination|inspection|custod/i

function extractTag(block: string, tag: string): string | null {
  const cdata = block.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i')
  )
  if (cdata?.[1] != null) return cdata[1].trim()
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return plain?.[1] != null ? plain[1].trim() : null
}

type ParsedItem = { title: string; link: string; description: string; pubDate: string }

function parseItems(xml: string): ParsedItem[] {
  const items: ParsedItem[] = []

  // RSS 2.0: <item>
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1]
    if (!block) continue
    const title = extractTag(block, 'title')
    const link = extractTag(block, 'link') ?? extractTag(block, 'guid')
    if (!title || !link) continue
    items.push({
      title,
      link,
      description: extractTag(block, 'description') ?? '',
      pubDate: extractTag(block, 'pubDate') ?? extractTag(block, 'dc:date') ?? '',
    })
  }

  // Atom: <entry> (fallback if no RSS items found)
  if (items.length === 0) {
    for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
      const block = m[1]
      if (!block) continue
      const title = extractTag(block, 'title')
      const linkMatch = block.match(/<link[^>]+href="([^"]+)"/)
      const link = linkMatch?.[1] ?? extractTag(block, 'id')
      if (!title || !link) continue
      items.push({
        title,
        link,
        description: extractTag(block, 'summary') ?? extractTag(block, 'content') ?? '',
        pubDate: extractTag(block, 'updated') ?? extractTag(block, 'published') ?? '',
      })
    }
  }

  return items
}

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

function parseDate(raw: string): string | null {
  if (!raw) return null
  try {
    const d = new Date(raw)
    return isNaN(d.getTime()) ? null : d.toISOString()
  } catch {
    return null
  }
}

export async function fetchAndParseFeeds(): Promise<ParsedUpdate[]> {
  const results: ParsedUpdate[] = []

  await Promise.allSettled(
    FEEDS.map(async ({ regulator, url }) => {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Regis-Compliance/1.0 (compliance monitoring)' },
        next: { revalidate: 0 },
      })
      if (!res.ok) return

      const xml = await res.text()
      const items = parseItems(xml)

      for (const item of items.slice(0, 20)) {
        const text = `${item.title} ${item.description}`
        results.push({
          regulator,
          title: item.title.slice(0, 500),
          summary: item.description.replace(/<[^>]+>/g, '').slice(0, 1000),
          url: item.link,
          published_at: parseDate(item.pubDate),
          relevance_score: scoreRelevance(text),
          affected_rules: extractAffectedRules(text),
          raw_content: item.description.slice(0, 5000),
        })
      }
    })
  )

  return results
}
