import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Regis',
  description: 'Terms governing your use of the Regis compliance operations platform.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-ink mb-4">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-ink-2">{children}</div>
    </section>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 border-l-4 my-4" style={{ borderLeftColor: 'var(--gold)', backgroundColor: 'var(--green-tint)' }}>
      <p className="text-sm leading-relaxed text-ink">{children}</p>
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

export default function TermsPage() {
  return (
    <article>
      <header className="mb-12 pb-10 border-b border-rule">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-4">Legal</p>
        <h1 className="font-serif text-4xl text-ink mb-4">Terms of Service</h1>
        <p className="text-sm text-ink-3">Effective May 29, 2026 · Last updated May 29, 2026</p>
        <p className="text-base text-ink-2 mt-4 max-w-xl leading-relaxed">
          These Terms of Service ("<strong className="text-ink">Terms</strong>") govern your access to and use of Regis AI, Inc.'s ("<strong className="text-ink">Regis</strong>") compliance operations platform. By using Regis, you agree to these Terms.
        </p>
      </header>

      <Section title="1. Acceptance of Terms">
        <p>By creating an account or using the Regis platform, you confirm that you are at least 18 years old, have the legal authority to bind your firm to these Terms, and agree to be bound by them. If you are using Regis on behalf of an organisation, "you" refers to both you individually and the organisation.</p>
        <p>During our design partner phase, access to Regis requires an invitation. By accepting an invitation and creating an account, you additionally agree to provide good-faith feedback to help improve the platform.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>Regis is a compliance operations platform for regulated financial firms that provides:</p>
        <List items={[
          'AI-powered gap analysis of compliance documents against regulatory requirements.',
          'Real-time monitoring of regulatory publications across US, EU, and UK jurisdictions.',
          'Audit report generation and findings management.',
          'Firm-specific regulatory context based on your firm type, AUM, and primary regulator.',
        ]} />
        <Warning>
          <strong>Important: Regis is not a law firm and does not provide legal advice.</strong> The gap analysis and regulatory monitoring outputs are AI-generated informational tools. They are not a substitute for advice from qualified legal counsel or a licensed compliance professional. Your firm is solely responsible for its own compliance obligations.
        </Warning>
      </Section>

      <Section title="3. Accounts and Access">
        <p><strong className="text-ink">Account creation.</strong> You must provide accurate information when creating your account, including your firm name, type, and regulatory context. Keeping this information current is your responsibility.</p>
        <p><strong className="text-ink">Account security.</strong> You are responsible for maintaining the security of your account. Regis uses passwordless magic-link authentication to eliminate password breach risk. If you believe your account has been compromised, contact us immediately at <span className="font-mono text-sm">security@regis.ai</span>.</p>
        <p><strong className="text-ink">One account per firm.</strong> Each firm should operate under a single account. Sharing accounts across unrelated firms or individuals is not permitted.</p>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree to use Regis only for lawful purposes and in accordance with these Terms. You must not:</p>
        <List items={[
          'Upload documents you do not have the right to submit for analysis.',
          'Attempt to reverse-engineer, decompile, or extract the underlying regulatory library or AI model.',
          'Use automated means to access the service at a rate that degrades performance for other users.',
          'Attempt to gain unauthorised access to another user\'s account, data, or any Regis infrastructure.',
          'Use the service to process information about individuals without appropriate legal basis.',
          'Resell or sublicense access to the platform.',
        ]} />
      </Section>

      <Section title="5. Subscriptions and Billing">
        <p><strong className="text-ink">Design partner phase.</strong> During our current design partner phase, access may be provided at no charge or at a discounted rate in exchange for product feedback. The terms of any design partner agreement govern pricing during this phase.</p>
        <p><strong className="text-ink">Paid plans.</strong> When paid plans launch, subscription fees will be charged in advance on a monthly or annual basis. All fees are stated in USD and are non-refundable except as required by applicable law or as expressly stated in these Terms.</p>
        <p><strong className="text-ink">Cancellation.</strong> You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. You will retain access until the period ends.</p>
        <p><strong className="text-ink">Failed payments.</strong> If a payment fails, we will attempt to notify you and retry. If payment is not resolved within 14 days, we may suspend access until the outstanding balance is settled.</p>
      </Section>

      <Section title="6. AI-Generated Content and Disclaimer">
        <Warning>
          Regis uses artificial intelligence to generate compliance gap analyses. AI-generated output may be incomplete, inaccurate, or out of date. The presence of a gap in a Regis analysis does not mean your firm is legally non-compliant; the absence of a gap does not mean your firm is compliant. Always review findings with a qualified compliance professional before taking action.
        </Warning>
        <p>Regis makes no warranty that:</p>
        <List items={[
          'The regulatory library is current, complete, or applicable to every firm within a stated jurisdiction.',
          'The AI will identify every gap present in a submitted document.',
          'Acting on Regis output will satisfy any regulatory requirement or prevent regulatory action.',
        ]} />
        <p>Regulatory requirements change frequently. You are responsible for verifying that guidance cited by Regis reflects current rules as of the date of your review.</p>
      </Section>

      <Section title="7. Intellectual Property">
        <p><strong className="text-ink">Your documents.</strong> You retain all ownership rights in the documents you upload. By uploading a document, you grant Regis a limited licence to process it solely to provide the service to you. We do not claim any ownership or rights over your compliance documents.</p>
        <p><strong className="text-ink">Regis IP.</strong> The Regis platform, regulatory library, software, and all related materials are owned by Regis AI, Inc. and protected by intellectual property laws. These Terms do not grant you any rights to Regis IP beyond the right to use the service as described herein.</p>
        <p><strong className="text-ink">Feedback.</strong> If you provide feedback or suggestions about the platform, you grant Regis a perpetual, royalty-free licence to use that feedback without obligation or attribution.</p>
      </Section>

      <Section title="8. Confidentiality">
        <p>Regis treats all documents you upload and audit results as confidential. We will not disclose your documents or analysis outputs to third parties except as required by law, as necessary to provide the service (e.g., transmitting text to Anthropic's API for analysis), or with your explicit consent.</p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>To the fullest extent permitted by law, Regis and its officers, directors, employees, and affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including (without limitation) any regulatory action taken against your firm, any compliance failure not identified by Regis, or any loss of data.</p>
        <p>Our total liability to you for any claim arising out of these Terms or your use of the service will not exceed the amount you paid to Regis in the 12 months preceding the claim, or $100 USD if you have not made any payments.</p>
      </Section>

      <Section title="10. Indemnification">
        <p>You agree to indemnify and hold Regis harmless from any claims, damages, losses, and expenses (including reasonable legal fees) arising from your violation of these Terms, your use of the platform, or any documents you upload.</p>
      </Section>

      <Section title="11. Termination">
        <p><strong className="text-ink">By you.</strong> You may close your account at any time from your account settings or by contacting us.</p>
        <p><strong className="text-ink">By Regis.</strong> We may suspend or terminate your access if you materially breach these Terms, if your account has been inactive for more than 12 months, or if we discontinue the service. We will provide reasonable notice where possible.</p>
        <p>On termination, your right to access the platform ceases immediately. You may request an export of your audit history within 30 days of termination.</p>
      </Section>

      <Section title="12. Governing Law">
        <p>These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any disputes will be resolved in the state or federal courts located in San Francisco, California, and you consent to the personal jurisdiction of those courts.</p>
      </Section>

      <Section title="13. Changes to These Terms">
        <p>We may update these Terms from time to time. We will notify you by email at least 14 days before material changes take effect. Your continued use of the platform after the effective date constitutes acceptance of the updated Terms.</p>
        <p>For questions about these Terms, contact us at <span className="font-mono text-sm">legal@regis.ai</span>.</p>
      </Section>
    </article>
  )
}
