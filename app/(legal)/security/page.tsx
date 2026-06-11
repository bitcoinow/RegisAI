import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security — Regis',
  description: 'How Regis protects your compliance data with multi-tenant isolation, encryption, and secure authentication.',
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

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border border-rule bg-bg-2">
      <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-1">{label}</p>
      <p className="text-sm font-medium text-ink">{value}</p>
    </div>
  )
}

export default function SecurityPage() {
  return (
    <article>
      <header className="mb-12 pb-10 border-b border-rule">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-4">Legal</p>
        <h1 className="font-serif text-4xl text-ink mb-4">Security</h1>
        <p className="text-sm text-ink-3">Last updated June 1, 2026</p>
        <p className="text-base text-ink-2 mt-4 max-w-xl leading-relaxed">
          Compliance professionals trust Regis with sensitive firm documents. This page describes the specific technical and operational controls we use to protect your data.
        </p>
      </header>

      <Section title="Architecture Overview">
        <Callout>
          Regis is built on a strict multi-tenant architecture. Every customer account is completely isolated from every other. This isolation is enforced at the database layer — not just the application layer — making it structurally impossible for one account to access another's data.
        </Callout>
        <p>The platform is built on Next.js (App Router) deployed on Vercel, with Supabase as the database and file storage layer. All components are cloud-native and operate under the security controls of their respective providers; Vercel and Supabase each hold SOC 2 Type II certification as infrastructure subprocessors. Regis itself has not yet undergone an independent certification audit.</p>
      </Section>

      <Section title="Data Isolation (Multi-Tenant)">
        <p><strong className="text-ink">Row-Level Security (RLS).</strong> Every table in the Regis database has RLS policies enabled. These policies ensure that every SQL query — regardless of where it originates — is automatically scoped to the authenticated user's account ID. Even if a software bug caused an incorrect query to be issued, the database would refuse to return another user's rows.</p>
        <p><strong className="text-ink">Unique immutable profile IDs.</strong> Every user is assigned a UUID at registration by Supabase Auth. This ID is immutable, unique across the system, and is the foreign key that all data — documents, audits, findings, profile data — is associated with.</p>
        <p><strong className="text-ink">Storage isolation.</strong> Uploaded documents are stored in Supabase Storage with per-user path namespacing and RLS policies that prevent any user from accessing another's files, even if they construct a direct URL.</p>
        <p><strong className="text-ink">No shared state.</strong> There is no application-level cache or session state that could leak data between accounts. Every request is independently authenticated and independently authorised.</p>
      </Section>

      <Section title="Encryption">
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <SpecCard label="In transit" value="TLS 1.3 enforced on all connections" />
          <SpecCard label="At rest" value="AES-256-GCM (Supabase / Vercel)" />
          <SpecCard label="Document storage" value="Encrypted at rest, per-user access policies" />
          <SpecCard label="Session tokens" value="httpOnly, Secure, SameSite=Lax cookies" />
        </div>
        <p>All communication between your browser, the Regis application, Supabase, and Anthropic occurs over TLS 1.3. TLS 1.0 and 1.1 are explicitly disabled. HSTS is enforced with a minimum one-year max-age.</p>
      </Section>

      <Section title="Authentication">
        <p><strong className="text-ink">Authentication methods.</strong> Regis supports email and password sign-in and Google OAuth. Optional TOTP multi-factor authentication (MFA) can be enrolled in account settings; once a verified factor exists, an AAL2 challenge is required before dashboard access. Passwords are never stored by Regis — they are hashed and managed entirely by Supabase Auth.</p>
        <p><strong className="text-ink">Session management.</strong> Sessions are managed server-side via the <span className="font-mono text-sm">@supabase/ssr</span> library using httpOnly cookies. Session tokens cannot be accessed by browser JavaScript, which eliminates XSS-based session hijacking as an attack vector.</p>
        <p><strong className="text-ink">Route protection.</strong> All authenticated routes are protected at two independent layers: the Next.js middleware (which runs at the edge before any page renders) and the application layout (which performs a server-side auth check). An invalid or expired session at either layer redirects immediately to the login page.</p>
      </Section>

      <Section title="AI and Document Processing">
        <p>Given that compliance documents may contain sensitive firm information, we are explicit about how document data is handled when performing AI analysis.</p>
        <List items={[
          'Document text is extracted server-side using a local PDF parser (pdf-parse). The raw file is never sent to Anthropic.',
          'Extracted text is truncated to 12,000 characters before being sent to the Anthropic API. This minimises the amount of firm data transmitted per request.',
          'Per Anthropic\'s API data usage terms, content submitted via the API is not used to train models. See Anthropic\'s published commercial terms for current detail on API data handling.',
          'All API calls to Anthropic are made over TLS from Regis\'s server environment. The Anthropic API key is stored as a server-side environment variable and is never exposed to the browser.',
          'When drafting remediation policy language, only the relevant finding\'s details are sent to the API — never the full source document.',
          'Analysis results and any AI-drafted policy language (the findings, not the original document text) are stored in your account\'s audit history under the same row-level security guarantees as all other data.',
        ]} />
        <p>
          Users should not upload highly sensitive personal, legal, financial, medical, or
          confidential client information unless proper agreements and controls are in place.
          Regis AI outputs are informational and should be reviewed by qualified professionals.
        </p>
      </Section>

      <Section title="Infrastructure and Providers">
        <p>Regis relies on infrastructure providers with strong security postures:</p>
        <div className="space-y-3 mt-2">
          {[
            { name: 'Vercel', cert: 'SOC 2 Type II', desc: 'Application hosting, edge network, and DDoS protection. Production deployments are immutable and built from a locked dependency tree.' },
            { name: 'Supabase', cert: 'SOC 2 Type II', desc: 'PostgreSQL database, file storage, and authentication. Hosted on AWS with encryption at rest and in transit.' },
            { name: 'Anthropic', cert: 'Commercial API agreement', desc: 'AI inference for scenario and policy analysis. Per Anthropic\'s API terms, submitted content is not used for model training.' },
            { name: 'Resend', cert: 'SOC 2 Type II', desc: 'Transactional email delivery for account verification emails and regulatory monitoring digests.' },
          ].map((p) => (
            <div key={p.name} className="p-4 border border-rule bg-bg-2">
              <div className="flex items-baseline justify-between mb-1">
                <p className="font-medium text-sm text-ink">{p.name}</p>
                <span className="font-mono text-xs text-ink-3">{p.cert}</span>
              </div>
              <p className="text-sm text-ink-2">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Role-Based Access (Roadmap)">
        <p>The current platform supports single-user access per account. Multi-user support (Professional and Enterprise plans) is in active development. When released, it will include:</p>
        <List items={[
          'Admin role: full account access, can invite and remove users, manage billing.',
          'Editor role: can upload documents, run analyses, and manage findings. Cannot change billing or user seats.',
          'Viewer role: read-only access to audit history and monitoring feed. Cannot upload documents or run analyses.',
          'All roles enforce the same data isolation guarantees: users within a firm account can only access that firm\'s data.',
        ]} />
      </Section>

      <Section title="Vulnerability Disclosure">
        <p>We follow a responsible disclosure model. If you discover a security vulnerability in the Regis platform, please report it to us before public disclosure so we can investigate and remediate.</p>
        <div className="p-5 border border-rule bg-bg-2 mt-2">
          <p className="text-sm font-medium text-ink">Report a vulnerability</p>
          <p className="text-sm text-ink-2 mt-1">Email: <span className="font-mono">security@regis.ai</span></p>
          <p className="text-sm text-ink-2 mt-1">We acknowledge all reports within 48 hours and aim to release a fix within 14 days for critical issues. We do not pursue legal action against researchers who act in good faith.</p>
        </div>
      </Section>

      <Section title="Incident Response">
        <p>In the event of a security incident that affects your data:</p>
        <List items={[
          'We will notify affected customers by email within 72 hours of confirming a breach.',
          'Notifications will describe the nature of the incident, the data potentially affected, and the steps we have taken.',
          'We maintain an incident response runbook and conduct an annual review of our response procedures.',
        ]} />
        <p>For security questions or concerns that are not vulnerability disclosures, contact us at <span className="font-mono text-sm">security@regis.ai</span>.</p>
      </Section>
    </article>
  )
}
