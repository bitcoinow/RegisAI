import type { RegulatoryRequirement, RegulatoryFramework } from '@/types'

// 80 EU requirements evaluated in every EU-jurisdiction gap analysis (16 of them GDPR).
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
      "Investment firms must obtain necessary information regarding the client\'s or potential client\'s knowledge and experience in the investment field, financial situation including capacity to bear losses, and investment objectives including risk tolerance so as to enable the firm to recommend suitable investment services and instruments.",
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
  // ── GDPR (extended coverage) ────────────────────────────────────────────────
  {
    id: 'REQ-EU-024',
    rule: 'GDPR Article 6',
    framework: 'GDPR',
    requirement: 'Lawful Basis for Processing',
    description:
      'Processing is lawful only if and to the extent that at least one of the six legal bases in Article 6(1) applies: consent, performance of a contract, compliance with a legal obligation, protection of vital interests, performance of a task in the public interest, or legitimate interests. The controller must identify and document the appropriate lawful basis for each processing activity before processing begins, and where relying on legitimate interests must carry out and record a legitimate interests assessment (LIA).',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-025',
    rule: 'GDPR Article 7',
    framework: 'GDPR',
    requirement: 'Conditions for Consent',
    description:
      'Where processing is based on consent, the controller must be able to demonstrate that the data subject consented. Requests for consent must be presented in a manner clearly distinguishable from other matters, in an intelligible and easily accessible form, using clear and plain language. Consent must be freely given, specific, informed and unambiguous, and the data subject must be able to withdraw consent at any time as easily as it was given.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-026',
    rule: 'GDPR Article 9',
    framework: 'GDPR',
    requirement: 'Special Categories of Personal Data',
    description:
      'Processing of special categories of personal data — revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data for unique identification, health data, or data concerning a person’s sex life or sexual orientation — is prohibited unless one of the specific conditions in Article 9(2) applies (e.g. explicit consent, substantial public interest with a basis in law). Controllers must identify the Article 9 condition and any required additional safeguards.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-027',
    rule: 'GDPR Articles 12, 13 and 14',
    framework: 'GDPR',
    requirement: 'Transparency and Privacy Notices',
    description:
      'The controller must provide data subjects with concise, transparent, intelligible and easily accessible information about the processing of their personal data, in clear and plain language. This includes the identity and contact details of the controller and DPO, the purposes and lawful basis of processing, recipients, retention periods, data subject rights, and (where data is not obtained from the data subject) the source of the data. This information is typically delivered through a privacy notice provided at or before the point of collection.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-028',
    rule: 'GDPR Articles 15 to 22',
    framework: 'GDPR',
    requirement: 'Data Subject Rights',
    description:
      'The controller must establish procedures to facilitate the exercise of data subject rights: the right of access, rectification, erasure (right to be forgotten), restriction of processing, data portability, objection, and rights related to automated decision-making and profiling. Requests must generally be responded to without undue delay and within one month, free of charge, and the controller must verify the identity of the requester and document each request and its outcome.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-029',
    rule: 'GDPR Article 25',
    framework: 'GDPR',
    requirement: 'Data Protection by Design and by Default',
    description:
      'The controller must implement appropriate technical and organisational measures — such as pseudonymisation and data minimisation — designed to implement the data protection principles in an effective manner and to integrate the necessary safeguards into the processing, both at the time of determining the means of processing and at the time of the processing itself. By default, only personal data necessary for each specific purpose may be processed, and personal data must not be made accessible to an indefinite number of persons without intervention.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-030',
    rule: 'GDPR Article 28',
    framework: 'GDPR',
    requirement: 'Processors and Data Processing Agreements',
    description:
      'Where processing is carried out on behalf of a controller, the controller must use only processors providing sufficient guarantees to implement appropriate technical and organisational measures. Processing by a processor must be governed by a written contract (Data Processing Agreement) that sets out the subject matter, duration, nature and purpose of processing, the obligations and rights of the controller, and the Article 28(3) mandatory clauses including confidentiality, security, sub-processor authorisation, assistance, and deletion or return of data.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-031',
    rule: 'GDPR Article 30',
    framework: 'GDPR',
    requirement: 'Records of Processing Activities (ROPA)',
    description:
      'Each controller and, where applicable, its representative must maintain a written record of processing activities under its responsibility, containing the name and contact details of the controller and DPO, the purposes of processing, a description of the categories of data subjects and personal data, the categories of recipients, transfers to third countries, the envisaged time limits for erasure, and a general description of the technical and organisational security measures. The record must be made available to the supervisory authority on request.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-032',
    rule: 'GDPR Article 35',
    framework: 'GDPR',
    requirement: 'Data Protection Impact Assessment (DPIA)',
    description:
      'Where a type of processing, in particular using new technologies, is likely to result in a high risk to the rights and freedoms of natural persons, the controller must, prior to the processing, carry out a Data Protection Impact Assessment. The DPIA must contain a systematic description of the processing and purposes, an assessment of necessity and proportionality, an assessment of the risks to data subjects, and the measures envisaged to address those risks. Where residual high risk remains, prior consultation with the supervisory authority under Article 36 is required.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-033',
    rule: 'GDPR Chapter V, Articles 44 to 49',
    framework: 'GDPR',
    requirement: 'International Transfers of Personal Data',
    description:
      'Any transfer of personal data to a third country or international organisation may take place only if the controller and processor comply with Chapter V. Transfers must be based on an adequacy decision, or, in its absence, on appropriate safeguards such as Standard Contractual Clauses or Binding Corporate Rules, accompanied where necessary by a transfer impact assessment and supplementary measures. In the absence of these, transfers may rely only on the specific derogations in Article 49.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-034',
    rule: 'GDPR Article 5(1)(e)',
    framework: 'GDPR',
    requirement: 'Storage Limitation and Retention',
    description:
      'Personal data must be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which it is processed. The controller must establish and apply a data retention schedule that defines retention periods for each category of personal data, together with secure deletion or anonymisation procedures at the end of the retention period, and must periodically review stored data to ensure it is not retained beyond its lawful purpose.',
    defaultRisk: 'Medium',
  },

  // ── GDPR (additional data subject rights) ────────────────────────────────
  {
    id: 'REQ-EU-035',
    rule: 'GDPR Article 15',
    framework: 'GDPR',
    requirement: 'Data Subject Access Rights — Right of Access',
    description:
      'Under GDPR Article 15, data subjects have the right to obtain from the controller confirmation of whether personal data concerning them is being processed, and where that is the case, access to that personal data together with: the purposes of processing, the categories of data concerned, the recipients, the envisaged retention period, the existence of other data subject rights, the right to lodge a complaint, and, where data is not collected from the data subject, the source. The controller must provide a copy of the data free of charge, typically within one calendar month of receipt of a valid request. Verification of the requester\'s identity is required, and the organisation must maintain a documented process for handling Subject Access Requests (SARs).',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-036',
    rule: 'GDPR Article 17',
    framework: 'GDPR',
    requirement: 'Right to Erasure / Right to be Forgotten',
    description:
      'GDPR Article 17 grants data subjects the right to obtain from the controller the erasure of personal data concerning them without undue delay where: the data is no longer necessary for its original purpose; the data subject withdraws consent and no other legal basis exists; the data subject objects under Article 21 and there are no overriding legitimate grounds; the data has been unlawfully processed; or erasure is required to comply with a legal obligation. The controller must erase data and inform any third-party recipients to whom data has been disclosed, unless doing so involves disproportionate effort. Controllers must have a documented erasure process, technical means to delete data in all systems (including backups where feasible), and a response mechanism to handle erasure requests within one month.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-037',
    rule: 'GDPR Article 35',
    framework: 'GDPR',
    requirement: 'Data Protection Impact Assessment (DPIA)',
    description:
      'GDPR Article 35 requires controllers to carry out a Data Protection Impact Assessment (DPIA) prior to any type of processing that is likely to result in a high risk to the rights and freedoms of natural persons, particularly when using new technologies. A DPIA is mandatory for: systematic and extensive profiling with significant effects; large-scale processing of special category or criminal offence data; and systematic monitoring of publicly accessible areas on a large scale. The DPIA must contain a systematic description of the envisaged processing operations and purposes, an assessment of the necessity and proportionality of those operations, an assessment of the risks to the rights and freedoms of data subjects, and the measures envisaged to address those risks. Where residual high risk cannot be mitigated, the controller must consult the supervisory authority under Article 36 prior to commencing processing.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-038',
    rule: 'GDPR Articles 37-39',
    framework: 'GDPR',
    requirement: 'Data Protection Officer Designation and Tasks',
    description:
      'GDPR Articles 37-39 require controllers and processors to designate a Data Protection Officer (DPO) where: the processing is carried out by a public authority or body; the core activities consist of processing operations that require regular and systematic monitoring of data subjects on a large scale; or the core activities consist of processing on a large scale of special categories of data or data relating to criminal convictions. The DPO must be designated on the basis of professional qualities and expert knowledge of data protection law. The DPO must be provided with the resources necessary to carry out their tasks and maintain their expert knowledge, must be accessible to data subjects, and must act as a contact point for the supervisory authority. The DPO is responsible for informing and advising on compliance obligations, monitoring compliance, advising on DPIAs, and cooperating with the supervisory authority.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-039',
    rule: 'GDPR Articles 44-49',
    framework: 'GDPR',
    requirement: 'International Data Transfers — Adequacy and Standard Contractual Clauses',
    description:
      'GDPR Chapter V (Articles 44-49) restricts transfers of personal data to third countries or international organisations unless appropriate safeguards are in place. The primary mechanism is an adequacy decision by the European Commission (e.g. EU-US Data Privacy Framework). In the absence of adequacy, controllers must rely on standard contractual clauses (SCCs) adopted by the Commission, binding corporate rules (BCRs), or other instruments under Article 46. Since the Schrems II judgment (C-311/18), controllers using SCCs must also conduct a Transfer Impact Assessment (TIA) to evaluate whether the law and practice of the destination country ensures adequate protection; if the TIA identifies a shortfall, supplementary technical or contractual measures must be applied. Only as a last resort may controllers rely on the specific derogations in Article 49, such as explicit consent or the performance of a contract.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-040',
    rule: 'GDPR Article 7',
    framework: 'GDPR',
    requirement: 'Consent Management and Withdrawal',
    description:
      'GDPR Article 7 sets out the conditions for consent as a lawful basis for processing. The controller must be able to demonstrate that the data subject consented to the processing. If consent is given in the context of a written declaration that also concerns other matters, the request for consent must be presented in a manner clearly distinguishable from those other matters, in an intelligible and easily accessible form, using clear and plain language. Consent must be freely given — it cannot be bundled as a non-negotiable condition of service. The data subject must be informed of their right to withdraw consent at any time, and withdrawal must be as easy as giving consent. Controllers must maintain a timestamped, auditable record of each consent obtained, the version of consent language shown, and any subsequent withdrawal, and must cease processing promptly upon withdrawal.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-041',
    rule: 'GDPR Article 30',
    framework: 'GDPR',
    requirement: 'Records of Processing Activities (ROPA)',
    description:
      'GDPR Article 30 requires each controller (and, separately, each processor) to maintain a written or electronic Record of Processing Activities (ROPA). The controller\'s ROPA must contain: the name and contact details of the controller and any joint controller, the DPO, and where applicable, the EU representative; the purposes of the processing; a description of the categories of data subjects and personal data; the categories of recipients; details of transfers to third countries including the safeguards in place; the envisaged time limits for erasure; and a general description of technical and organisational security measures. The ROPA must be made available to the supervisory authority on request. While organisations with fewer than 250 employees may be exempt, the exemption does not apply where processing is likely to result in a risk to the rights of data subjects, is not occasional, or involves special category data.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-042',
    rule: 'GDPR Article 28',
    framework: 'GDPR',
    requirement: 'Data Processor Agreements',
    description:
      'GDPR Article 28 requires that where processing is carried out on behalf of a controller, the controller shall only use processors that provide sufficient guarantees to implement appropriate technical and organisational measures such that the processing will meet the requirements of the GDPR and ensure protection of the rights of data subjects. Processing by a processor must be governed by a binding contract or other legal act between the controller and processor that sets out the subject-matter, duration, nature and purpose of the processing, the type of personal data and categories of data subjects, and the obligations and rights of the controller. The contract must include the Article 28(3) mandatory clauses, covering confidentiality obligations, security obligations under Article 32, restrictions on sub-processing, assistance obligations in relation to data subject rights and DPIAs, deletion or return of data at the end of the service, and audit cooperation rights. Controllers must maintain an up-to-date register of all processor relationships and Data Processing Agreements (DPAs).',
    defaultRisk: 'High',
  },

  // ── DORA (expanded) ───────────────────────────────────────────────────────
  {
    id: 'REQ-EU-043',
    rule: 'DORA Articles 6-16 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'ICT Risk Management Framework',
    description:
      'DORA Articles 6-16 require financial entities to put in place a sound, comprehensive and well-documented ICT risk management framework. Article 6 requires management bodies to define, approve and oversee the ICT risk strategy and be accountable for managing ICT risk. Article 8 requires identification and classification of all ICT assets and information assets. Article 9 requires protection and prevention measures covering information security policies and access controls. Article 10 requires detection capabilities to promptly identify anomalous activities. Article 11 requires business continuity plans and ICT response and recovery plans. Article 12 requires backup policies, restoration procedures and documented recovery time objectives (RTO). Article 13 requires learning and evolving mechanisms including post-incident reviews. Article 16 provides proportionate requirements for microenterprises. The framework must be reviewed at least annually.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-044',
    rule: 'DORA Articles 17-23 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'ICT-Related Incident Reporting',
    description:
      'DORA Articles 17-23 establish a harmonised ICT incident reporting regime. Under Article 18, financial entities must classify ICT-related incidents according to criteria including the number of affected clients, the geographical spread, the data losses, the criticality of affected services, and the economic impact. Article 19 requires the reporting of major ICT-related incidents to the competent authority: an initial notification within 4 hours of classification as major (and no later than 24 hours after first awareness); an intermediate report within 72 hours; and a final report within one month. Article 20 empowers competent authorities to centralise reporting via a single EU Hub. Article 22 requires financial entities to notify affected clients where incidents have or may have an impact on their financial interests. Financial entities must maintain a detailed incident register.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-045',
    rule: 'DORA Articles 24-27 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'Digital Operational Resilience Testing',
    description:
      'DORA Articles 24-27 require financial entities to maintain and review a sound and comprehensive digital operational resilience testing programme as an integral part of the ICT risk management framework. Article 24 requires all financial entities (except microenterprises) to test their ICT tools, systems and processes at least annually using a risk-based approach, including vulnerability assessments, open-source analyses, network security assessments, gap analyses, physical security reviews, and scenario-based tests. Article 26 requires significant financial entities (as designated by competent authorities) to additionally conduct Threat-Led Penetration Testing (TLPT) at least every three years, covering critical or important functions and live production systems, performed by internal or external certified testers. Article 27 sets minimum requirements for TLPT testers. Results and remediation plans must be reported to management and competent authorities.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-046',
    rule: 'DORA Articles 28-44 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'ICT Third-Party Risk Management',
    description:
      'DORA Articles 28-44 establish a comprehensive framework for managing ICT third-party risk. Article 28 requires financial entities to maintain and update an ICT third-party register and conduct due diligence before entering into any new contractual arrangement with an ICT third-party service provider. Article 29 requires that all contractual arrangements for ICT services include mandatory provisions covering the full description of services, data locations, sub-outsourcing arrangements, accessibility and recoverability of data, cooperation with audits, termination rights, and exit strategies. Article 30 specifies additional requirements for contracts involving critical or important functions, including performance targets and audit rights. Articles 31-44 establish a public oversight framework for critical ICT third-party service providers (CTPPs) designated by the ESAs, which are subject to direct supervision by Lead Overseers.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-047',
    rule: 'DORA Article 45 (Regulation 2022/2554)',
    framework: 'DORA',
    requirement: 'Information Sharing Arrangements',
    description:
      'DORA Article 45 explicitly enables and encourages financial entities to exchange cyber threat intelligence and information amongst themselves, including indicators of compromise, tactics, techniques and procedures, cyber security alerts, and configuration tools. Participation in information-sharing arrangements is voluntary and must be conducted in a manner that is compliant with competition law (in particular Articles 101 and 102 TFEU) and must not lead to disclosure of confidential information in breach of applicable rules. Financial entities participating in such arrangements must notify their competent authority of their participation. Information sharing should take place within trusted communities of financial entities and may extend to relevant third-party providers and authorities where appropriate.',
    defaultRisk: 'Low',
  },

  // ── AI Act ────────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-048',
    rule: 'EU AI Act Article 6 (Regulation 2024/1689)',
    framework: 'AI Act',
    requirement: 'AI System Risk Classification',
    description:
      'EU AI Act Article 6 establishes the classification rules for high-risk AI systems. An AI system is classified as high-risk if it is a product covered by Union harmonisation legislation listed in Annex I (e.g. medical devices, machinery, vehicles) where it is itself the product or a safety component of that product. Additionally, AI systems listed in Annex III are classified as high-risk, covering: biometric identification and categorisation; management of critical infrastructure; education and vocational training; employment, workers management and access to self-employment; access to essential private and public services; law enforcement; migration, asylum and border control; and administration of justice and democratic processes. Providers and deployers must conduct an initial risk classification assessment and document their reasoning. Systems that pose only limited or minimal risk are not subject to mandatory high-risk obligations but may be subject to transparency requirements under Article 52.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-049',
    rule: 'EU AI Act Article 43 (Regulation 2024/1689)',
    framework: 'AI Act',
    requirement: 'High-Risk AI — Conformity Assessment',
    description:
      'EU AI Act Article 43 requires that high-risk AI systems undergo a conformity assessment procedure before being placed on the market or put into service. For most high-risk AI systems listed in Annex III, the provider may conduct an internal conformity assessment based on the quality management and technical documentation requirements of Articles 9-17. For certain high-risk AI systems involving biometric identification or categorisation and for AI systems in products covered by Annex I harmonisation legislation, third-party conformity assessment by a notified body is required. The conformity assessment must verify compliance with requirements including: risk management systems (Art 9); data governance (Art 10); technical documentation (Art 11); record-keeping and logging (Art 12); transparency (Art 13); human oversight (Art 14); accuracy, robustness and cybersecurity (Art 15). A CE marking must be affixed where applicable.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-050',
    rule: 'EU AI Act Article 52 (Regulation 2024/1689)',
    framework: 'AI Act',
    requirement: 'Transparency Obligations for AI Systems',
    description:
      'EU AI Act Article 52 imposes transparency obligations on providers and deployers of certain AI systems. Providers of AI systems intended to interact directly with natural persons must ensure that those persons are informed they are interacting with an AI system, unless this is obvious from the context. Providers of emotion recognition systems or biometric categorisation systems must inform natural persons exposed to such systems. Providers and deployers of AI systems generating synthetic content (deepfakes) must disclose that the content has been artificially generated or manipulated, using machine-readable formats that are detectable. Providers of general-purpose AI systems generating text published for the purpose of informing the public on matters of public interest must ensure the content is marked in a machine-readable format. These obligations apply in addition to any high-risk requirements under Articles 43-50.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-051',
    rule: 'EU AI Act Article 14 (Regulation 2024/1689)',
    framework: 'AI Act',
    requirement: 'AI Governance and Human Oversight',
    description:
      'EU AI Act Article 14 requires that high-risk AI systems be designed and developed in such a way as to allow effective oversight by natural persons during their use. Human oversight measures must be appropriate to the risks, degree of autonomy and context of use of the AI system. Such measures must enable the persons assigned to oversight to: fully understand the capacities and limitations of the high-risk AI system and duly monitor its operation; remain aware of automation bias; correctly interpret the output of the high-risk AI system; decide, in any situation, to not use or to override, interrupt or stop the operation of the system; and intervene on the operation and stop it via a halt button or similar procedure. Deployers of high-risk AI systems must assign appropriately trained and authorised human overseers, and must ensure those persons receive adequate training and are equipped with the necessary authority to intervene.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-052',
    rule: 'EU AI Act Article 60 (Regulation 2024/1689)',
    framework: 'AI Act',
    requirement: 'AI System Registration in EU Database',
    description:
      'EU AI Act Article 60 establishes the EU database for high-risk AI systems, managed by the Commission. Providers of high-risk AI systems listed in Annex III must register themselves and their systems in this database before the system is placed on the market or put into service, unless they are micro, small or medium-sized enterprises. Providers must ensure the information in the database remains accurate and up-to-date throughout the lifecycle of the system. The registration entry must include the provider identity, a description of the AI system, its intended purpose, the status of the conformity assessment, and a summary of the technical documentation. Public authorities deploying high-risk AI systems from Annex III for their own use must also register their use in the database. Providers must assign a registration number and include it in the declaration of conformity.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-053',
    rule: 'EU AI Act Article 5 (Regulation 2024/1689)',
    framework: 'AI Act',
    requirement: 'Prohibited AI Practices',
    description:
      'EU AI Act Article 5 establishes a list of AI practices that are prohibited in the Union because their risks to fundamental rights are considered unacceptable. Prohibited practices include: AI systems using subliminal, manipulative or deceptive techniques to distort a person\'s behaviour in a way that causes harm; AI systems exploiting vulnerabilities of specific groups; social scoring by public authorities for general purposes; real-time remote biometric identification in publicly accessible spaces for law enforcement, except in specified emergency scenarios; AI systems that infer emotions in workplaces or educational institutions (from 6 August 2026); biometric categorisation based on sensitive characteristics; AI systems creating or expanding facial recognition databases through untargeted scraping; and AI systems used to predict criminality based solely on profiling. Violation of Article 5 is subject to the highest tier of administrative fines.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-054',
    rule: 'EU AI Act Article 53 (Regulation 2024/1689)',
    framework: 'AI Act',
    requirement: 'General-Purpose AI Model Obligations',
    description:
      'EU AI Act Article 53 sets out obligations for providers of general-purpose AI (GPAI) models. All GPAI model providers must: draw up and maintain technical documentation; provide information and documentation to downstream providers that intend to integrate the GPAI model into their AI systems; put in place a policy to comply with copyright law including the EU Copyright Directive; and publish a sufficiently detailed summary of the training data used. Providers of GPAI models with systemic risk (defined as those trained with more than 10^25 floating point operations, or designated by the Commission) must additionally perform model evaluations including adversarial testing, assess and mitigate systemic risks, track and report serious incidents, ensure cybersecurity protections, and report on energy consumption. GPAI model providers that make their model publicly available under a free and open-source licence may be partially exempt from documentation requirements, unless the model presents systemic risk.',
    defaultRisk: 'High',
  },

  // ── NIS2 Directive ────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-055',
    rule: 'NIS2 Directive Article 21 (Directive 2022/2555)',
    framework: 'NIS2',
    requirement: 'Cybersecurity Risk Management Measures',
    description:
      'NIS2 Directive Article 21 requires essential and important entities to take appropriate and proportionate technical, operational and organisational measures to manage the risks posed to the security of network and information systems used for the provision of their services and to prevent or minimise the impact of incidents on recipients of their services and on other services. At a minimum, entities must implement measures covering: (a) risk analysis and information system security policies; (b) incident handling; (c) business continuity, backup management, disaster recovery and crisis management; (d) supply chain security including security-related aspects of relationships with direct suppliers and service providers; (e) security in network and information systems acquisition, development and maintenance including vulnerability handling and disclosure; (f) policies and procedures for assessing the effectiveness of cybersecurity risk management; (g) basic cyber hygiene practices and cybersecurity training; (h) policies and procedures regarding the use of cryptography and encryption; (i) human resources security, access control policies, and asset management; (j) use of multi-factor or continuous authentication. Management bodies must approve these measures and are personally liable for infringements.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-056',
    rule: 'NIS2 Directive Article 23 (Directive 2022/2555)',
    framework: 'NIS2',
    requirement: 'Incident Reporting Obligations — 24-hour and 72-hour',
    description:
      'NIS2 Directive Article 23 establishes a multi-stage incident notification obligation for essential and important entities. Where an entity becomes aware of a significant incident — defined as one that causes or could cause severe operational disruption, financial loss, or affect other natural or legal persons — it must: (1) submit an early warning to the competent authority or CSIRT without undue delay, and within 24 hours of becoming aware, indicating whether the incident is suspected to be caused by unlawful or malicious acts; (2) submit an incident notification without undue delay, and within 72 hours of becoming aware, providing an initial assessment of the incident including its severity and impact; (3) submit an intermediate report on request by the competent authority or CSIRT; (4) submit a final report no later than one month after the incident notification, including a description of the incident, its severity and impact, the type of threat or root cause, applied and ongoing mitigation measures, and any cross-border impact. Significant incidents with potential cross-border impact must also be reported to affected Member States.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-057',
    rule: 'NIS2 Directive Article 21(2)(d) (Directive 2022/2555)',
    framework: 'NIS2',
    requirement: 'Supply Chain Security',
    description:
      'NIS2 Directive Article 21(2)(d) requires essential and important entities to address supply chain security as part of their cybersecurity risk management measures. This includes addressing security-related aspects concerning the relationships between each entity and its direct suppliers or service providers, taking into account the overall quality of products and cybersecurity practices of their suppliers and service providers. The ENISA Coordinated Vulnerability Disclosure guidelines and the NIS2 Implementing Regulation (EU 2024/2690) provide further detail on supply chain risk assessment. Entities must: identify and assess ICT supply chain risks; include security requirements in procurement contracts; assess the security practices of suppliers; conduct periodic reassessments; and where a supplier poses unacceptable risk, implement mitigation or substitution. Article 22 additionally empowers competent authorities to require entities to apply the results of coordinated supply chain security risk assessments for critical ICT products and services conducted by the NIS Cooperation Group.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-058',
    rule: 'NIS2 Directive Article 20 (Directive 2022/2555)',
    framework: 'NIS2',
    requirement: 'Management Body Accountability for Cybersecurity',
    description:
      'NIS2 Directive Article 20 introduces direct management accountability for cybersecurity. The management bodies of essential and important entities must approve the cybersecurity risk management measures taken by that entity under Article 21 and oversee their implementation. Management body members must undertake cybersecurity training that enables them to identify risks and assess cybersecurity risk management practices and their impact on the services provided by the entity; training for all employees is also encouraged. Crucially, management bodies may be held personally liable for infringements of NIS2 obligations by the entity. For essential entities, competent authorities may temporarily prohibit individuals who hold managerial responsibilities from exercising management functions if the entity has committed a serious infringement and fails to take corrective measures within a prescribed period. This represents a significant extension of personal liability for cybersecurity governance beyond traditional regulatory accountability.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-059',
    rule: 'NIS2 Directive Article 21(2)(c) (Directive 2022/2555)',
    framework: 'NIS2',
    requirement: 'Business Continuity and Crisis Management',
    description:
      'NIS2 Directive Article 21(2)(c) requires essential and important entities to implement measures covering business continuity, backup management and disaster recovery, and crisis management as part of their mandatory cybersecurity risk management framework. Business continuity planning must ensure that operations can be maintained or rapidly restored following a significant incident. This includes: identifying critical functions and systems and their recovery time objectives (RTOs); maintaining up-to-date and tested backup procedures that are stored separately from primary systems; maintaining and regularly testing a business continuity plan (BCP); maintaining an incident response and disaster recovery plan; and establishing crisis management procedures including communication protocols, escalation paths, and coordination with national authorities and CSIRTs where relevant. For operators of essential services, entities must ensure that any significant incident does not prevent the continued provision of services, or that such provision can be rapidly restored.',
    defaultRisk: 'High',
  },

  // ── MiFID II (additional) ─────────────────────────────────────────────────
  {
    id: 'REQ-EU-060',
    rule: 'MiFID II Delegated Directive 2017/593 Articles 9-10',
    framework: 'MiFID II',
    requirement: 'Product Governance — Manufacturer Obligations',
    description:
      'MiFID II Delegated Directive 2017/593 Article 9 requires investment firms that manufacture financial instruments to maintain, operate and review a process for the approval of each financial instrument and significant adaptations of existing instruments prior to marketing or distribution to clients. The product approval process must specify an identified target market of end clients within the relevant category of clients and ensure that all relevant risks to such clients are assessed, that the intended distribution strategy is consistent with the identified target market, and that the firm takes reasonable steps to ensure the financial instrument is distributed to the identified target market. Manufacturers must regularly review the financial instrument to assess whether it remains consistent with the needs of the identified target market. Where a manufacturer identifies a trigger event suggesting that the product is not performing as intended or has been distributed outside the target market, they must notify distributors promptly and take appropriate action.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-061',
    rule: 'MiFID II Delegated Directive 2017/593 Article 10',
    framework: 'MiFID II',
    requirement: 'Product Governance — Distributor Obligations',
    description:
      'MiFID II Delegated Directive 2017/593 Article 10 requires investment firms that distribute financial instruments to have in place adequate product governance arrangements to ensure that products and services offered are compatible with the needs, characteristics and objectives of the identified target market, and that the distribution strategy is consistent with the identified target market. Distributors must obtain and review all product approval process information disclosed by the manufacturer. They must understand the characteristics of and the identified target market for each financial instrument, conduct their own target market assessment, and determine their own target market consistent with, or more restrictive than, the manufacturer\'s target market. Distributors must also have information-sharing arrangements with manufacturers and must inform them of sales outside the identified target market. Senior management is responsible for ensuring compliance with product governance obligations.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-062',
    rule: 'MiFIR Article 26 (Regulation 600/2014)',
    framework: 'MiFID II',
    requirement: 'Transaction Reporting',
    description:
      'MiFIR Article 26 requires investment firms that execute transactions in financial instruments to report complete and accurate details of those transactions to the competent authority as quickly as possible and no later than the close of the following working day. Reports must be made via an Approved Reporting Mechanism (ARM) or directly to the competent authority and must include the details specified in Annex I of Commission Delegated Regulation 2017/590, including the identity of the firm, the buy/sell indicator, the quantity and price of the instrument, the trading venue, the financial instrument identifier (ISIN), the date and time of the transaction, the counterparty identifier, and where applicable, the client and trader identifiers using LEIs and national identifiers. Investment firms must have transaction reporting systems that are complete, accurate and submitted within the required timeframe and must reconcile submissions against internal records. They must also retain transaction records for five years.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-063',
    rule: 'MiFID II Article 17 (Directive 2014/65/EU)',
    framework: 'MiFID II',
    requirement: 'Algorithmic Trading Controls',
    description:
      'MiFID II Article 17 requires investment firms engaged in algorithmic trading to have in place effective systems and risk controls to ensure that their trading systems are resilient and have sufficient capacity, are subject to appropriate trading thresholds and limits, and prevent the sending of erroneous orders or the creation of or contributing to a disorderly market. Firms must have in place effective business continuity arrangements to deal with any failure of their trading systems and must ensure their systems are fully tested and monitored. Firms engaged in algorithmic trading must notify the competent authority and the trading venue. They must maintain records of all algorithmic trading strategies, parameters and limits, compliance and risk controls, and must provide these on request. Firms providing direct electronic access (DEA) must have risk controls in place preventing trades that exceed pre-set thresholds, and must obtain prior approval of clients using DEA. Annual self-assessments must be conducted under ESMA guidelines.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-064',
    rule: 'MiFID II Article 24(2) (Directive 2014/65/EU)',
    framework: 'MiFID II',
    requirement: 'Client Categorisation',
    description:
      'MiFID II Article 24(2), read together with Articles 4(1)(10-12) and Annex II, requires investment firms to categorise their clients as retail clients, professional clients, or eligible counterparties prior to providing investment services. Retail clients receive the highest level of protection including suitability or appropriateness assessments, full cost and charges disclosure, and best execution reporting. Professional clients may receive a reduced level of protection where explicitly agreed. Eligible counterparties receive a further reduced level. Firms must have written internal policies and procedures for client categorisation, must notify clients of their category and of the right to request re-categorisation, and must maintain records of categorisation decisions including any client-initiated changes. Clients treated as professionals by default must be re-assessed if the firm becomes aware of changed circumstances. Misclassifying a client or failing to apply the correct protections is a serious regulatory breach.',
    defaultRisk: 'Medium',
  },

  // ── AMLD (additional) ─────────────────────────────────────────────────────
  {
    id: 'REQ-EU-065',
    rule: 'AMLD6 / Directive 2018/1673 Article 33 (via 4AMLD/5AMLD)',
    framework: 'AMLD',
    requirement: 'Suspicious Transaction Reporting',
    description:
      'The AML Directives require obliged entities to report promptly to the Financial Intelligence Unit (FIU) whenever they know, suspect or have reasonable grounds to suspect that funds or activities are the proceeds of criminal activity or are related to terrorist financing. A Suspicious Activity Report (SAR) or Suspicious Transaction Report (STR) must be filed before the transaction is executed where possible; where this is not possible, it must be filed immediately after. Obliged entities must not tip off the customer or any third party that a SAR/STR has been made or that an investigation is being conducted (the "tipping-off" prohibition). SAR/STR submissions must include all relevant information available to the obliged entity. Obliged entities must designate a Money Laundering Reporting Officer (MLRO) responsible for receiving internal disclosures, considering them, and where appropriate, filing reports with the FIU. Records of all SAR/STR filings and internal disclosures must be retained for five years.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-066',
    rule: 'AMLD5 Article 30 / AMLD6 (Directive 2018/843 and 2018/1673)',
    framework: 'AMLD',
    requirement: 'Beneficial Ownership Registers',
    description:
      'AMLD5 (Directive 2018/843) amended AMLD4 to require Member States to establish central registers of beneficial ownership information for corporate and other legal entities, and to ensure that information held in those registers is adequate, accurate and current. AMLD5 extended public access to the beneficial ownership register. For trusts and similar legal arrangements, separate registers are required under Article 31. Obliged entities must verify beneficial ownership information as part of Customer Due Diligence (CDD) by checking the relevant beneficial ownership register as well as other reliable sources. The CJEU ruling in Case C-37/20 (WM) found that unconditional public access to UBO registers is incompatible with the EU Charter of Fundamental Rights; as a result, access in most Member States now requires demonstration of a legitimate interest. Obliged entities must document their verification steps and maintain records of beneficial ownership information collected from customers for the duration of the business relationship plus five years.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-067',
    rule: 'AMLD6 Article 8 / 4AMLD Article 8 (Directive 2015/849 as amended)',
    framework: 'AMLD',
    requirement: 'Risk-Based Approach to Customer Due Diligence',
    description:
      'The AML Directives mandate a risk-based approach (RBA) to customer due diligence (CDD) as the foundational framework for combating money laundering and terrorist financing. Article 8 of the 4th AML Directive (as amended) requires obliged entities to identify and assess the risks of money laundering and terrorist financing to which they are exposed, taking into account risk factors relating to their customers, countries or geographic areas, products, services, transactions or delivery channels. Based on this assessment, entities must apply standard CDD measures (identification and verification of the customer, the beneficial owner, and the purpose of the business relationship), simplified CDD where justified by a lower risk assessment, or enhanced CDD where higher risk is identified. The entity-wide risk assessment must be documented, approved by senior management, and kept up to date. Competent authorities may require entities to apply enhanced measures in relation to specific higher-risk factors. Records of the risk assessment and the CDD measures applied must be retained for five years.',
    defaultRisk: 'High',
  },

  // ── PSD2 ──────────────────────────────────────────────────────────────────
  {
    id: 'REQ-EU-068',
    rule: 'PSD2 Article 97 / Commission Delegated Regulation 2018/389 (RTS on SCA)',
    framework: 'PSD2',
    requirement: 'Strong Customer Authentication',
    description:
      'PSD2 Article 97 requires payment service providers (PSPs) to apply Strong Customer Authentication (SCA) when a payer (i) accesses a payment account online; (ii) initiates an electronic payment transaction; or (iii) carries out any action through a remote channel which may imply a risk of payment fraud or other abuse. SCA must be based on the use of two or more elements categorised as knowledge (something only the user knows), possession (something only the user has), and inherence (something the user is), which are independent — breach of one does not compromise the reliability of the others — and which must generate an authentication code that is linked to the transaction amount and payee. Commission Delegated Regulation (EU) 2018/389 (the RTS on SCA) sets out specific requirements for dynamic linking, security of authentication codes, the possession, knowledge and inherence elements, and a framework of exemptions including low-value transactions (under €30), low-risk transactions based on transaction risk analysis (TRA), corporate payments, trusted beneficiaries, and recurring transactions. PSPs must document their SCA implementation and exemption usage.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-069',
    rule: 'PSD2 Articles 66-67 (Directive 2015/2366)',
    framework: 'PSD2',
    requirement: 'Open Banking — Access to Accounts (XS2A)',
    description:
      'PSD2 Articles 66 and 67 establish the framework for third-party access to payment accounts (commonly known as Open Banking or XS2A). Article 66 gives Payment Initiation Service Providers (PISPs) the right to access payment accounts held at Account Servicing Payment Service Providers (ASPSPs) to initiate payment transactions on behalf of payment service users who have given their explicit consent. Article 67 gives Account Information Service Providers (AISPs) the right to access payment account information held at ASPSPs to provide account aggregation services, subject to explicit user consent. ASPSPs must not block or obstruct the provision of these third-party services and must provide access at least through the dedicated interface required by the RTS on SCA (Delegated Regulation 2018/389 Article 30). ASPSPs must have in place fall-back access mechanisms and must maintain a contingency plan for cases where the dedicated interface is unavailable. PISPs and AISPs must be authorised or registered and must authenticate to ASPSPs using eIDAS certificates.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-070',
    rule: 'PSD2 Articles 73-74 (Directive 2015/2366)',
    framework: 'PSD2',
    requirement: 'Fraud Liability and Refund Obligations',
    description:
      'PSD2 Articles 73 and 74 establish the liability framework for unauthorised and incorrectly executed payment transactions. Under Article 73, the payer\'s PSP must immediately refund the amount of an unauthorised payment transaction to the payer and, where applicable, restore the debited payment account to the state it would have been in had the unauthorised transaction not taken place. Under Article 74, the payer bears no liability for unauthorised payment transactions except where the payer acted fraudulently, or where the payer failed to keep personalised security credentials safe (in which case the payer bears a maximum loss of €50 for transactions using a lost or stolen payment instrument or the credentials not received by the payer — unless the payer acted with gross negligence or fraud). PSPs must be able to demonstrate that the payment transaction was authenticated, accurately recorded, and not affected by a technical breakdown or deficiency. The liability framework interacts closely with SCA requirements: if an unauthorised transaction arises due to a PSP\'s failure to apply SCA, the PSP is fully liable.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-071',
    rule: 'PSD2 Article 95 (Directive 2015/2366)',
    framework: 'PSD2',
    requirement: 'Operational and Security Risk Management',
    description:
      'PSD2 Article 95 requires payment service providers to establish a framework with appropriate mitigation measures and control mechanisms to manage the operational and security risks relating to the payment services they provide. PSPs must provide the competent authority with an updated and comprehensive assessment of the operational and security risks relating to the payment services provided and on the adequacy of the mitigation measures and control mechanisms implemented in response to those risks. EBA Guidelines (EBA/GL/2017/17) on security measures for operational and security risks under PSD2 set out detailed requirements covering: security policies and control frameworks; physical and logical access control; sensitive payment data security; asset and technology risk management; monitoring, logging and reporting; business continuity; payment fraud monitoring and statistics; security testing; and training. PSPs must report major operational or security incidents to the competent authority without undue delay.',
    defaultRisk: 'High',
  },

  // ── Whistleblowing Directive ───────────────────────────────────────────────
  {
    id: 'REQ-EU-072',
    rule: 'EU Whistleblowing Directive Article 8 (Directive 2019/1937)',
    framework: 'Whistleblowing',
    requirement: 'Internal Reporting Channels',
    description:
      'EU Whistleblowing Directive (Directive 2019/1937) Article 8 requires legal entities in the private sector with 50 or more workers, and all legal entities in the public sector regardless of size, to establish internal channels and procedures for reporting and follow-up of reports. Internal reporting channels must be designed, established and operated in a manner that ensures the completeness, integrity and confidentiality of the information and prevents unauthorised personnel from accessing the information. The channels must enable reporting in writing and/or orally; oral reports must be documented either through a recording or transcription. Entities must acknowledge receipt of the report within seven days, must designate an impartial person or department to follow up on reports, must maintain diligent follow-up, and must provide feedback to the reporting person within three months of acknowledgement. Entities must provide clear and easily accessible information about internal reporting channels, the procedure for external reporting to competent authorities, and the availability of EU institutions and bodies for reporting. Records of reports received must be maintained and stored securely.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-073',
    rule: 'EU Whistleblowing Directive Articles 19-21 (Directive 2019/1937)',
    framework: 'Whistleblowing',
    requirement: 'Whistleblower Protection Measures',
    description:
      'EU Whistleblowing Directive (Directive 2019/1937) Articles 19-21 require Member States to prohibit any form of retaliation against reporting persons who had reasonable grounds to believe that the information reported was true at the time of reporting. Prohibited retaliation includes dismissal, demotion, suspension, disciplinary measures, denial of promotion, harassment, blacklisting, termination of contracts for goods or services, damage to reputation or social standing, and psychiatric or medical referrals. Article 21 provides that reporting persons who suffer retaliation are entitled to effective assistance from competent authorities, have access to remedies including interim relief, legal aid, and financial assistance during legal proceedings, and that the onus of proof in civil proceedings is reversed — the employer bears the burden of proving the action was not taken in retaliation. Article 22 imposes dissuasive penalties on persons who take retaliatory measures, obstruct reporting, or make malicious reports. Organisations must have documented anti-retaliation policies and must train relevant staff on protections and the reporting process.',
    defaultRisk: 'High',
  },

  // ── SFDR (additional) ─────────────────────────────────────────────────────
  {
    id: 'REQ-EU-074',
    rule: 'SFDR Articles 3-5 (Regulation 2019/2088)',
    framework: 'SFDR',
    requirement: 'Entity-Level Sustainability Disclosures',
    description:
      'SFDR Articles 3-5 require financial market participants (FMPs) and financial advisers to make three mandatory entity-level disclosures on their websites. Under Article 3, FMPs and advisers must publish their policies on the integration of sustainability risks into their investment decision-making or advice processes. Under Article 4, FMPs with more than 500 employees must publish a statement on their principal adverse impact (PAI) due diligence policies, including the indicators specified in the Level 2 Regulatory Technical Standards (RTS), or provide a clear and reasoned explanation of why they do not consider PAIs. Under Article 5, FMPs and advisers must publish information about how their remuneration policies are consistent with the integration of sustainability risks. These website disclosures must be kept accurate and up-to-date. The Level 2 RTS (Commission Delegated Regulation 2022/1288) specifies the exact content, methodology, and format of PAI statements, and requires publication of the PAI statement by 30 June each year covering the preceding calendar year.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-EU-075',
    rule: 'SFDR Articles 8-9 (Regulation 2019/2088)',
    framework: 'SFDR',
    requirement: 'Product-Level Sustainability Disclosures',
    description:
      'SFDR Articles 8 and 9 impose product-level pre-contractual and periodic disclosure requirements based on the sustainability profile of the financial product. Article 8 applies to financial products that promote environmental or social characteristics ("light green" products): pre-contractual documents must explain how those characteristics are met and where a financial index is designated as a reference benchmark, how that index is aligned with those characteristics. Article 9 applies to products that have sustainable investment as their objective ("dark green" products): pre-contractual documents must include an explanation of how the objective is achieved and must include a benchmark comparison. The Level 2 RTS (Commission Delegated Regulation 2022/1288) specifies detailed templates for pre-contractual documents (annexes to the key information document or prospectus) and annual periodic reports (including attainment of characteristics or objectives during the period). Product classifications and disclosures must be consistent across SFDR, the Taxonomy Regulation (Regulation 2020/852), and MiFID II/IDD sustainability preferences rules. Greenwashing or inconsistent classification is subject to supervisory scrutiny.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-076',
    rule: 'SFDR Article 4 (Regulation 2019/2088)',
    framework: 'SFDR',
    requirement: 'Principal Adverse Impact Statements',
    description:
      'SFDR Article 4, read together with the Level 2 RTS in Commission Delegated Regulation 2022/1288, requires financial market participants with more than 500 employees to publish an annual statement on their due diligence policies with respect to the principal adverse impacts (PAIs) of their investment decisions on sustainability factors. The PAI statement must be published on the FMP\'s website by 30 June each year and must cover the reference period of the preceding calendar year. The statement must include: a summary; a description of the principal adverse impacts considered, covering the mandatory indicators in Tables 1, 2 and 3 of Annex I to the Delegated Regulation (including metrics related to greenhouse gas emissions, biodiversity, water, waste, and social and employee matters); a description of policies for identifying and prioritising those impacts; engagement policies; reference to responsible business conduct adherence; and a historical comparison of the metrics. For smaller FMPs not subject to the mandatory requirement, the SFDR "comply or explain" mechanism applies, requiring either adoption of the PAI statement or publication of a clear explanation of why PAIs are not considered.',
    defaultRisk: 'Medium',
  },

  // ── MAR (additional) ──────────────────────────────────────────────────────
  {
    id: 'REQ-EU-077',
    rule: 'MAR Article 18 (Regulation 596/2014)',
    framework: 'MAR',
    requirement: 'Insider List Maintenance',
    description:
      'MAR Article 18 requires issuers, any person acting on their behalf or on their account, to draw up and maintain a list of all persons who have access to inside information and who are working for them under a contract of employment or otherwise performing tasks through which they have access to inside information — the "insider list". The insider list must be created without delay upon the creation of inside information and must be updated promptly when there is a change in the reason for inclusion of a person already on the list or when a new person has access to inside information. The insider list must include: the identity of each person with access to inside information, the reason for inclusion, the date and time at which that person obtained access to inside information, and the date on which the insider list was drawn up and updated. The insider list must be transmitted to the competent authority without delay upon request. The issuer must retain the insider list for five years after it is drawn up or updated and must take reasonable steps to ensure that all persons on the insider list acknowledge in writing the legal and regulatory duties entailed and are aware of the sanctions applicable.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-078',
    rule: 'MAR Article 19 (Regulation 596/2014)',
    framework: 'MAR',
    requirement: "Managers' Transactions Notification",
    description:
      "MAR Article 19 requires persons discharging managerial responsibilities (PDMRs) within an issuer, and persons closely associated with them, to notify both the issuer and the competent authority of every transaction conducted on their own account relating to the issuer\'s shares, debt instruments, derivatives or other linked financial instruments within three working days of the transaction date. The issuer must ensure that such notifications are made public within three working days, through the same mechanism used for disclosure of inside information under Article 17. The notification obligation applies where the total amount of transactions has reached €5,000 within a calendar year; Member States may raise this threshold to €20,000. Issuers must inform PDMRs in writing of their obligations under MAR and must establish a list of all PDMRs and their closely associated persons. Issuers must also establish a securities trading policy and, to assist PDMRs, may operate a closed period (of at least 30 calendar days before the announcement of an interim financial report or a year-end report) during which PDMRs may not conduct transactions in the issuer\'s instruments.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-079',
    rule: 'MAR Article 16 (Regulation 596/2014)',
    framework: 'MAR',
    requirement: 'Suspicious Transaction and Order Reporting (STOR)',
    description:
      'MAR Article 16 requires market operators and investment firms operating a trading venue to establish and maintain effective arrangements, systems and procedures to detect and report suspicious orders and transactions. Investment firms and credit institutions that execute transactions must report, without delay, to the competent authority any transaction or order they reasonably suspect may constitute insider dealing, market manipulation, or an attempt at either. Reports must be submitted as Suspicious Transaction and Order Reports (STORs) using the form specified by the competent authority. STORs must include all relevant information available to the reporting entity at the time of submission; the reporting person is not responsible for the outcome of any investigation. Reporting persons must not inform the client whose order or transaction is being reported ("tip-off" prohibition). Firms must have written policies and procedures for identifying and escalating suspicious orders and transactions, must train relevant staff, must designate a compliance officer responsible for STOR submissions, and must maintain records of all assessments made and STORs filed.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-EU-080',
    rule: 'MAR Article 11 (Regulation 596/2014)',
    framework: 'MAR',
    requirement: 'Market Soundings Procedures',
    description:
      'MAR Article 11 establishes a safe harbour framework for market soundings — communications made by issuers or offerors, or by entities acting on their behalf, to one or more potential investors, prior to the announcement of a transaction, in order to gauge the interest of potential investors. Disclosing market participants (DMPs) must assess before conducting a market sounding whether the sounding will involve disclosure of inside information. If inside information will be disclosed, the DMP must obtain the consent of the person receiving the sounding to receive inside information, inform them that they are prohibited from using the information to acquire or dispose of relevant instruments, and inform them that they are obliged to keep the information confidential. The DMP must maintain records of the sounding including a script of what was said, the identities of the persons to whom the sounding was disclosed, and the assessment of inside information. Upon public announcement of the transaction, the DMP must contact all persons who received the sounding to advise them that the information is no longer inside information. All records must be retained for five years and submitted to the competent authority on request.',
    defaultRisk: 'Medium',
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
