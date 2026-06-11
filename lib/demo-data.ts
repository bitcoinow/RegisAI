import type { Audit } from '@/types'

// Pre-seeded demo audit for Clearview Capital — shown at /demo/clearview without login.
export const CLEARVIEW_DEMO: Audit = {
  id: 'demo-clearview',
  document_id: 'demo-doc',
  user_id: 'demo-user',
  jurisdiction: 'US',
  firm_name: 'Clearview Capital Management',
  exec_summary:
    "Clearview Capital Management's compliance manual demonstrates a foundational compliance framework; however, the analysis identifies 18 significant gaps against applicable FINRA, SEC, AML/BSA, and Regulation Best Interest requirements. Seven findings present High risk exposure requiring immediate remediation before the firm's next regulatory examination. The firm demonstrates strength in investment policy documentation and Form ADV disclosures, but critical deficiencies exist in supervisory procedures, AML controls, and Reg BI implementation.",
  total_gaps: 18,
  high_risk: 7,
  medium_risk: 8,
  low_risk: 3,
  strengths: [
    'Form ADV Part 2A provides comprehensive disclosure of services, fees, and conflicts of interest',
    'Documented investment policy statement with clear asset allocation guidelines per client risk profile',
    'Annual compliance training calendar established with attendance tracking',
    'Client onboarding paperwork includes a detailed risk tolerance questionnaire',
    'Segregation of duties between portfolio management and operations functions is documented',
  ],
  priority_actions: [
    'Immediately develop comprehensive Written Supervisory Procedures (WSPs) covering all business lines — this is the single highest-priority remediation',
    'Establish a Customer Identification Program (CIP) with documented identity verification procedures for all new accounts',
    'Implement a formal Regulation Best Interest compliance framework including a conflict-of-interest register and best interest documentation requirement for every recommendation',
    'Develop, test, and document a Business Continuity Plan with recovery time objectives and emergency contact procedures',
    'Create and distribute annual privacy notices to all clients to satisfy Regulation S-P requirements and implement a written information security program',
  ],
  findings: [
    {
      id: 'REQ-001',
      rule: 'FINRA Rule 3110(a)',
      requirement: 'Supervisory System',
      policy_says:
        'The manual references "general supervisory oversight by the CCO" but provides no documented supervisory structure, reporting lines, or responsibility matrix.',
      gap: 'No formal supervisory system is documented. The manual does not identify supervisory personnel by name or title, define supervisory responsibilities, or describe the mechanics of how supervision is conducted across business lines.',
      risk: 'High',
      recommendation:
        'Develop a comprehensive supervisory structure document naming all supervisory principals, defining their specific responsibilities, and establishing the reporting hierarchy. Review FINRA Notice 19-18 for guidance on supervisory system elements.',
      drafted_policy:
        'Supervisory System (FINRA Rule 3110(a))\n\n' +
        'The Firm shall establish and maintain a system to supervise the activities of each associated person that is reasonably designed to achieve compliance with applicable securities laws and regulations and with FINRA rules.\n\n' +
        '1. Designation of Principals. The Firm shall designate, by name and title, one or more appropriately registered principals with authority to carry out supervisory responsibilities for each type of business in which the Firm engages. The Chief Compliance Officer shall maintain a current Supervisory Responsibility Matrix identifying each supervisor, the activities and associated persons they supervise, and their reporting line.\n\n' +
        '2. Supervisory Procedures. Each designated principal shall supervise in accordance with the Firm’s Written Supervisory Procedures, including the review and evidencing of transactions, correspondence, and outside business activities within their assigned area.\n\n' +
        '3. Annual Review. The Firm shall review and update the supervisory system and the Supervisory Responsibility Matrix no less than annually, and promptly upon any material change in business or personnel. The CCO shall retain records of each review for not less than the period required under FINRA Rule 4511.\n\n' +
        '4. Reporting. Supervisory principals shall escalate material compliance exceptions to the CCO promptly, and the CCO shall report to senior management on the operation of the supervisory system at least annually.',
    },
    {
      id: 'REQ-002',
      rule: 'FINRA Rule 3110(b)',
      requirement: 'Written Supervisory Procedures (WSPs)',
      policy_says:
        'Not addressed. The compliance manual contains general compliance principles but no Written Supervisory Procedures for any specific business activity.',
      gap: 'The firm has no Written Supervisory Procedures. FINRA Rule 3110(b) requires detailed WSPs for each type of business the firm engages in. Absence of WSPs is one of the most commonly cited deficiencies in FINRA examinations.',
      risk: 'High',
      recommendation:
        'Develop WSPs for all business lines including investment advisory services, trading, client communications, and new account opening. Each WSP must identify the supervisory principal responsible, describe the supervisory steps, and specify record-keeping requirements.',
    },
    {
      id: 'REQ-007',
      rule: 'FINRA Rule 3310',
      requirement: 'AML Compliance Program',
      policy_says:
        'The manual contains one paragraph: "The firm complies with all applicable anti-money laundering laws and cooperates with regulatory inquiries."',
      gap: 'The AML program is wholly inadequate. FINRA Rule 3310 requires a written AML program with internal policies and controls, a designated AML compliance officer, ongoing employee training, and independent testing. None of these elements are present.',
      risk: 'High',
      recommendation:
        'Develop a complete written AML program meeting all four pillars of BSA compliance: internal controls, independent testing, designated AML compliance officer, and ongoing training. Consider engaging outside counsel specialising in BSA compliance to draft the initial program.',
    },
    {
      id: 'REQ-011',
      rule: 'SEC Regulation S-P',
      requirement: 'Privacy of Consumer Financial Information',
      policy_says:
        'Not addressed. The compliance manual does not contain a privacy policy or any reference to Regulation S-P.',
      gap: 'No privacy policy exists. Reg S-P requires financial institutions to provide initial and annual privacy notices to customers describing information collection and sharing practices, and to implement information security safeguards.',
      risk: 'High',
      recommendation:
        'Draft a Regulation S-P compliant privacy policy and implement procedures for delivering initial notices at account opening and annual notices thereafter. Also implement a written information security program addressing administrative, technical, and physical safeguards.',
    },
    {
      id: 'REQ-018',
      rule: 'FinCEN 31 CFR 1020.220',
      requirement: 'Customer Identification Program (CIP)',
      policy_says:
        'The onboarding section references collecting "standard identifying documents" but provides no specific requirements for what must be collected or verified.',
      gap: "No formal CIP exists. The firm must have written procedures specifying minimum identifying information (name, date of birth, address, taxpayer ID), verification methods, record-keeping requirements, and procedures for comparing customers against government lists.",
      risk: 'High',
      recommendation:
        'Implement a written Customer Identification Program specifying: (1) minimum required identifying information, (2) verification procedures for both document-based and non-documentary methods, (3) records retention periods, and (4) procedures for checking the OFAC SDN list and FinCEN 314(a) requests.',
    },
    {
      id: 'REQ-024',
      rule: 'SEC Reg BI — Rule 15l-1(a)(1)',
      requirement: 'Best Interest Obligation',
      policy_says:
        "The manual states the firm \"acts in clients' best interests at all times\" but provides no framework for how best interest is determined or documented.",
      gap: 'No Reg BI compliance framework exists. The firm must have documented processes for making and recording best interest determinations, a conflict-of-interest register, and procedures for disclosing and managing conflicts at the point of recommendation.',
      risk: 'High',
      recommendation:
        'Implement a Reg BI compliance framework including: (1) documented best interest analysis procedures for all recommendations, (2) a conflict-of-interest inventory and management procedures, (3) Form CRS delivery and tracking procedures, and (4) training for all associated persons on Reg BI obligations.',
    },
    {
      id: 'REQ-032',
      rule: 'SEC Regulation S-P Rule 30',
      requirement: 'Incident Response Plan',
      policy_says:
        'Not addressed. The compliance manual contains no cybersecurity or data breach response procedures.',
      gap: 'No incident response plan exists. Regulation S-P requires written policies and procedures for responding to security incidents that result in unauthorised access to customer information, including notification procedures.',
      risk: 'High',
      recommendation:
        'Develop a written incident response plan covering: (1) incident detection and classification, (2) containment and remediation procedures, (3) customer notification requirements and timelines, (4) regulatory notification procedures, and (5) post-incident review requirements.',
    },
    {
      id: 'REQ-005',
      rule: 'FINRA Rule 2111',
      requirement: 'Suitability',
      policy_says:
        'The manual references conducting suitability analysis but does not define the methodology, documentation standards, or review process.',
      gap: 'Suitability procedures are vague. The manual does not specify what customer information must be gathered, how suitability determinations are documented, who reviews them, or how the firm handles customers who request unsuitable investments.',
      risk: 'Medium',
      recommendation:
        'Develop detailed suitability procedures specifying the customer information required (investment objectives, risk tolerance, time horizon, financial situation), the documentation format for suitability analyses, and the supervisory review process for recommendations.',
    },
    {
      id: 'REQ-013',
      rule: 'SEC Rule 204A-1',
      requirement: 'Code of Ethics',
      policy_says:
        'A code of ethics section exists covering general standards of conduct but lacks specific provisions for personal securities trading and reporting.',
      gap: 'The code of ethics does not address personal securities trading requirements. Rule 204A-1 requires codes of ethics to include personal securities reporting requirements, pre-clearance procedures for access persons, and annual certification of compliance.',
      risk: 'Medium',
      recommendation:
        'Amend the code of ethics to include: (1) identification of "access persons," (2) pre-clearance requirements for personal securities transactions, (3) holdings and transaction reporting requirements, (4) blackout period policies, and (5) annual certification procedures.',
    },
    {
      id: 'REQ-019',
      rule: 'FinCEN 31 CFR 1010.610',
      requirement: 'Customer Due Diligence (CDD)',
      policy_says:
        'The onboarding section mentions "background checks" for new clients but does not describe beneficial ownership identification for legal entity customers.',
      gap: 'No formal CDD program exists for legal entity customers. The firm must have written procedures for identifying and verifying the beneficial owners of legal entity customers (those with 25%+ equity interest and one controlling person).',
      risk: 'Medium',
      recommendation:
        'Implement a CDD program that includes the FinCEN Beneficial Ownership Certification Form for all legal entity customers, procedures for verifying the identity of beneficial owners, and ongoing monitoring procedures to update CDD information when changes occur.',
    },
    {
      id: 'REQ-026',
      rule: 'SEC Reg BI — Rule 15l-1(a)(2)(iii)',
      requirement: 'Conflict of Interest Obligation',
      policy_says:
        'The manual discloses fee structures and general potential conflicts in the Form ADV but contains no internal conflict management procedures.',
      gap: 'No internal conflict-of-interest management procedures exist. Reg BI requires written policies to identify all conflicts, and procedures to disclose or eliminate material conflicts. A Form ADV disclosure alone does not satisfy the Reg BI conflict management obligation.',
      risk: 'Medium',
      recommendation:
        'Develop a conflicts-of-interest register that inventories all actual and potential conflicts, and adopt written procedures for how each conflict is managed (eliminated, disclosed, or mitigated). Assign responsibility for annual review and updating of the register.',
    },
    {
      id: 'REQ-029',
      rule: 'FINRA Rule 4370',
      requirement: 'Business Continuity Plan',
      policy_says:
        'The manual references maintaining business operations during disruptions but provides no specific BCP documentation.',
      gap: 'No written BCP exists. FINRA Rule 4370 requires a written BCP addressing data backup and recovery, mission-critical systems identification, financial and operational assessment procedures, alternate communications, and customer notification procedures.',
      risk: 'Medium',
      recommendation:
        'Develop a comprehensive written BCP addressing all required FINRA 4370 elements. The BCP should include contact information for key personnel and third parties, recovery time objectives for critical systems, and tested backup procedures. The BCP must be reviewed and updated annually.',
    },
    {
      id: 'REQ-030',
      rule: 'SEC Rule 206(4)-7',
      requirement: 'Annual Compliance Review',
      policy_says:
        'The manual states compliance policies are reviewed "periodically" but does not describe a formal annual review process.',
      gap: 'No documented annual compliance review process. Rule 206(4)-7 requires investment advisers to review their compliance policies and procedures at least annually, assess adequacy and effectiveness of implementation, and document the review.',
      risk: 'Medium',
      recommendation:
        'Establish a formal annual compliance review process with a written scope, responsible parties, review methodology, and documentation requirements. The annual review results should be reported to senior management in a written report.',
    },
    {
      id: 'REQ-020',
      rule: 'FinCEN 31 CFR 1020.320',
      requirement: 'Suspicious Activity Reports (SARs)',
      policy_says:
        'Not addressed. The compliance manual contains no SAR filing procedures.',
      gap: "No SAR filing procedures exist. The firm must have written procedures for identifying, escalating, and filing SARs for transactions involving $5,000 or more that involve suspected illicit activity, within the required 30-day timeframe.",
      risk: 'Medium',
      recommendation:
        "Implement written SAR procedures covering: (1) what activities trigger SAR review, (2) the escalation process, (3) mechanics of filing via FinCEN's BSA E-Filing system, (4) the 30-day filing deadline, and (5) the prohibition on tipping off the subject of a SAR.",
    },
    {
      id: 'REQ-031',
      rule: 'FINRA Rule 3110(c)',
      requirement: 'Internal Inspections',
      policy_says:
        "The manual references the CCO's general supervisory role but does not describe a formal inspection program.",
      gap: 'No formal internal inspection program is documented. FINRA requires at least annual inspections of offices and business activities. The inspection program must be documented with written reports of findings and any corrective actions taken.',
      risk: 'Medium',
      recommendation:
        'Develop an internal inspection program with written checklists for each office type (OSJ vs. non-branch), assign inspection responsibility, establish reporting requirements, and maintain records of all inspections conducted and findings addressed.',
    },
    {
      id: 'REQ-006',
      rule: 'FINRA Rule 4511',
      requirement: 'Books and Records — General',
      policy_says:
        'The manual references maintaining client records but does not specify which records must be maintained or for how long.',
      gap: 'Books and records retention policies are not documented. FINRA Rule 4511 requires specific records to be maintained for specified periods (generally 3–6 years). The current manual does not address this requirement.',
      risk: 'Low',
      recommendation:
        'Develop a records retention schedule identifying all required books and records, their retention periods, storage formats (paper vs. electronic), and destruction procedures. Ensure the schedule covers all FINRA 4511 and SEC 17a-3/17a-4 requirements.',
    },
    {
      id: 'REQ-009',
      rule: 'SEC Rule 17a-3',
      requirement: 'Books and Records — Required Records',
      policy_says: 'Not specifically addressed in the compliance manual.',
      gap: 'The manual does not identify which specific records required by SEC Rule 17a-3 the firm maintains. While the firm likely maintains these records operationally, the compliance manual should reference them to demonstrate regulatory awareness.',
      risk: 'Low',
      recommendation:
        "Add a section to the compliance manual cataloguing the firm's books and records practices, referencing Rule 17a-3 requirements specifically. Confirm with operations that all required records (blotters, ledgers, order tickets, customer account records) are being maintained.",
    },
    {
      id: 'REQ-010',
      rule: 'SEC Rule 17a-4',
      requirement: 'Books and Records — Retention',
      policy_says: 'Not specifically addressed.',
      gap: 'No records retention schedule references SEC Rule 17a-4 requirements. The firm must retain certain records for 6 years (first 2 years in an accessible location) and others for 3 years.',
      risk: 'Low',
      recommendation:
        'Incorporate SEC Rule 17a-4 retention requirements into the records retention schedule. If using an electronic records system, ensure it meets the WORM (write once, read many) and audit trail requirements for electronic records storage.',
    },
  ],
  created_at: '2026-04-28T09:00:00.000Z',
}

// ── UK compliance end-to-end proof point (Northwind Payments) ─────────────────
// Two linked audits demonstrating the full lifecycle for a UK-regulated firm:
//   V1 — initial scan: 12 gaps across all UK frameworks, posture 40%
//   V2 — re-scan of the remediated manual: 8 gaps closed, posture 90%
// Shown at /demo/gdpr without login. req ids match lib/uk-regulatory-library.ts so
// the coverage matrix and re-scan delta line up against the real UK library.

export const UK_DEMO_V1: Audit = {
  id: "demo-uk-v1",
  document_id: "demo-uk-doc-v1",
  user_id: "demo-user",
  jurisdiction: "UK",
  firm_name: "Northwind Payments Ltd",
  exec_summary:
    "Northwind Payments Ltd, a UK FCA-authorised payment institution, submitted its compliance manual for a gap analysis against all 19 UK regulatory requirements spanning SM&CR, FCA Conduct Rules, UK AML, UK GDPR, and FCA Operational Resilience obligations. The manual establishes a baseline — a suitability framework is in place, conflict-of-interest disclosures exist, and AML training records are maintained — but 12 gaps remain, 5 of them High risk. The most serious deficiencies concern Senior Manager accountability under SM&CR, Consumer Duty implementation, AML policies and Customer Due Diligence procedures, and the Compliance Function governance. Overall compliance posture is assessed at 40%.",
  total_gaps: 12,
  high_risk: 5,
  medium_risk: 5,
  low_risk: 2,
  scan_number: 1,
  parent_audit_id: null,
  compliance_score: 40,
  requirements_total: 19,
  requirements_met: 7,
  strengths: [
    "Suitability assessment framework documented with clear client categorisation and risk tolerance questionnaire at onboarding",
    "Conflicts of interest policy published, covering remuneration structures and third-party relationships",
    "AML training records maintained with completion tracking for all relevant employees",
    "Important business services identified with draft impact tolerances documented",
    "Product disclosure documents comply with the FCA fair, clear and not misleading standard",
    "Annual customer communications review process established",
    "Segregation of duties between client-facing and operations functions is documented",
  ],
  priority_actions: [
    "Produce a management responsibilities map and file updated Statements of Responsibilities for all FCA-approved Senior Managers under SM&CR",
    "Implement a Consumer Duty framework — conduct a fair value assessment, review customer support adequacy, and assess all communications for clarity",
    "Establish written AML policies and procedures approved by senior management, covering internal controls, risk appetite, CDD, and suspicious activity reporting",
    "Appoint a dedicated Compliance Officer with a formal mandate, adequate resources, and a direct reporting line to the board",
    "Implement Customer Due Diligence procedures with documented identity verification, beneficial owner identification, and ongoing monitoring standards",
  ],
  findings: [
    {
      id: "REQ-UK-001",
      req_id: "REQ-UK-001",
      rule: "FCA SYSC 2.1 / SM&CR",
      requirement: "Senior Management Arrangements",
      policy_says:
        "The compliance manual refers to management oversight and names the Managing Director as responsible for regulatory compliance, but does not set out a management responsibilities map or formally allocate any FCA-prescribed responsibilities to specific individuals.",
      gap: "No management responsibilities map exists. The FCA requires each SMCR firm to produce a single document setting out governance arrangements, responsibility allocations, and reporting lines between senior managers. No prescribed responsibilities are formally recorded or allocated.",
      risk: "High",
      recommendation:
        "Produce a management responsibilities map allocating all applicable FCA-prescribed responsibilities to named senior managers. File updated Statements of Responsibilities for all approved persons and maintain the map as a living document updated on any material change.",
    },
    {
      id: "REQ-UK-004",
      req_id: "REQ-UK-004",
      rule: "FCA PRIN 2A / PS22/9",
      requirement: "Consumer Duty — Four Consumer Outcomes",
      policy_says:
        "The manual states the firm aims to provide good customer outcomes but contains no Consumer Duty implementation framework, fair value assessment, or outcome monitoring process.",
      gap: "Consumer Duty is not implemented. The firm has not conducted a fair value assessment, reviewed customer support adequacy, or assessed its communications for the clarity standard required under the Duty. No governance or monitoring framework evidences the four consumer outcomes.",
      risk: "High",
      recommendation:
        "Implement a Consumer Duty framework addressing all four outcome areas: products and services fitness, fair value, consumer understanding, and consumer support. Conduct a product-level fair value assessment and establish ongoing outcome monitoring with board-level oversight.",
    },
    {
      id: "REQ-UK-008",
      req_id: "REQ-UK-008",
      rule: "FCA SYSC 6.1",
      requirement: "Compliance Function",
      policy_says:
        "The manual designates the Managing Director as responsible for compliance as part of their broader management role. No dedicated compliance function or compliance officer is described.",
      gap: "No permanent compliance function exists. FCA SYSC 6.1 requires firms to maintain a permanent and effective compliance function with a designated Compliance Officer who has the authority and independence to carry out the role and who reports directly to senior management.",
      risk: "High",
      recommendation:
        "Appoint a Compliance Officer with a formal mandate, adequate resources, and a direct reporting line to the board. Establish a risk-based compliance monitoring programme and define the compliance function role in product approval, policy governance, and regulatory change management.",
    },
    {
      id: "REQ-UK-011",
      req_id: "REQ-UK-011",
      rule: "MLR 2017 Regulation 18",
      requirement: "AML Policies, Controls and Procedures",
      policy_says:
        "The manual includes one page on anti-money laundering stating the firm takes AML obligations seriously and cooperates with law enforcement. No written policies, controls, or procedures are documented.",
      gap: "No written AML policies exist. MLR 2017 Regulation 18 requires documented policies covering customer due diligence, suspicious activity reporting, record keeping, internal controls, risk assessment and management, and compliance monitoring, all approved by senior management.",
      risk: "High",
      recommendation:
        "Develop a comprehensive suite of written AML policies and procedures. Conduct and document a business-wide AML risk assessment, obtain senior management approval, and designate a Money Laundering Reporting Officer (MLRO) with formal responsibility and a direct reporting line to the board.",
      drafted_policy:
        "AML Policies, Controls and Procedures (MLR 2017 Regulation 18)\n\n" +
        "The Firm shall establish, implement, and maintain written policies and procedures designed to prevent the Firm from being used for money laundering or terrorist financing.\n\n" +
        "1. Business-Wide Risk Assessment. The Firm shall conduct and document a business-wide AML risk assessment covering its customers, products, services, delivery channels, and geographic exposure. The assessment shall be reviewed at least annually and updated following any material change to the business. The MLRO shall present the assessment to senior management for approval.\n\n" +
        "2. Customer Due Diligence. The Firm shall apply customer due diligence measures in accordance with MLR 2017 Regulation 28. CDD procedures shall specify the identification and verification requirements for individuals and legal entities, the triggers for standard, simplified, and enhanced due diligence, and the process for identifying and verifying beneficial owners.\n\n" +
        "3. Suspicious Activity Reporting. The Firm shall maintain a written SAR policy describing how employees identify and escalate suspicions of money laundering or terrorist financing to the MLRO. The MLRO shall assess each report and, where required, submit a Suspicious Activity Report to the National Crime Agency via the online portal within the required timeframe. Tipping off is strictly prohibited.\n\n" +
        "4. Record Keeping. The Firm shall retain CDD documents and supporting records for a minimum of five years from the end of the business relationship, in accordance with MLR 2017 Regulation 40.\n\n" +
        "5. Internal Controls and Monitoring. The Firm shall maintain internal controls to monitor compliance with its AML policies. The MLRO shall produce an annual report to senior management on the operation of the AML programme, including a summary of SARs filed, training completion, and any audit findings.",
    },
    {
      id: "REQ-UK-012",
      req_id: "REQ-UK-012",
      rule: "MLR 2017 Regulation 28",
      requirement: "Customer Due Diligence",
      policy_says:
        "The manual references collecting standard identity documents at onboarding but contains no CDD procedures, verification methodology, or beneficial ownership identification process.",
      gap: "No formal CDD procedures exist. MLR 2017 Regulation 28 requires documented procedures for identifying and verifying customers and beneficial owners, with clear triggers for standard, simplified, and enhanced due diligence and ongoing monitoring obligations.",
      risk: "High",
      recommendation:
        "Implement written CDD procedures specifying: (1) identification and verification documents required for individuals and legal entities, (2) beneficial owner identification for entities with 25%+ ownership, (3) CDD triggers and timing, (4) record-keeping requirements, and (5) ongoing monitoring standards and review triggers.",
    },
    {
      id: "REQ-UK-002",
      req_id: "REQ-UK-002",
      rule: "FSMA 2000 s64A / SM&CR SOF",
      requirement: "Senior Manager Responsibilities and Statements of Responsibilities",
      policy_says:
        "The manual identifies four directors but contains no individual Statements of Responsibilities or description of how accountability is allocated across the management team.",
      gap: "No Statements of Responsibilities have been produced or filed with the FCA for any senior manager. Each SM&CR-approved person must have a written SOR clearly setting out their individual responsibilities, and senior managers must take reasonable steps to prevent regulatory breaches within their areas.",
      risk: "Medium",
      recommendation:
        "Produce written Statements of Responsibilities for all FCA-approved senior managers and file them with the FCA. Update SORs promptly when responsibilities change and retain records of all versions for FCA inspection.",
      status: "in_progress",
      reviewed_by: "demo-user",
      reviewed_at: "2026-05-02T10:15:00.000Z",
      reviewer_label: "compliance@northwindpay.co.uk",
      review_note:
        "SM&CR project underway — management responsibilities map being drafted with external SMCR consultants. Target completion by end of May 2026.",
    },
    {
      id: "REQ-UK-005",
      req_id: "REQ-UK-005",
      rule: "FCA COBS 2.1.1R",
      requirement: "Client Best Interests Rule",
      policy_says:
        "The manual states the firm acts in customers best interests at all times but provides no framework, documented procedures, or evidencing standards for demonstrating compliance.",
      gap: "No best interests framework exists. FCA COBS 2.1.1R requires documented policies and procedures ensuring the firm does not place its own interests above those of clients, with evidence of compliance across all business lines and at the level of individual recommendations.",
      risk: "Medium",
      recommendation:
        "Develop a best interests policy and embed documentation requirements into client-facing processes. Establish a conflicts review mechanism to identify where the firm's commercial interests may diverge from client interests and record how those conflicts are managed.",
    },
    {
      id: "REQ-UK-009",
      req_id: "REQ-UK-009",
      rule: "FCA SYSC 7.1",
      requirement: "Risk Assessment and Control",
      policy_says:
        "The compliance manual references managing risks appropriately but contains no risk management framework, risk appetite statement, or risk register.",
      gap: "No formal risk management framework exists. FCA SYSC 7.1 requires firms to identify, assess, and manage risks through documented policies and processes, with a clearly articulated risk tolerance and ongoing monitoring to ensure risks remain within appetite.",
      risk: "Medium",
      recommendation:
        "Establish a risk management framework including a business-wide risk assessment, risk appetite statement, a risk register with named ownership, and a schedule for periodic review. Integrate risk assessment into new product approval and material change processes.",
    },
    {
      id: "REQ-UK-013",
      req_id: "REQ-UK-013",
      rule: "MLR 2017 Regulation 35",
      requirement: "Enhanced Due Diligence — PEPs and High Risk",
      policy_says:
        "The manual acknowledges that PEPs represent a higher money laundering risk but contains no EDD procedures, screening process, or senior management approval requirement.",
      gap: "No EDD procedures exist for PEPs or high-risk customers. MLR 2017 Regulation 35 requires documented EDD measures including enhanced ongoing monitoring and mandatory senior management approval for PEP relationships, applied from the outset of the business relationship.",
      risk: "Medium",
      recommendation:
        "Implement EDD procedures covering: (1) a PEP screening process at onboarding and ongoing, (2) source of funds and source of wealth verification, (3) mandatory senior management approval for new and existing PEP relationships, and (4) enhanced ongoing monitoring with documented rationale retained on file.",
    },
    {
      id: "REQ-UK-015",
      req_id: "REQ-UK-015",
      rule: "UK GDPR Article 5 / DPA 2018",
      requirement: "Data Processing Principles and Lawful Basis",
      policy_says:
        "A brief data protection section states the firm complies with UK GDPR. No processing inventory, lawful basis documentation, or data minimisation controls are described.",
      gap: "UK GDPR compliance is asserted but not evidenced. No Record of Processing Activities exists, no lawful basis has been documented for any processing activity, and the data protection principles are not operationalised in any policy or procedure.",
      risk: "Medium",
      recommendation:
        "Create a Record of Processing Activities, document the lawful basis for each processing category, and embed the UK GDPR data protection principles into data governance procedures. Ensure the privacy notice reflects the documented lawful bases and retention periods.",
    },
    {
      id: "REQ-UK-016",
      req_id: "REQ-UK-016",
      rule: "UK GDPR Article 32 / DPA 2018 s66",
      requirement: "Security of Processing",
      policy_says:
        "The manual states customer data is held securely with no description of technical or organisational security measures.",
      gap: "No information security measures are documented against the UK GDPR Article 32 standard. The firm has not documented encryption standards, access controls, incident response procedures, or a process for regularly testing the effectiveness of its security measures.",
      risk: "Low",
      recommendation:
        "Document technical and organisational security measures including encryption standards, access control policies, incident response procedures, and a schedule for regular testing. Align controls to a recognised framework such as Cyber Essentials Plus.",
    },
    {
      id: "REQ-UK-017",
      req_id: "REQ-UK-017",
      rule: "DPA 2018 s137 / UK GDPR Art 37",
      requirement: "ICO Registration and Data Protection Officer",
      policy_says:
        "Not addressed. The manual contains no reference to ICO registration or consideration of a Data Protection Officer.",
      gap: "No evidence of ICO registration or DPO designation assessment. As an FCA-authorised payment institution processing customer financial data at scale, the firm is likely subject to ICO registration requirements and should assess whether a DPO designation is required under DPA 2018 s137.",
      risk: "Low",
      recommendation:
        "Confirm ICO registration is current and retrieve the registration certificate. Complete the DPO designation assessment under UK GDPR Article 37; if required, appoint a DPO with documented responsibilities, adequate resources, and independence from operational management.",
    },
  ],
  created_at: "2026-04-30T09:00:00.000Z",
}

export const UK_DEMO_V2: Audit = {
  id: "demo-uk-v2",
  document_id: "demo-uk-doc-v2",
  user_id: "demo-user",
  jurisdiction: "UK",
  firm_name: "Northwind Payments Ltd",
  exec_summary:
    "Following a structured remediation programme, Northwind Payments Ltd resubmitted its updated compliance manual for a UK regulatory re-scan. Of the 12 gaps identified in the initial audit, 8 have been fully closed — including the SM&CR management responsibilities map, Consumer Duty framework, Compliance Function governance, Customer Due Diligence procedures, and the best interests and risk management frameworks. Three gaps (AML policies, EDD for PEPs, and UK GDPR data principles) are materially improved or in progress, and one new Low-risk finding was identified in the ICO registration documentation. Overall compliance posture has risen from 40% to 90%.",
  total_gaps: 4,
  high_risk: 0,
  medium_risk: 1,
  low_risk: 3,
  scan_number: 2,
  parent_audit_id: "demo-uk-v1",
  compliance_score: 90,
  requirements_total: 19,
  requirements_met: 15,
  gaps_closed: 8,
  gaps_new: 1,
  gaps_persisting: 3,
  strengths: [
    "SM&CR management responsibilities map completed with all prescribed responsibilities allocated and Statements of Responsibilities filed for all senior managers",
    "Consumer Duty implementation programme completed — fair value assessments conducted, customer support reviewed, and communications assessed for clarity",
    "Compliance Officer appointed with a formal mandate, risk-based monitoring programme, and quarterly reporting to the board",
    "Customer Due Diligence procedures implemented with identity verification workflows, beneficial owner checks, and ongoing monitoring standards",
    "Business-wide AML risk assessment completed and approved by senior management; MLRO designated with formal authority",
    "Risk management framework established with a risk appetite statement, risk register, and quarterly board review",
    "Best interests policy implemented with documentation standards embedded into all client-facing processes",
  ],
  priority_actions: [
    "Supplement the AML policy suite with a transaction monitoring standard specifying alert thresholds, SAR escalation workflow, and MLRO reporting obligations",
    "Complete a retrospective EDD review of all customers onboarded before the new procedures took effect to identify any PEPs requiring enhanced monitoring",
    "Confirm ICO registration is current and formally designate the Data Protection Officer with written terms of reference and board notification",
  ],
  findings: [
    {
      id: "REQ-UK-011",
      req_id: "REQ-UK-011",
      rule: "MLR 2017 Regulation 18",
      requirement: "AML Policies, Controls and Procedures",
      policy_says:
        "An updated AML policy suite has been drafted and approved by the board, covering CDD, record-keeping, internal controls, business-wide risk assessment, and MLRO designation.",
      gap: "Primary AML policies are now in place. Residual gaps remain in transaction monitoring governance — the policy does not specify monitoring thresholds, alert review frequency, or the SAR escalation workflow in sufficient operational detail for front-line staff.",
      risk: "Medium",
      recommendation:
        "Supplement the AML policy suite with a transaction monitoring standard specifying alert thresholds, review and escalation procedures, the SAR filing workflow including tipping-off controls, and the MLRO reporting obligations to senior management.",
    },
    {
      id: "REQ-UK-013",
      req_id: "REQ-UK-013",
      rule: "MLR 2017 Regulation 35",
      requirement: "Enhanced Due Diligence — PEPs and High Risk",
      policy_says:
        "EDD procedures have been introduced covering PEP screening at onboarding, source of funds verification, and mandatory senior management approval for new PEP relationships.",
      gap: "EDD is addressed for new customers. Existing customers onboarded before the new procedures took effect have not been retrospectively risk-categorised, and EDD has not been applied to pre-existing relationships that may include PEPs.",
      risk: "Low",
      recommendation:
        "Conduct a retrospective risk-categorisation review of the existing customer book to identify any PEPs onboarded prior to the new procedures and apply the EDD standard retroactively, with documented outcomes retained on file.",
    },
    {
      id: "REQ-UK-015",
      req_id: "REQ-UK-015",
      rule: "UK GDPR Article 5 / DPA 2018",
      requirement: "Data Processing Principles and Lawful Basis",
      policy_says:
        "A Record of Processing Activities has been produced and lawful bases documented for the firm primary processing activities, including payment processing and customer onboarding.",
      gap: "The ROPA covers core processing activities. Three secondary processing categories — analytics, fraud-pattern modelling, and marketing profiling — do not yet have documented lawful bases or data retention periods.",
      risk: "Low",
      recommendation:
        "Extend the ROPA and lawful basis documentation to cover all processing categories. Conduct a legitimate interests assessment for analytics and fraud modelling; assess whether marketing profiling requires explicit consent under UK GDPR and PECR.",
      status: "risk_accepted",
      reviewed_by: "demo-user",
      reviewed_at: "2026-05-28T14:20:00.000Z",
      reviewer_label: "dpo@northwindpay.co.uk",
      review_note:
        "Risk accepted: marketing profiling has been suspended pending completion of the legitimate interests assessment. DPO and Head of Compliance approved the suspension as a proportionate risk mitigation measure. LIA target completion: 30 June 2026.",
    },
    {
      id: "REQ-UK-017",
      req_id: "REQ-UK-017",
      rule: "DPA 2018 s137 / UK GDPR Art 37",
      requirement: "ICO Registration and Data Protection Officer",
      policy_says:
        "The updated compliance manual references UK GDPR obligations but still does not confirm ICO registration status or include a formal DPO designation document.",
      gap: "Newly identified: no ICO registration certificate has been located in the compliance documentation, and there is no formal DPO designation document despite the firm scale of personal data processing.",
      risk: "Low",
      recommendation:
        "Confirm ICO registration is current, retrieve the registration certificate, and record it in the compliance register. Produce a formal DPO designation document with defined responsibilities, independence provisions, and a board notification on the record.",
    },
  ],
  created_at: "2026-05-29T09:00:00.000Z",
}
