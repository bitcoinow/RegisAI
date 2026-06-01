import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Regis',
  description: 'How Regis collects, uses, and protects your compliance data.',
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

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-ink-2">
          <span className="text-green shrink-0 mt-px">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPage() {
  return (
    <article>
      <header className="mb-12 pb-10 border-b border-rule">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-4">Legal</p>
        <h1 className="font-serif text-4xl text-ink mb-4">Privacy Policy</h1>
        <p className="text-sm text-ink-3">Effective May 29, 2026 · Last updated June 1, 2026</p>
        <p className="text-base text-ink-2 mt-4 max-w-xl leading-relaxed">
          Regis AI, Inc. ("<strong className="text-ink">Regis</strong>", "we", "us") takes data privacy seriously — especially given that our customers trust us with sensitive compliance documents. This policy explains exactly what we collect, why, and how we protect it.
        </p>
      </header>

      <Section title="1. Information We Collect">
        <p><strong className="text-ink">Account information.</strong> When you create an account, we collect your email address and, during onboarding, your firm name, firm type, AUM range, and primary regulator. This information is used to personalise every analysis to your regulatory context.</p>
        <p><strong className="text-ink">Documents you upload.</strong> Compliance documents (PDFs) you upload for gap analysis are stored in encrypted cloud storage. The extracted text is sent to our AI provider for analysis and then stored alongside your audit results.</p>
        <p><strong className="text-ink">Analysis and drafted content.</strong> The findings produced by an analysis, and any AI-drafted policy language you generate to remediate a finding, are stored with your account&rsquo;s audit history so you can return to them. Drafted content is associated only with your account and is never shared across accounts.</p>
        <p><strong className="text-ink">Usage data.</strong> We collect information about how you use Regis — pages visited, features used, audit frequency — to improve the product and diagnose issues.</p>
        <p><strong className="text-ink">Log data.</strong> Standard server logs including IP address, browser type, and request timestamps. These are retained for 30 days for security monitoring purposes.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <List items={[
          'To provide the Regis service: running gap analyses, surfacing regulatory monitoring updates, and storing your audit history.',
          'To personalise your experience: every audit and monitoring feed is scoped to your firm type, AUM range, and jurisdiction.',
          'To send email alerts: regulatory monitoring notifications and, if opted in, the weekly digest.',
          'To improve the product: aggregate, anonymised usage patterns inform feature development.',
          'For security and fraud prevention: log data is reviewed when anomalous access patterns are detected.',
        ]} />
        <p>We do not sell your data to third parties. We do not use your data for advertising.</p>
      </Section>

      <Section title="3. Third-Party Services">
        <p>Regis is built on best-in-class infrastructure providers, each with their own data processing agreements:</p>
        <div className="space-y-4 mt-2">
          {[
            { name: 'Supabase', role: 'Database, file storage, and authentication. Your account data and uploaded documents are stored in Supabase. Supabase is SOC 2 Type II certified.' },
            { name: 'Anthropic', role: 'AI analysis. Extracted document text is sent to Anthropic\'s Claude API to perform the gap analysis. Anthropic\'s API does not use submitted data to train models. See Anthropic\'s privacy policy for details.' },
            { name: 'Resend', role: 'Transactional email delivery. Used for magic-link authentication emails and regulatory monitoring digests.' },
            { name: 'Vercel', role: 'Application hosting and global CDN. Vercel is SOC 2 Type II certified.' },
          ].map((p) => (
            <div key={p.name} className="p-4 border border-rule bg-bg-2">
              <p className="font-medium text-sm text-ink mb-1">{p.name}</p>
              <p className="text-sm text-ink-2">{p.role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="4. Data Isolation">
        <Callout>
          Every customer account is fully isolated. No cross-user data access is possible by design — it is enforced at the database layer via row-level security policies, not just application logic.
        </Callout>
        <p>Regis uses a multi-tenant architecture where each user account is assigned a unique, immutable ID at registration. All database queries are automatically scoped to this ID via Supabase Row-Level Security (RLS). Even if a bug existed in our application code, the database layer would prevent any account from accessing another account's documents, audit results, or profile data.</p>
      </Section>

      <Section title="5. Data Retention">
        <List items={[
          'Account and profile data: retained until you request deletion.',
          'Uploaded documents: stored until you delete them from the platform or close your account.',
          'Audit results and findings: retained with your account history until deletion.',
          'Server logs: retained for 30 days for security purposes, then purged.',
          'On account closure: all personal data and documents are deleted within 30 days of your request.',
        ]} />
      </Section>

      <Section title="6. AI and Your Documents">
        <p>This section matters particularly for compliance professionals handling sensitive firm documents.</p>
        <List items={[
          'Your documents are never used to train AI models — by Regis or Anthropic. Anthropic\'s API operates under a zero-data-retention policy for API requests.',
          'Document text is extracted server-side by Regis and transmitted to Anthropic\'s API over an encrypted connection (TLS 1.3).',
          'The extracted text is scoped to 12,000 characters per analysis to minimise data exposure.',
          'When you generate draft policy language for a finding, only that finding\'s details (the rule, the gap, and the suggested remediation) are sent to Anthropic\'s API — not your full document.',
          'If you are concerned about uploading particularly sensitive documents, we recommend reviewing the specific document before upload and redacting client-identifying information where it is not relevant to the compliance analysis.',
        ]} />
      </Section>

      <Section title="7. Cookies">
        <p>Regis uses only authentication session cookies — the minimum required to keep you logged in. We do not use advertising cookies, third-party tracking pixels, or analytics that send data to external services.</p>
        <p>Session cookies are set as <code className="font-mono text-xs bg-bg-2 px-1.5 py-0.5 border border-rule text-ink">httpOnly</code> and <code className="font-mono text-xs bg-bg-2 px-1.5 py-0.5 border border-rule text-ink">Secure</code>, which means they cannot be accessed by JavaScript and are only transmitted over HTTPS.</p>
      </Section>

      <Section title="8. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <List items={[
          'Access the personal data we hold about you.',
          'Correct inaccurate data in your profile.',
          'Export your audit history and data in a machine-readable format.',
          'Delete your account and all associated data.',
          'Object to certain processing (e.g., usage analytics).',
        ]} />
        <p>To exercise any of these rights, email <strong className="text-ink font-mono text-sm">privacy@regis.ai</strong>. We will respond within 30 days.</p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>We will notify registered users by email at least 14 days before any material change to this policy takes effect. Continued use of the service after the effective date constitutes acceptance of the updated policy.</p>
      </Section>

      <Section title="10. Contact">
        <p>For privacy-related questions or to exercise your data rights:</p>
        <div className="p-5 border border-rule bg-bg-2 mt-2">
          <p className="text-sm text-ink font-medium">Regis AI, Inc.</p>
          <p className="text-sm text-ink-2 mt-1">Email: <span className="font-mono">privacy@regis.ai</span></p>
        </div>
      </Section>
    </article>
  )
}
