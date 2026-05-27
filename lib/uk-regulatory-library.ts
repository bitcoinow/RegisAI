import type { RegulatoryRequirement } from '@/types'

// 19 UK requirements evaluated in every UK-jurisdiction gap analysis.
// Add new requirements here; they are automatically included in the next analysis run.
export const UK_REGULATORY_LIBRARY: RegulatoryRequirement[] = [
  // ── SM&CR ─────────────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-001',
    rule: 'FCA SYSC 2.1 / SM&CR',
    framework: 'SM&CR',
    requirement: 'Senior Management Arrangements',
    description:
      "SMCR firms must allocate a range of specified responsibilities to one or more FCA-approved senior managers. Each firm must produce and maintain a management responsibilities map — a single document setting out the firm's management and governance arrangements, how responsibilities are allocated, and the reporting lines between senior managers. The map must be current and kept up to date.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-002',
    rule: 'FSMA 2000 s64A / SM&CR SOF',
    framework: 'SM&CR',
    requirement: 'Senior Manager Responsibilities and Statements of Responsibilities',
    description:
      'Each senior manager must have a written Statement of Responsibilities (SOR) setting out clearly what they are responsible and accountable for. Senior managers must take reasonable steps to prevent regulatory breaches in their areas of responsibility. The firm bears the burden of proof for ensuring senior managers are fit and proper on an ongoing basis.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-003',
    rule: 'FSMA 2000 s63F / FCA SYSC 27',
    framework: 'SM&CR',
    requirement: 'Certification Regime',
    description:
      'Firms must annually certify that individuals performing specified certification functions are fit and proper. Certification functions include significant management, proprietary trader, CASS oversight, and client-dealing functions among others. Firms must have documented processes for conducting and recording fitness and propriety assessments, and must maintain an updated register of certified persons.',
    defaultRisk: 'Medium',
  },
  // ── FCA Conduct ───────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-004',
    rule: 'FCA PRIN 2A / PS22/9',
    framework: 'FCA Conduct',
    requirement: 'Consumer Duty — Four Consumer Outcomes',
    description:
      "Firms must act to deliver good outcomes for retail customers across four areas: products and services that are fit for purpose and meet consumers' needs; fair value with a reasonable relationship between price paid and benefit received; consumers that are equipped with the right information to make decisions; and consumers who receive adequate support when they need it. Firms must embed Consumer Duty into their culture and governance.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-005',
    rule: 'FCA COBS 2.1.1R',
    framework: 'FCA Conduct',
    requirement: "Client's Best Interests Rule",
    description:
      "A firm must act honestly, fairly and professionally in accordance with the best interests of its client. This rule applies to all activities carried on with or for a client and includes the obligation not to place the firm's own interests above those of the client. Firms must have documented policies and procedures to ensure compliance with the best interests rule across all business lines.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-006',
    rule: 'FCA COBS 9A.2',
    framework: 'FCA Conduct',
    requirement: 'Suitability Assessment',
    description:
      "Firms making personal recommendations in relation to retail clients must take reasonable steps to ensure that the recommendation is suitable for the client. This requires obtaining sufficient information about the client's knowledge and experience, financial situation including capacity to bear losses, and investment objectives including risk tolerance. Suitability assessments must be documented and records retained for an appropriate period.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-007',
    rule: 'FCA COBS 14.3 / COBS 4',
    framework: 'FCA Conduct',
    requirement: 'Product Information and Financial Promotions',
    description:
      'Firms must ensure that information provided to clients is fair, clear and not misleading. Financial promotions must be approved by an FCA-authorised firm (unless exempt) and must comply with the detailed financial promotion rules. Key Features Documents and other prescribed product disclosures must be provided to clients at the appropriate stage and in the required format.',
    defaultRisk: 'Medium',
  },
  // ── FCA Systems ───────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-008',
    rule: 'FCA SYSC 6.1',
    framework: 'FCA Systems',
    requirement: 'Compliance Function',
    description:
      'Firms must establish, implement and maintain adequate policies and procedures sufficient to ensure compliance of the firm, its managers, employees and appointed representatives with their obligations under the regulatory system. Firms must maintain a permanent and effective compliance function. A compliance officer must be designated with responsibility for compliance, who reports to senior management.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-009',
    rule: 'FCA SYSC 7.1',
    framework: 'FCA Systems',
    requirement: 'Risk Assessment and Control',
    description:
      "Firms must establish, implement and maintain adequate risk management policies and procedures which identify the risks relating to the firm's activities, processes and systems, and where appropriate set the level of risk tolerated by the firm. Firms must establish, implement and maintain adequate risk management processes to enable the firm to assess and manage the risks it faces.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-010',
    rule: 'FCA SYSC 10.1',
    framework: 'FCA Systems',
    requirement: 'Conflicts of Interest Policy',
    description:
      "Firms must maintain and operate effective organisational and administrative arrangements with a view to taking all reasonable steps designed to prevent conflicts of interest from adversely affecting clients' interests. Firms must draw up, implement and maintain a written conflicts of interest policy that identifies circumstances which constitute or may give rise to a conflict of interest and specifies procedures to be followed and measures to be adopted in order to manage such conflicts.",
    defaultRisk: 'High',
  },
  // ── UK AML ────────────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-011',
    rule: 'MLR 2017 Regulation 18',
    framework: 'UK AML',
    requirement: 'AML Policies, Controls and Procedures',
    description:
      'Relevant persons must establish and maintain written policies and procedures relating to customer due diligence, reporting, record keeping, internal controls, risk assessment and risk management, the monitoring and management of compliance and the internal communication of such policies and procedures. The policies and procedures must be approved by senior management and must take into account the findings of the business-wide risk assessment.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-012',
    rule: 'MLR 2017 Regulation 28',
    framework: 'UK AML',
    requirement: 'Customer Due Diligence',
    description:
      'Relevant persons must apply customer due diligence measures when establishing a business relationship, when carrying out an occasional transaction of EUR 15,000 or more, when there is a suspicion of money laundering or terrorist financing, or when there are doubts about the veracity or adequacy of previously obtained customer identification data. CDD must include identifying and verifying the identity of the customer and any beneficial owner.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-013',
    rule: 'MLR 2017 Regulation 35',
    framework: 'UK AML',
    requirement: 'Enhanced Due Diligence — PEPs and High Risk',
    description:
      'Relevant persons must apply enhanced due diligence measures and enhanced ongoing monitoring in any situation which by its nature presents a higher risk of money laundering or terrorist financing. EDD must always be applied to business relationships and transactions involving politically exposed persons (PEPs) and their family members and known close associates, and must require approval of senior management.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-014',
    rule: 'MLR 2017 Regulation 24',
    framework: 'UK AML',
    requirement: 'AML Training Programme',
    description:
      'Relevant persons must take appropriate measures so that relevant employees are made aware of the law relating to money laundering and terrorist financing, and are regularly given training in how to recognise and deal with transactions and other activities which may be related to money laundering or terrorist financing. Training records must be maintained and training must be updated regularly.',
    defaultRisk: 'Medium',
  },
  // ── UK GDPR ───────────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-015',
    rule: 'UK GDPR Article 5 / DPA 2018',
    framework: 'UK GDPR',
    requirement: 'Data Processing Principles and Lawful Basis',
    description:
      'Personal data must be processed lawfully, fairly and transparently. Data must be collected for specified, explicit and legitimate purposes. Data must be adequate, relevant and limited to what is necessary for the purpose. Data must be accurate. Data must be retained only as long as necessary. Data must be processed with appropriate security. Controllers must be able to demonstrate compliance with these principles.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-016',
    rule: 'UK GDPR Article 32 / DPA 2018 s66',
    framework: 'UK GDPR',
    requirement: 'Security of Processing',
    description:
      'Controllers must implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including pseudonymisation and encryption of personal data, ability to ensure ongoing confidentiality, integrity, availability and resilience of processing systems and services, ability to restore availability and access to personal data in a timely manner after an incident, and a process for regularly testing security measures.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-017',
    rule: 'DPA 2018 s137 / UK GDPR Art 37',
    framework: 'UK GDPR',
    requirement: 'ICO Registration and Data Protection Officer',
    description:
      "Organisations that process personal data must register with the Information Commissioner's Office (ICO) and pay the applicable data protection fee (unless exempt). Organisations must designate a Data Protection Officer where required (public authority, large-scale systematic monitoring, or large-scale processing of special category data). The DPO must be provided with adequate resources and must be independent.",
    defaultRisk: 'Medium',
  },
  // ── FCA OpRes ─────────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-018',
    rule: 'FCA PS21/3 / SS1/21',
    framework: 'FCA OpRes',
    requirement: 'Important Business Services and Impact Tolerances',
    description:
      'FCA solo-regulated firms must identify their important business services — the services they provide to external end-users where a disruption could cause intolerable levels of harm to those end-users or risk to market integrity. For each important business service, firms must set impact tolerances — the maximum level of disruption firms will tolerate, expressed in terms of the maximum tolerable duration and the point at which further disruption would cause intolerable harm.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-019',
    rule: 'FCA PS21/3 / SS1/21',
    framework: 'FCA OpRes',
    requirement: 'Operational Resilience Testing and Self-Assessment',
    description:
      "Firms must regularly test their ability to remain within their impact tolerances for each important business service and must produce and maintain a self-assessment document which includes the firm's identification of important business services, their impact tolerances, their mapping of people, processes, technology, facilities and information, the results of their testing, and any identified vulnerabilities and a plan to address them.",
    defaultRisk: 'Medium',
  },
]

export function getUKRequirementById(id: string): RegulatoryRequirement | undefined {
  return UK_REGULATORY_LIBRARY.find((req) => req.id === id)
}

export function getUKRequirementsByFramework(
  framework: RegulatoryRequirement['framework']
): RegulatoryRequirement[] {
  return UK_REGULATORY_LIBRARY.filter((req) => req.framework === framework)
}
