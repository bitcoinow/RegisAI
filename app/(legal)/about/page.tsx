import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Regis',
  description:
    'Regis is an AI-powered compliance scenario risk assessment and policy gap analysis platform. Learn who we build for, what we do, and the principles behind the product.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-ink mb-4">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-ink-2">{children}</div>
    </section>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 border-l-4 border-green bg-green-tint my-4">
      <p className="text-sm leading-relaxed text-green">{children}</p>
    </div>
  )
}

function PrincipleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-5 border border-rule bg-bg-2">
      <p className="font-medium text-sm text-ink mb-1">{title}</p>
      <p className="text-sm text-ink-2 leading-relaxed">{body}</p>
    </div>
  )
}

export default function AboutPage() {
  return (
    <article>
      <header className="mb-12 pb-10 border-b border-rule">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-4">Company</p>
        <h1 className="font-serif text-4xl text-ink mb-4">About Regis</h1>
        <p className="text-base text-ink-2 mt-4 max-w-xl leading-relaxed">
          Regis is an AI-powered compliance platform built for the people who carry regulatory risk
          on their shoulders — compliance officers, legal teams, risk managers, and governance
          professionals who need to know where their policies fall short before a regulator does.
        </p>
      </header>

      <Section title="Why we exist">
        <p>
          Compliance teams across regulated industries operate in high-stakes environments where a
          single missed policy gap can mean a fine, an enforcement action, or reputational risk.
          Whether in media and advertising, professional services, financial services, or any other
          regulated sector — reviewing policies and procedures against the full body of applicable
          rules is slow, manual work, and the rules keep moving.
        </p>
        <Callout>
          Regis replaces days of manual line-by-line review with a focused, actionable report that
          shows exactly where a compliance manual falls short — and what to do about it.
        </Callout>
      </Section>

      <Section title="What we do">
        <p>
          Upload a PDF compliance manual and Regis extracts the text, runs a structured gap analysis
          against jurisdiction-specific regulatory requirements, and returns a prioritised findings
          report with risk ratings, identified strengths, and concrete remediation actions. It is
          built to be read and acted on, not filed away.
        </p>
        <p>
          The platform analyses compliance documents and scenarios against jurisdiction-specific
          regulatory requirements across three geographies:
        </p>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <PrincipleCard title="United Kingdom" body="UK GDPR, anti-bribery and corruption, sanctions obligations, FCA rules, SM&CR, and operational resilience." />
          <PrincipleCard title="European Union" body="GDPR, anti-money laundering (AMLD6), DORA, SFDR, MiFID II, and MAR requirements." />
          <PrincipleCard title="United States" body="Anti-money laundering (AML/BSA), SEC and FINRA rules, Reg BI, and business continuity requirements." />
        </div>
        <p>
          Regis does not stop at finding the gap. For any finding, it drafts ready-to-paste
          compliance-manual language that closes it — written in the formal voice of a manual,
          scoped to the firm&rsquo;s jurisdiction, and citing the governing rule — so remediation
          starts with a draft in hand rather than a blank page.
        </p>
        <p>
          Beyond point-in-time audits, Regis monitors regulatory sources across all three
          jurisdictions, so teams can see relevant updates as the rules they are measured against
          change.
        </p>
      </Section>

      <Section title="The principles behind the product">
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <PrincipleCard
            title="Clarity over decoration"
            body="Every element should make the product easier to understand — not just prettier to look at."
          />
          <PrincipleCard
            title="Show the work"
            body="Trust is earned through transparency. We surface the methodology, the requirements, and the reasoning behind every finding."
          />
          <PrincipleCard
            title="Institutional confidence"
            body="The product is built to belong in a boardroom, not a pitch deck — serious tools for serious work."
          />
          <PrincipleCard
            title="Approachable rigour"
            body="Compliance is complex. The interface should reduce that complexity, not mirror it."
          />
        </div>
      </Section>

      <Section title="How we handle your data">
        <p>
          Compliance documents are sensitive, and we treat them that way. Regis is built on a strict
          multi-tenant architecture with data isolation enforced at the database layer, passwordless
          magic-link authentication, and encryption in transit and at rest. Document analysis is run
          under a zero-data-retention policy — submitted content is never used to train models.
        </p>
        <p>
          For the full technical detail, see our{' '}
          <Link href="/security" className="text-green underline underline-offset-2 hover:text-green-2">
            Security
          </Link>{' '}
          page.
        </p>
      </Section>

      <Section title="Get in touch">
        <p>
          Regis is in active development through an early access programme. If you work in
          compliance, legal, risk, or governance and want early access — or simply want to talk
          about what we are building — we would like to hear from you.
        </p>
        <div className="p-5 border border-rule bg-bg-2 mt-2">
          <p className="text-sm font-medium text-ink">Contact</p>
          <p className="text-sm text-ink-2 mt-1">
            Email: <span className="font-mono">hello@regis.ai</span>
          </p>
          <p className="text-sm text-ink-2 mt-2">
            Or{' '}
            <Link href="/#access" className="text-green underline underline-offset-2 hover:text-green-2">
              request early access
            </Link>{' '}
            to join the programme.
          </p>
        </div>
      </Section>
    </article>
  )
}
