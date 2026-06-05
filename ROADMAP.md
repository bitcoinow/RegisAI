# Regis AI — Product Roadmap

## Current Focus: UK Financial Services (FCA)

Regis AI is an AI-powered compliance review platform for UK financial services firms. The initial beachhead market is FCA-regulated firms requiring structured documentation reviews.

**Status:** Early Access / Design Partner Programme

---

## Phase 1 — UK FCA (Live)

**Target:** FCA-regulated financial firms in the United Kingdom

**Frameworks:**
- FCA Handbook
- Consumer Duty (PS22/9)
- Operational Resilience
- SMCR (Senior Managers & Certification Regime)
- Financial Crime Controls (UK AML)
- UK GDPR

**Target Customers:**
- Financial Advisers
- Wealth Management Firms
- Insurance Brokers
- Fintech Companies
- Compliance Consultancies
- Asset Managers

**Core Workflow:**
1. PDF document upload
2. Text extraction
3. AI gap analysis against FCA expectations
4. Finding risk rating and prioritisation
5. Policy language drafting
6. Review report generation
7. Human review workflow (assign, resolve, accept risk)
8. Regulatory monitoring feed (FCA, PRA, Bank of England)

---

## Phase 2 — European Expansion

**Frameworks:**
- DORA (Digital Operational Resilience Act)
- MiFID II / MiFIR
- GDPR (EU)
- AMLD6 (Anti-Money Laundering Directive 6)
- SFDR (Sustainable Finance Disclosure Regulation)
- MAR (Market Abuse Regulation)

**Platform additions:**
- PDF export for review reports
- Multi-user team collaboration
- Bulk document upload
- Webhook and email notifications
- Stripe billing integration

---

## Phase 3 — US Market Entry

**Frameworks:**
- SEC Rules (Investment Advisers Act)
- FINRA rules
- BSA/AML
- Reg BI (Regulation Best Interest)
- State money transmitter regulations

**Platform additions:**
- API access for workflow integration
- SSO / SAML 2.0
- Custom framework additions (Enterprise)
- Advanced audit trail and evidence management

---

## Phase 4 — AIOS Platform (Multi-Tenant)

The underlying architecture evolves into a full compliance operating system (AIOS):

- Multi-tenant organisation management
- Role-based access controls (Admin, Editor, Reviewer, Viewer)
- Cross-document compliance portfolio management
- Regulatory change impact assessment
- Integration marketplace (Slack, Teams, JIRA, SharePoint)
- White-label / OEM licensing for compliance consultancies
- AI governance and model risk documentation support

---

## Technical Debt Backlog

| Item | Priority | Notes |
|------|----------|-------|
| PDF export for review reports | High | Currently display-only; print-ready export in roadmap |
| DOCX document support | Medium | Currently PDF only |
| Bulk document upload | Medium | Single upload per audit today |
| Role-based access controls | Medium | Multi-user without granular roles today |
| Stripe billing integration | High | Gated behind design partner access currently |
| Email notifications on findings | Medium | Monitoring digest exists; per-finding alerts pending |
| Re-scan for EU/UK frameworks | Low | Currently implemented for US only |

---

## Known Risks

| Risk | Mitigation |
|------|------------|
| AI hallucination in regulatory citations | Human review workflow enforced; all output labelled as AI-assisted |
| FCA regulatory change outpacing library updates | Monitoring feed + design partner feedback loop |
| Document text truncation losing context | 12,000 char limit; chunking strategy on roadmap |
| Single user per firm | Multi-user in Phase 2; current design partner firms are solo CCOs |
| No billing enforcement | Design partner access only; Stripe integration in Phase 2 |

---

## Success Metrics

| Metric | Phase 1 Target |
|--------|---------------|
| Design partner firms | 20 FCA-regulated firms |
| Avg. gaps found per review | ≥ 4 |
| Policy drafts accepted | ≥ 60% accepted without edit |
| Time to first review | < 10 minutes from signup |
| Regulatory monitoring CTR | ≥ 15% per digest |
