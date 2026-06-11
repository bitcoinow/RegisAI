import type { RegulatoryRequirement } from '@/types'

// 12 UK workplace-compliance requirements — the default scope for UK policy
// gap analysis. These cover the controls a typical UK organisation's internal
// policies are expected to address (gifts & hospitality, anti-bribery,
// conflicts of interest, sanctions, data protection, escalation, ownership,
// training). Add new requirements here; they are automatically included in
// the next analysis run.
export const UK_WORKPLACE_LIBRARY: RegulatoryRequirement[] = [
  // ── Gifts & hospitality ─────────────────────────────────────────────────────
  {
    id: 'REQ-UKW-001',
    rule: 'Bribery Act 2010 s.1, s.7 / corporate policy standard',
    framework: 'UK Workplace',
    requirement: 'Gifts & Hospitality Thresholds and Approval Limits',
    description:
      'The policy must define clear monetary thresholds for gifts and hospitality that may be given or received, with named approval levels above each threshold (e.g. line manager, compliance). It should distinguish between giving and receiving, address cumulative value over a period, and explicitly cover hospitality offered during live tenders, pitches, or procurement processes, where even modest hospitality can create improper-influence risk.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UKW-002',
    rule: 'Bribery Act 2010 s.7 adequate procedures / MoJ Guidance Principle 5',
    framework: 'UK Workplace',
    requirement: 'Gifts & Hospitality Register and Recording',
    description:
      'The policy must require all gifts and hospitality given or received above a de minimis level to be recorded in a central register, with the value, counterparty, business context, and approval recorded. The register must be reviewed periodically by a named owner so that patterns (e.g. repeated hospitality to the same client contact) can be identified.',
    defaultRisk: 'Medium',
  },
  // ── Anti-bribery ────────────────────────────────────────────────────────────
  {
    id: 'REQ-UKW-003',
    rule: 'Bribery Act 2010 s.7 / MoJ Guidance — Adequate Procedures',
    framework: 'UK Workplace',
    requirement: 'Anti-Bribery Policy and Adequate Procedures',
    description:
      'The organisation must maintain a clear anti-bribery policy proportionate to its bribery risks, covering the six MoJ principles: proportionate procedures, top-level commitment, risk assessment, due diligence, communication and training, and monitoring and review. The policy must prohibit offering, promising, giving, requesting, or accepting a bribe or any improper advantage, including through third parties.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UKW-004',
    rule: 'Bribery Act 2010 s.6 / MoJ Guidance',
    framework: 'UK Workplace',
    requirement: 'Facilitation Payments Prohibition',
    description:
      'The policy must explicitly prohibit facilitation payments (small unofficial payments to speed up routine actions), which are illegal under the Bribery Act 2010, and set out what staff should do if such a payment is demanded, including safety exceptions and a requirement to report and record any incident.',
    defaultRisk: 'Medium',
  },
  // ── Conflicts of interest ───────────────────────────────────────────────────
  {
    id: 'REQ-UKW-005',
    rule: 'Common-law fiduciary duties / corporate governance standard',
    framework: 'UK Workplace',
    requirement: 'Conflicts of Interest Declaration and Management',
    description:
      'The policy must require staff to declare actual, potential, or perceived conflicts of interest (personal relationships, outside business interests, financial interests in suppliers or clients) through a defined declaration process, with a named function maintaining a conflicts register and documented mitigation steps (recusal, reassignment, additional oversight).',
    defaultRisk: 'High',
  },
  // ── Procurement & third parties ─────────────────────────────────────────────
  {
    id: 'REQ-UKW-006',
    rule: 'Bribery Act 2010 / Procurement Act 2023 principles',
    framework: 'UK Workplace',
    requirement: 'Procurement and Pitch-Process Fairness',
    description:
      'The policy must set integrity rules for tenders, pitches, and vendor selection: no gifts or hospitality intended to influence an active procurement decision, separation between relationship and decision roles where practicable, documented evaluation criteria, and a requirement to report any counterparty who solicits a personal benefit in exchange for awarding work.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UKW-007',
    rule: 'Bribery Act 2010 s.7 / MoJ Guidance Principle 4',
    framework: 'UK Workplace',
    requirement: 'Third-Party Due Diligence',
    description:
      'The policy must require proportionate, risk-based due diligence on agents, intermediaries, suppliers, and business partners before engagement and periodically thereafter, with enhanced checks for higher-risk relationships and a clear record of the checks performed.',
    defaultRisk: 'Medium',
  },
  // ── Sanctions ───────────────────────────────────────────────────────────────
  {
    id: 'REQ-UKW-008',
    rule: 'Sanctions and Anti-Money Laundering Act 2018 / OFSI guidance',
    framework: 'UK Workplace',
    requirement: 'Sanctions and Restricted-Party Screening',
    description:
      'The policy must require screening of customers, suppliers, and other counterparties against UK sanctions lists (and other applicable regimes) before onboarding and on an ongoing basis, define what happens on a potential match (freeze activity, escalate to a named owner, consider OFSI reporting), and assign clear ownership for the screening process.',
    defaultRisk: 'High',
  },
  // ── Data protection ─────────────────────────────────────────────────────────
  {
    id: 'REQ-UKW-009',
    rule: 'UK GDPR / Data Protection Act 2018',
    framework: 'UK Workplace',
    requirement: 'Data Protection Basics',
    description:
      'The policy must address lawful bases for processing personal data, data minimisation, retention periods, security measures, staff responsibilities when handling personal data, the process for recognising and reporting a personal data breach (including the 72-hour ICO notification assessment), and how data subject rights requests are handled.',
    defaultRisk: 'High',
  },
  // ── Escalation & reporting ──────────────────────────────────────────────────
  {
    id: 'REQ-UKW-010',
    rule: 'PIDA 1998 / corporate governance standard',
    framework: 'UK Workplace',
    requirement: 'Escalation and Incident Reporting (incl. Whistleblowing)',
    description:
      'The policy must define a clear escalation route for suspected compliance breaches and grey-area situations: who to report to, expected timeframes, how reports are recorded and tracked to resolution, protection from retaliation for good-faith reporters, and an alternative confidential channel (whistleblowing route) where the normal line-management route is inappropriate.',
    defaultRisk: 'High',
  },
  // ── Governance ──────────────────────────────────────────────────────────────
  {
    id: 'REQ-UKW-011',
    rule: 'Corporate governance standard',
    framework: 'UK Workplace',
    requirement: 'Policy Ownership and Review Frequency',
    description:
      'The policy must name an accountable owner (role, not just an individual), state a defined review cycle (typically at least annual), record version history and approval, and describe how material changes are communicated to staff. A policy without a named owner or review date is a governance gap in itself.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-UKW-012',
    rule: 'Bribery Act 2010 s.7 / MoJ Guidance Principles 5–6',
    framework: 'UK Workplace',
    requirement: 'Training, Attestation, and Audit Trail',
    description:
      'The policy must require periodic compliance training for relevant staff, annual attestation that staff have read and understood the policy, and record-keeping sufficient to evidence the above — completed training records, attestation logs, gift register entries, conflict declarations, and escalation records — so the organisation can demonstrate its procedures operated in practice.',
    defaultRisk: 'Medium',
  },
]
