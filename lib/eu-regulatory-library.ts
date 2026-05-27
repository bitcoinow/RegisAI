import type { RegulatoryRequirement } from '@/types'

// 23 EU requirements evaluated in every EU-jurisdiction gap analysis.
// Add new requirements here; they are automatically included in the next analysis run.
export const EU_REGULATORY_LIBRARY: RegulatoryRequirement[] = [
  // ── MiFID II ──────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-001',
    rule: 'MiFID II Article 16',
    framework: 'MiFID II',
    requirement: 'Organisational Requirements',
    description:
      'Investment firms must establish adequate policies and procedures sufficient to ensure compliance of the firm including its managers, employees and tied agents with its obligations under MiFID II, as well as appropriate rules governing personal transactions. The firm must also maintain and operate effective organisational and administrative arrangements to take all reasonable steps designed to prevent conflicts of interest.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-002',
    rule: 'MiFID II Article 25',
    framework: 'MiFID II',
    requirement: 'Assessment of Suitability and Appropriateness',
    description:
      "Investment firms must obtain necessary information regarding the client's or potential client's knowledge and experience in the investment field, financial situation including capacity to bear losses, and investment objectives including risk tolerance so as to enable the firm to recommend suitable investment services and instruments.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-003',
    rule: 'MiFID II Article 27',
    framework: 'MiFID II',
    requirement: 'Best Execution',
    description:
      'Investment firms must take all sufficient steps to obtain the best possible result for their clients, taking into account price, costs, speed, likelihood of execution and settlement, size, nature and any other consideration relevant to the execution of the order. Firms must establish and implement effective arrangements and execution policies.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-004',
    rule: 'MiFID II Article 23',
    framework: 'MiFID II',
    requirement: 'Conflicts of Interest',
    description:
      'Investment firms must maintain and operate effective organisational and administrative arrangements with a view to taking all reasonable steps designed to prevent conflicts of interest from adversely affecting the interests of their clients. Firms must establish, implement and maintain a written conflicts of interest policy.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-005',
    rule: 'MiFID II Article 24',
    framework: 'MiFID II',
    requirement: 'General Principles and Client Communication',
    description:
      'Investment firms must act honestly, fairly and professionally in accordance with the best interests of their clients. All information addressed to clients, including marketing communications, must be fair, clear and not misleading. Firms must provide clients with appropriate information about the firm, its services, financial instruments offered and proposed investment strategies.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-006',
    rule: 'MiFID II Article 16(3) / Delegated Regulation 2017/565',
    framework: 'MiFID II',
    requirement: 'Product Governance (POG)',
    description:
      'Investment firms that manufacture financial instruments must maintain, operate and review a process for the approval of each financial instrument and significant adaptations of existing instruments before they are marketed or distributed. The approval process must specify an identified target market and must ensure that all relevant risks to the target market are assessed.',
    defaultRisk: 'High',
  },
  // ── GDPR ──────────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-007',
    rule: 'GDPR Article 5',
    framework: 'GDPR',
    requirement: 'Lawfulness of Processing — Principles',
    description:
      'Personal data must be processed lawfully, fairly and transparently. Data must be collected for specified, explicit and legitimate purposes and not further processed in a manner incompatible with those purposes. Data must be adequate, relevant and limited to what is necessary. Data must be accurate, and erasure or rectification must be facilitated. Data must be kept in a form which permits identification for no longer than is necessary.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-008',
    rule: 'GDPR Article 24',
    framework: 'GDPR',
    requirement: 'Controller Accountability',
    description:
      'The controller must implement appropriate technical and organisational measures to ensure and be able to demonstrate that processing is performed in accordance with the GDPR. Where proportionate in relation to processing activities, this must include the implementation of appropriate data protection policies. Controllers must maintain a Record of Processing Activities (ROPA) under Article 30.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-009',
    rule: 'GDPR Article 32',
    framework: 'GDPR',
    requirement: 'Security of Processing',
    description:
      'The controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including as appropriate pseudonymisation and encryption, ensuring ongoing confidentiality, integrity, availability and resilience of processing systems, ability to restore availability and access to personal data in timely manner after incident, and a process for regularly testing and evaluating the effectiveness of security measures.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-010',
    rule: 'GDPR Article 33 and 34',
    framework: 'GDPR',
    requirement: 'Personal Data Breach Notification',
    description:
      'In the case of a personal data breach, the controller shall without undue delay and, where feasible, not later than 72 hours after having become aware of it, notify the competent supervisory authority. Where the breach is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall communicate the personal data breach to the data subject without undue delay.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-011',
    rule: 'GDPR Article 37',
    framework: 'GDPR',
    requirement: 'Data Protection Officer Designation',
    description:
      'Controllers and processors must designate a Data Protection Officer where processing is carried out by a public authority or body, or where the core activities consist of processing operations requiring regular and systematic monitoring of data subjects on a large scale, or where core activities consist of processing on a large scale of special categories of data. The DPO must be provided with resources necessary to carry out tasks and maintain expertise.',
    defaultRisk: 'Medium',
  },
  // ── AMLD ──────────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-012',
    rule: '6AMLD / Directive 2018/843 Article 8',
    framework: 'AMLD',
    requirement: 'AML Programme and Internal Controls',
    description:
      'Obliged entities must have in place adequate written policies, controls and procedures to mitigate and manage effectively the risks of money laundering and terrorist financing identified at EU, Member State and own level. These must include customer due diligence, reporting, record keeping, internal control, risk assessment and management, compliance management and communication.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-013',
    rule: '6AMLD Article 13',
    framework: 'AMLD',
    requirement: 'Customer Due Diligence',
    description:
      'Obliged entities must apply customer due diligence measures when establishing a business relationship, when carrying out an occasional transaction of EUR 15,000 or more, when there is a suspicion of money laundering or terrorist financing regardless of any derogation or threshold, or when there are doubts about the veracity or adequacy of previously obtained customer identification data.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-014',
    rule: '6AMLD Article 18',
    framework: 'AMLD',
    requirement: 'Enhanced Due Diligence for High-Risk Third Countries and PEPs',
    description:
      'In cases involving higher risk, obliged entities must apply enhanced customer due diligence measures. Member States and obliged entities must apply enhanced due diligence to natural persons or legal entities established in high-risk third countries, and to transactions involving such countries. Politically exposed persons must be subject to enhanced scrutiny including approval of senior management before establishing a business relationship.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-015',
    rule: '6AMLD / Directive 2018/843 Article 30',
    framework: 'AMLD',
    requirement: 'Beneficial Ownership Register and Verification',
    description:
      'Member States must ensure that corporate and other legal entities incorporated within their territory obtain and hold adequate, accurate and current information on their beneficial ownership. Obliged entities must collect and verify beneficial ownership information as part of CDD. A beneficial owner is any natural person who ultimately owns or controls more than 25% of shares or voting rights in a legal entity.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-016',
    rule: '6AMLD Article 33',
    framework: 'AMLD',
    requirement: 'Suspicious Transaction Reporting',
    description:
      'Obliged entities and their directors and employees shall co-operate fully with the FIU. They must promptly report to the FIU on their own initiative where they know, suspect or have reasonable grounds to suspect that funds or activities are proceeds of criminal activity or are related to terrorist financing. They must provide the FIU with all necessary information upon request.',
    defaultRisk: 'High',
  },
  // ── DORA ──────────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-017',
    rule: 'DORA Article 5 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'ICT Risk Management Framework',
    description:
      'Financial entities must have in place a sound, comprehensive and well-documented ICT risk management framework as part of their overall risk management system. The ICT risk management framework must include strategies, policies, procedures, ICT protocols and tools necessary to protect all information and ICT assets, including computer software, hardware, servers, and physical components, against ICT risks.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-018',
    rule: 'DORA Article 17 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'ICT-Related Incident Reporting',
    description:
      'Financial entities must report major ICT-related incidents to the competent authority. Financial entities must submit an initial notification, followed by an intermediate report and a final report. The initial notification must be submitted without unnecessary delay, and no later than 4 hours from the moment the financial entity has classified the incident as major, and no later than 24 hours from the moment the entity became aware of it.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-019',
    rule: 'DORA Article 26 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'Digital Operational Resilience Testing',
    description:
      'Financial entities must maintain and review a sound and comprehensive digital operational resilience testing programme. This must include a range of assessments, tests, methodologies, practices and tools. Significant financial entities must conduct advanced testing of ICT tools, systems and processes using threat-led penetration testing (TLPT) at least every 3 years.',
    defaultRisk: 'Medium',
  },
  // ── SFDR ──────────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-020',
    rule: 'SFDR Article 3 (Regulation 2019/2088)',
    framework: 'SFDR',
    requirement: 'Sustainability Risk Integration Policy',
    description:
      'Financial market participants and financial advisers must publish written policies on the integration of sustainability risks in their investment decision-making process or investment or insurance advice. Where they consider sustainability risks to not be relevant, they must publish and maintain a clear and reasoned explanation of why they deem this to be the case.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-021',
    rule: 'SFDR Article 4 (Regulation 2019/2088)',
    framework: 'SFDR',
    requirement: 'Principal Adverse Impact Disclosure',
    description:
      'Financial market participants must publish and maintain on their websites a statement on their due diligence policies with respect to the principal adverse impacts of investment decisions on sustainability factors, or where they do not consider principal adverse impacts, clear and reasoned explanations for why they do not do so, and where relevant information on whether and when they intend to consider such adverse impacts.',
    defaultRisk: 'Medium',
  },
  // ── MAR ───────────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-022',
    rule: 'MAR Article 16 (Regulation 596/2014)',
    framework: 'MAR',
    requirement: 'Market Abuse Prevention — Suspicious Transactions',
    description:
      'Market operators and investment firms that operate a trading venue must establish and maintain effective arrangements, systems and procedures to prevent and detect insider dealing, market manipulation and attempted insider dealing and market manipulation. They must report suspicious orders and transactions to the competent authority without delay.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-023',
    rule: 'MAR Article 17 (Regulation 596/2014)',
    framework: 'MAR',
    requirement: 'Disclosure of Inside Information',
    description:
      'Issuers must inform the public as soon as possible of inside information which directly concerns them. Issuers must post and maintain on their websites all inside information they are required to publicly disclose. They must ensure that any disclosure is done in a manner which enables fast access and a complete, correct and timely assessment of the information.',
    defaultRisk: 'High',
  },
]

export function getEURequirementById(id: string): RegulatoryRequirement | undefined {
  return EU_REGULATORY_LIBRARY.find((req) => req.id === id)
}

export function getEURequirementsByFramework(
  framework: RegulatoryRequirement['framework']
): RegulatoryRequirement[] {
  return EU_REGULATORY_LIBRARY.filter((req) => req.framework === framework)
}
