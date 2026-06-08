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
  // ── FCA Conduct (Consumer Duty Outcomes) ──────────────────────────────────
  {
    id: 'REQ-UK-020',
    rule: 'FCA PRIN 2A.2 / PS22/9',
    framework: 'FCA Conduct',
    requirement: 'Consumer Duty — Products and Services Outcome',
    description:
      'Under PRIN 2A.2, firms must design and distribute products and services that meet the needs of their target market and are appropriate for the consumers to whom they are directed or sold. Firms must conduct product reviews to confirm that products and services remain fit for purpose throughout their lifecycle, considering whether the target market has been correctly identified and whether the product is causing foreseeable harm. Where harm is identified, firms must take prompt remedial action including, where necessary, withdrawing the product from sale.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-021',
    rule: 'FCA PRIN 2A.3 / PS22/9',
    framework: 'FCA Conduct',
    requirement: 'Consumer Duty — Price and Value Outcome',
    description:
      'Under PRIN 2A.3, firms must ensure that the price consumers pay for a product or service represents fair value, meaning there is a reasonable relationship between the total price paid and the overall benefit received. Firms must carry out and document value assessments for their products and services, taking into account the nature and quality of the product, the benefits provided, and any restrictions on use. Firms must not exploit behavioural biases, information asymmetries, or other consumer vulnerabilities to extract excessive margins.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-022',
    rule: 'FCA PRIN 2A.4 / PS22/9',
    framework: 'FCA Conduct',
    requirement: 'Consumer Duty — Consumer Understanding Outcome',
    description:
      'Under PRIN 2A.4, firms must ensure that communications and information provided to consumers support and enable them to make informed decisions about financial products and services. Communications must be appropriately targeted, in plain language, timely, and presented in a way that supports understanding rather than exploiting cognitive biases or creating misleading impressions. Firms must test the effectiveness of their customer communications and take remedial action where consumers are found to be misunderstanding material information.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-023',
    rule: 'FCA PRIN 2A.5 / PS22/9',
    framework: 'FCA Conduct',
    requirement: 'Consumer Duty — Consumer Support Outcome',
    description:
      'Under PRIN 2A.5, firms must provide support to consumers that meets their needs throughout the product or service lifecycle, including during the post-sale phase. Support must be accessible and effective, enabling consumers to realise the benefits of the product and to raise and resolve problems without unnecessary friction. Firms must ensure that consumers are not impeded from switching, cancelling, or making a claim by excessive administrative barriers, and must monitor and assess the quality of their support provision.',
    defaultRisk: 'High',
  },
  // ── FCA Systems (additional) ───────────────────────────────────────────────
  {
    id: 'REQ-UK-024',
    rule: 'FCA SYSC 4.1.6R / 4.1.7R',
    framework: 'FCA Systems',
    requirement: 'Business Continuity Planning',
    description:
      'SYSC 4.1.6R requires firms to establish, implement and maintain an adequate business continuity policy aimed at ensuring, in the case of an interruption to their systems and procedures, the preservation of essential data and functions and the maintenance of investment services and activities. Under SYSC 4.1.7R, the policy must cover the periodic testing of contingency facilities and must include a documented programme for recovery. Plans must be reviewed at least annually and following any material changes to the business or its infrastructure.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-025',
    rule: 'FCA SYSC 6.2',
    framework: 'FCA Systems',
    requirement: 'Internal Audit Function',
    description:
      'SYSC 6.2.1R requires common platform firms to establish and maintain an internal audit function that is separate from and independent of the other functions and activities of the firm. The internal audit function must establish, implement and maintain an audit plan to examine and evaluate the adequacy and effectiveness of the systems, internal control mechanisms and arrangements of the firm. Findings must be reported to and acted upon by senior management, and the internal auditor must have access to all relevant records, personnel and premises.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-UK-026',
    rule: 'FCA SYSC 8',
    framework: 'FCA Systems',
    requirement: 'Outsourcing and Third-Party Risk',
    description:
      'SYSC 8 requires firms that outsource any operational functions critical or important to the performance of regulated activities to take necessary steps to ensure that the third party carries out the outsourced functions effectively and in compliance with applicable law and regulatory requirements. Firms must retain full responsibility for compliance with their regulatory obligations and must exercise due skill and care in the selection, appointment and ongoing oversight of outsourced service providers. A written outsourcing agreement must be in place covering governance, audit rights, data protection, sub-contracting, and termination arrangements.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-027',
    rule: 'FCA SYSC 9',
    framework: 'FCA Systems',
    requirement: 'Record Keeping',
    description:
      "SYSC 9.1R requires firms to arrange for orderly records to be kept of their business and internal organisation, including all services and transactions undertaken by the firm, which must be sufficient to enable the FCA to monitor the firm's compliance with its requirements and to reconstruct all transactions. Records must be retained for at least five years in the case of MiFID business (or longer where required by other applicable rules), must be stored securely, be accessible to the FCA upon request, and be tamper-proof to the extent possible.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-UK-028',
    rule: 'FCA SYSC 19A / FCA SYSC 19D',
    framework: 'FCA Systems',
    requirement: 'Remuneration Policies',
    description:
      'SYSC 19A (for full-scope BIPRU firms and equivalent) and SYSC 19D (for IFPRU firms and dual-regulated investment firms) require firms to have remuneration policies and practices that are consistent with and promote sound and effective risk management. Variable remuneration arrangements must include performance criteria that incorporate non-financial measures including adherence to the firm\'s values and compliance with conduct requirements. A significant portion of variable remuneration for material risk-takers must be deferred, subject to clawback, and paid in instruments that align incentives with long-term performance.',
    defaultRisk: 'Medium',
  },
  // ── SM&CR (additional) ────────────────────────────────────────────────────
  {
    id: 'REQ-UK-029',
    rule: 'FCA COCON 2.1–2.5',
    framework: 'SM&CR',
    requirement: 'Individual Conduct Rules',
    description:
      'COCON 2.1 sets out five individual conduct rules applicable to all conduct rules staff: (1) act with integrity; (2) act with due skill, care and diligence; (3) be open and cooperative with the FCA, the PRA and other regulators; (4) pay due regard to the interests of customers and treat them fairly; and (5) observe proper standards of market conduct. Firms must provide training on the conduct rules to all relevant individuals within twelve weeks of SMCR applying to them, and must have documented processes for investigating, recording, and reporting conduct rules breaches to the FCA.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-030',
    rule: 'FCA COCON 2.2',
    framework: 'SM&CR',
    requirement: 'Senior Manager Conduct Rules',
    description:
      'COCON 2.2 sets out additional conduct rules applicable to senior managers: (SC1) take reasonable steps to ensure that the business of the firm for which the senior manager is responsible is controlled effectively; (SC2) take reasonable steps to ensure that the business of the firm complies with the relevant requirements and standards of the regulatory system; (SC3) take reasonable steps to ensure any delegation of their responsibilities is to an appropriate person and that they oversee the discharge of the delegated responsibility; and (SC4) disclose any information of which the FCA would reasonably expect notice.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-031',
    rule: 'FCA SYSC 22',
    framework: 'SM&CR',
    requirement: 'Regulatory References',
    description:
      "SYSC 22 requires firms, when recruiting for senior management, certification or certain other roles, to obtain a regulatory reference from all previous employers (in financial services) for the preceding six years. When providing a regulatory reference, firms must include all relevant information they are permitted to disclose, including details of any conduct rules breaches, fitness and propriety findings, and disciplinary action taken. Firms must have documented policies for requesting, providing, and retaining regulatory references, and must update references if new relevant information comes to light within the same six-year period.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-UK-032',
    rule: 'FCA FIT 1.3 / FIT 2',
    framework: 'SM&CR',
    requirement: 'Fitness and Propriety Assessments',
    description:
      'Under the FCA Fit and Proper test (FIT), firms must assess and satisfy themselves on an ongoing basis that each senior manager and certified person is fit and proper, considering three criteria: honesty, integrity and reputation; competence and capability; and financial soundness. Assessments must be documented, must draw on relevant background checks (including criminal record, credit history, and regulatory references), and must be repeated whenever material new information comes to the attention of the firm. A person found no longer fit and proper must be removed from their function.',
    defaultRisk: 'High',
  },
  // ── UK AML (additional) ───────────────────────────────────────────────────
  {
    id: 'REQ-UK-033',
    rule: 'Proceeds of Crime Act 2002 ss330–332 / MLR 2017 Reg 21',
    framework: 'UK AML',
    requirement: 'Suspicious Activity Reporting and MLRO',
    description:
      'Under POCA 2002 sections 330–332 and MLR 2017 Regulation 21, relevant persons must appoint a nominated officer (the Money Laundering Reporting Officer, MLRO) to receive internal disclosures of suspected money laundering or terrorist financing and to decide whether to submit a Suspicious Activity Report (SAR) to the National Crime Agency. Failure by an employee to make an internal report, or failure by the MLRO to make an external SAR where required, constitutes a criminal offence. Firms must have documented tipping-off controls, an internal SAR process, and a system for retaining SAR records.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-034',
    rule: 'Sanctions and Anti-Money Laundering Act 2018 / OFSI General Guidance',
    framework: 'UK AML',
    requirement: 'Sanctions Screening — OFSI',
    description:
      "Under the Sanctions and Anti-Money Laundering Act 2018, it is a criminal offence to make funds or economic resources available, directly or indirectly, to a designated person, or to deal in the property of a designated person. The Office of Financial Sanctions Implementation (OFSI) administers UK financial sanctions. Firms must screen customers, beneficial owners, counterparties, and transactions against the UK Consolidated Sanctions List in real time, maintain a documented sanctions screening policy, and report any matches or breaches to OFSI promptly. Firms must not rely solely on sanctions lists from other jurisdictions as a substitute for UK screening.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-035',
    rule: 'MLR 2017 Regulation 20',
    framework: 'UK AML',
    requirement: 'Transaction Monitoring',
    description:
      'MLR 2017 Regulation 20 requires relevant persons to apply ongoing monitoring of the business relationship with each customer, including scrutiny of transactions undertaken throughout the relationship to ensure that the transactions are consistent with the relevant person\'s knowledge of the customer, the customer\'s business and risk profile, and, where necessary, the source of funds. Firms must have a documented transaction monitoring framework, whether manual or automated, that is calibrated to the firm\'s risk profile and subject to regular review. Unexplained transactions must be considered for SAR submission.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-036',
    rule: 'MLR 2017 Regulation 18',
    framework: 'UK AML',
    requirement: 'AML Risk Assessment — Firm-Wide',
    description:
      'MLR 2017 Regulation 18 requires relevant persons to take appropriate steps to identify and assess the risks of money laundering and terrorist financing to which its business is subject, taking into account risk factors including customers, countries or geographic areas, products, services, transactions, and delivery channels. The business-wide risk assessment must be documented, kept up to date, and made available to the relevant supervisory authority on request. The assessment must inform the design of the AML policies and controls and must be reviewed whenever there is a material change to the business.',
    defaultRisk: 'High',
  },
  // ── UK GDPR (additional) ──────────────────────────────────────────────────
  {
    id: 'REQ-UK-037',
    rule: 'UK GDPR Article 15 / DPA 2018 s45',
    framework: 'UK GDPR',
    requirement: 'Data Subject Access Requests',
    description:
      'Under UK GDPR Article 15, data subjects have the right to obtain from the controller confirmation as to whether or not personal data concerning them is being processed, and where that is the case, access to the personal data and supplementary information including the purposes of processing, categories of data, recipients, and retention periods. Controllers must respond to a valid Data Subject Access Request (DSAR) within one calendar month of receipt (extendable to three months for complex or numerous requests). Controllers must have documented procedures for receiving, validating, and fulfilling DSARs and must not charge a fee except in limited circumstances.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-UK-038',
    rule: 'UK GDPR Articles 33–34 / DPA 2018 s67',
    framework: 'UK GDPR',
    requirement: 'Data Breach Notification — 72 Hour Rule',
    description:
      'Under UK GDPR Article 33, in the case of a personal data breach, the controller must notify the ICO without undue delay and, where feasible, not later than 72 hours after having become aware of it, unless the personal data breach is unlikely to result in a risk to the rights and freedoms of natural persons. Where notification is not made within 72 hours, the notification must be accompanied by reasons for the delay. Where a breach is likely to result in a high risk to individuals, the controller must also notify those individuals without undue delay under Article 34. Firms must have a documented breach response plan, defined escalation paths, and a breach register.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-039',
    rule: 'UK GDPR Article 35',
    framework: 'UK GDPR',
    requirement: 'Data Protection Impact Assessment',
    description:
      "UK GDPR Article 35 requires controllers to carry out a Data Protection Impact Assessment (DPIA) before undertaking processing that is likely to result in a high risk to the rights and freedoms of natural persons, particularly when using new technologies. DPIAs are mandatory for large-scale processing of special category data, systematic and extensive profiling that produces significant effects, and large-scale systematic monitoring of public areas. The DPIA must describe the processing, assess necessity and proportionality, assess risks, and set out measures to address those risks. Where a DPIA indicates a high residual risk, the controller must consult the ICO prior to processing.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-040',
    rule: 'UK GDPR Articles 44–49 / DPA 2018 Part V',
    framework: 'UK GDPR',
    requirement: 'International Data Transfers',
    description:
      'UK GDPR Chapter V restricts the transfer of personal data to third countries or international organisations except where an adequate level of protection is ensured. Following Brexit, transfers rely on UK adequacy regulations, UK International Data Transfer Agreements (IDTAs), UK Addendum to EU SCCs, Binding Corporate Rules, or derogations under Article 49. Firms must document the legal basis for each category of international transfer, ensure that recipients are bound by equivalent obligations, and must not transfer data to a non-adequate country on the basis of EU SCCs alone without the UK Addendum.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-041',
    rule: 'UK GDPR Article 7',
    framework: 'UK GDPR',
    requirement: 'Consent Management',
    description:
      'Where processing is based on consent under UK GDPR Article 7, the controller must be able to demonstrate that the data subject has given consent to the processing of their personal data. Consent must be freely given, specific, informed, and unambiguous, and must be given by a clear affirmative action. Pre-ticked boxes, bundled consents, and consents that are not distinguished from other matters are not valid. Consent must be as easy to withdraw as to give, and controllers must provide an effective withdrawal mechanism and must cease processing upon withdrawal. Records of consent must be maintained.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-UK-042',
    rule: 'UK GDPR Article 17 / UK GDPR Article 5(1)(e)',
    framework: 'UK GDPR',
    requirement: 'Data Retention and Erasure',
    description:
      "UK GDPR Article 5(1)(e) requires that personal data be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed. Article 17 gives data subjects the right to erasure ('right to be forgotten') where the data is no longer necessary, consent is withdrawn (and no other basis applies), the data has been unlawfully processed, or erasure is required by law. Firms must publish a data retention schedule covering all categories of personal data processed, defining retention periods and the trigger for deletion, and must have a documented process for responding to erasure requests within one month.",
    defaultRisk: 'Medium',
  },
  // ── Bribery Act ───────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-043',
    rule: 'Bribery Act 2010 s7',
    framework: 'Bribery Act',
    requirement: 'Adequate Procedures to Prevent Bribery',
    description:
      "Section 7 of the Bribery Act 2010 creates a strict liability corporate offence of failing to prevent bribery by an associated person. The sole defence is that the organisation had in place 'adequate procedures' designed to prevent persons associated with it from undertaking bribery. The Ministry of Justice Guidance sets out six principles for adequate procedures: proportionate procedures; top-level commitment; risk assessment; due diligence; communication (including training); and monitoring and review. Firms must implement and maintain a documented anti-bribery and corruption (ABC) programme that addresses all six principles.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-044',
    rule: 'MoJ Bribery Act Guidance Principle 3',
    framework: 'Bribery Act',
    requirement: 'Anti-Bribery Risk Assessment',
    description:
      "Ministry of Justice Guidance Principle 3 requires organisations to assess the nature and extent of their exposure to potential external and internal risks of bribery by persons associated with them. The risk assessment should be periodic, informed, documented, and practical, considering country risk, sector risk, transaction risk, business partnership risk, and opportunity risk. The findings must be used to calibrate the firm's ABC controls, policies, and training. The risk assessment must be reviewed whenever the business enters new markets, launches new products, or onboards new categories of business partner.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-045',
    rule: 'MoJ Bribery Act Guidance Principle 4',
    framework: 'Bribery Act',
    requirement: 'Due Diligence on Associated Persons',
    description:
      "Ministry of Justice Guidance Principle 4 requires organisations to apply due diligence procedures that are risk-proportionate in respect of persons who perform, or will perform, services for or on behalf of the organisation. Associated persons include agents, intermediaries, joint-venture partners, and subsidiaries. Due diligence must assess the bribery and corruption risk posed by the associated person and must be documented. For higher-risk relationships, enhanced due diligence including direct anti-bribery representations, training, contractual rights of audit, and periodic re-screening is required. The firm's contractual arrangements with associated persons must include appropriate anti-bribery warranties and termination rights.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-046',
    rule: 'Bribery Act 2010 s1–2 / MoJ Guidance Principle 1',
    framework: 'Bribery Act',
    requirement: 'Gifts, Hospitality and Facilitation Payments Policy',
    description:
      "Sections 1 and 2 of the Bribery Act 2010 create offences of offering, promising or giving a financial advantage (active bribery) and requesting, agreeing to receive, or accepting a financial advantage (passive bribery). Facilitation payments — payments made to foreign public officials to secure or expedite routine government actions — are illegal under the Bribery Act and there is no exception for them (unlike the US FCPA). Firms must maintain a written gifts and hospitality policy that sets clear thresholds, requires prior approval for gifts above those thresholds, maintains a register of all gifts given and received, and explicitly prohibits facilitation payments regardless of local custom.",
    defaultRisk: 'Medium',
  },
  // ── Financial Crime ───────────────────────────────────────────────────────
  {
    id: 'REQ-UK-047',
    rule: 'FCA SYSC 6.1.1R',
    framework: 'Financial Crime',
    requirement: 'Fraud Prevention and Detection',
    description:
      "SYSC 6.1.1R requires firms to establish, implement and maintain adequate policies and procedures sufficient to ensure compliance with applicable law, including the prevention of financial crime. In the context of fraud, firms must have a documented fraud risk assessment, a fraud prevention and detection framework, and an incident response capability. Under the Economic Crime and Corporate Transparency Act 2023, a new corporate offence of failing to prevent fraud is expected to apply to large organisations, requiring firms to have fraud prevention procedures that can be relied on as a statutory defence. Firms must also comply with the FCA's PS19/26 requirements on APP fraud reimbursement where applicable.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-048',
    rule: 'UK MAR (EU MAR 596/2014 as retained UK law)',
    framework: 'Financial Crime',
    requirement: 'Market Abuse Prevention — UK MAR',
    description:
      "The UK Market Abuse Regulation (EU MAR 596/2014 as retained in UK law) prohibits insider dealing, market manipulation, and unlawful disclosure of inside information. Firms must implement a market abuse prevention framework including a market abuse surveillance function, documented escalation procedures, and a process for submitting Suspicious Transaction and Order Reports (STORs) to the FCA. Firms must maintain insider lists, implement information barriers where necessary, and provide regular training on market abuse risks. The framework must cover both voice and electronic communications for monitored staff.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-049',
    rule: 'Criminal Justice Act 1993 Part V',
    framework: 'Financial Crime',
    requirement: 'Insider Dealing Prevention',
    description:
      "Part V of the Criminal Justice Act 1993 makes it a criminal offence for an individual who has inside information (as an insider) to deal in price-affected securities, encourage another person to deal, or disclose inside information to another person other than in the proper performance of the functions of employment, office or profession. Firms must supplement their UK MAR obligations with a documented personal account dealing policy, pre-clearance requirements for trades by employees and connected persons in the firm's securities and in securities of clients where the employee has access to inside information, and a process for investigating suspected insider dealing breaches.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-050',
    rule: 'FCA SYSC 18',
    framework: 'Financial Crime',
    requirement: 'Whistleblowing Arrangements',
    description:
      "FCA SYSC 18 requires certain FCA-regulated firms (broadly, those with 50 or more employees) to have in place effective internal whistleblowing arrangements. Firms must appoint a senior manager as a 'whistleblowers' champion', establish and publicise internal whistleblowing channels, and ensure that individuals who raise concerns in good faith are protected against retaliation. Firms must inform UK-based employees about the FCA and PRA whistleblowing services and must report to the board annually on whistleblowing activity and the effectiveness of the arrangements. Firms must conduct a root-cause analysis of all whistleblowing concerns.",
    defaultRisk: 'Medium',
  },
  // ── FCA OpRes (additional) ────────────────────────────────────────────────
  {
    id: 'REQ-UK-051',
    rule: 'FCA PS21/3 / SS1/21',
    framework: 'FCA OpRes',
    requirement: 'Third-Party Dependency Mapping',
    description:
      "PS21/3 and SS1/21 require firms to map the people, processes, technology, facilities, and information that support each of their important business services, including dependencies on third-party service providers. The mapping must be sufficiently granular to enable the firm to understand the interconnections and interdependencies within and across its important business services, including concentration risk where multiple important business services rely on the same third-party provider. Firms must document single points of failure identified through the mapping exercise and must incorporate the findings into their resilience investment and vendor management programmes.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-052',
    rule: 'FCA SS1/21',
    framework: 'FCA OpRes',
    requirement: 'Scenario Testing for Operational Resilience',
    description:
      'SS1/21 requires firms to design and conduct scenario-based testing of their ability to remain within impact tolerances for each important business service when severe but plausible disruptive scenarios occur. Testing must be sufficiently severe and encompass scenarios including cyber attacks, technology failures, third-party outages, and people-related risks. Test results, including identified vulnerabilities and remediation actions, must be documented in the firm\'s self-assessment. By 31 March 2025, firms must have demonstrated their ability to remain within their impact tolerances, and testing must continue to be performed on a regular basis thereafter.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-053',
    rule: 'FCA PS21/3 / FCA PRIN 11',
    framework: 'FCA OpRes',
    requirement: 'Communication Strategy During Disruption',
    description:
      "Firms must have a documented communication strategy for use during operational disruptions affecting important business services, covering both internal communications (staff, board, and senior management) and external communications (customers, the FCA, payment systems operators, and other third parties). Under FCA PRIN 11, firms must be open with regulators about material disruptions, including notifying the FCA promptly when an impact tolerance is breached or when a disruption is likely to cause significant customer harm. Communication plans must be tested as part of the firm's operational resilience scenario testing programme.",
    defaultRisk: 'Medium',
  },
  // ── FCA Conduct (additional) ──────────────────────────────────────────────
  {
    id: 'REQ-UK-054',
    rule: 'FCA DISP 1.3–1.10',
    framework: 'FCA Conduct',
    requirement: 'Complaints Handling — DISP',
    description:
      "FCA Dispute Resolution (DISP) 1.3–1.10 requires firms to have in place an effective and transparent procedure for the reasonable and prompt handling of complaints. Firms must handle complaints from eligible complainants (broadly, retail and small business customers) and must respond to a complaint within 8 weeks with either a final response or an explanation of the delay. Where a complaint is not resolved within 8 weeks, or the complainant is dissatisfied with the final response, the complainant must be informed of their right to refer the complaint to the Financial Ombudsman Service (FOS). Firms must maintain records of all complaints received and report complaint data to the FCA semi-annually.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-UK-055',
    rule: 'FCA FG21/1',
    framework: 'FCA Conduct',
    requirement: 'Vulnerable Customers Policy',
    description:
      "FCA Guidance FG21/1 sets out the FCA's expectations for how firms should treat customers in vulnerable circumstances. Firms must understand the nature and scale of vulnerability in their customer base and take this into account in product and service design, marketing, sales processes, and customer service delivery. Staff must be trained to recognise and respond appropriately to customer vulnerability, and firms must monitor and evaluate their treatment of vulnerable customers. Under the Consumer Duty, failure to deliver good outcomes for vulnerable customers is a specific area of regulatory focus, and firms must be able to evidence through data and testing that their approaches are achieving the desired outcomes.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-056',
    rule: 'FCA PRIN 6',
    framework: 'FCA Conduct',
    requirement: 'Treating Customers Fairly Outcomes',
    description:
      "FCA Principle 6 requires firms to pay due regard to the interests of their customers and to treat them fairly. The FCA has identified six consumer outcomes that firms must deliver: consumers can be confident they are dealing with firms where the fair treatment of customers is central to the corporate culture; products and services marketed and sold in the retail market are designed to meet the needs of identified consumer groups; consumers are provided with clear information and kept appropriately informed; where consumers receive advice, it is suitable; consumers are provided with products that perform as firms have led them to expect; and consumers do not face unreasonable post-sale barriers. Evidence of TCF delivery must be maintained at board and management level.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-057',
    rule: 'FCA CASS',
    framework: 'FCA Conduct',
    requirement: 'Client Money and Assets',
    description:
      "The FCA Client Assets Sourcebook (CASS) requires firms that hold client money or safe custody assets to comply with detailed rules designed to ensure that client assets are protected in the event of the firm's insolvency. Firms must segregate client money from the firm's own money, hold it in appropriately designated client bank accounts, and perform daily client money calculations and reconciliations. Firms must also segregate client custody assets and perform regular internal and external reconciliations. CASS-medium and CASS-large firms must appoint a CASS Oversight Officer under SYSC 6.1.4DR and must submit a CASS Resolution Pack to the FCA annually.",
    defaultRisk: 'High',
  },
  // ── Pensions ──────────────────────────────────────────────────────────────
  {
    id: 'REQ-UK-058',
    rule: 'Pensions Act 2008 / Workplace Pensions Regulations 2010',
    framework: 'Pensions',
    requirement: 'Auto-Enrolment Compliance',
    description:
      "The Pensions Act 2008 requires all UK employers to automatically enrol eligible workers (those aged 22 to State Pension age, earning above the earnings trigger, and working in the UK) into a qualifying workplace pension scheme and to make employer contributions of at least 3% of qualifying earnings. Employers must register with The Pensions Regulator (TPR), re-enrol eligible workers approximately every three years, and provide workers with prescribed information about their auto-enrolment status. Employers who fail to comply with their auto-enrolment duties are subject to fixed penalty notices and escalating daily penalties issued by TPR.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-UK-059',
    rule: 'TPR Code of Practice No 13 / Pension Schemes Act 2021',
    framework: 'Pensions',
    requirement: 'Fiduciary Duty and Governance',
    description:
      "The Pensions Regulator's Code of Practice and the Pension Schemes Act 2021 require trustees and employers maintaining occupational pension schemes to act in the best interests of scheme members, exercise appropriate skill and diligence, and maintain effective governance arrangements. Trustees must produce and maintain a Statement of Investment Principles (SIP), an Implementation Statement, and (for defined contribution schemes with 100 or more members) a Chair's Statement confirming compliance with the DC governance standards. Under the Pension Schemes Act 2021, trustees of large schemes must report on climate-related risks in line with TCFD recommendations and must undertake regular governance reviews to assess the effectiveness of trustee decision-making.",
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
