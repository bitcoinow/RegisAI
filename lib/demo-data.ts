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

// ── GDPR end-to-end proof point (Northwind Payments) ──────────────────────────
// Two linked audits demonstrating the full lifecycle for a single framework:
//   V1 — initial scan: 13 gaps, posture 40%
//   V2 — re-scan of the remediated manual: 10 gaps closed, posture 90%
// Shown at /demo/gdpr without login. req ids match lib/eu-regulatory-library.ts so
// the coverage matrix and re-scan delta line up against the real GDPR library.

export const GDPR_DEMO_V1: Audit = {
  id: 'demo-gdpr-v1',
  document_id: 'demo-gdpr-doc-v1',
  user_id: 'demo-user',
  jurisdiction: 'EU',
  framework: 'GDPR',
  firm_name: 'Northwind Payments Ltd',
  exec_summary:
    'Northwind Payments Ltd, an EU-authorised electronic money institution, submitted its Data Protection Policy for a focused GDPR gap analysis against all 16 in-scope GDPR requirements. The manual establishes a baseline — encryption is in place, a consent mechanism exists, and a customer privacy notice is published — but 13 gaps remain, 5 of them High risk. The most serious deficiencies concern the lawful basis for processing, breach notification timelines, processor contracts, and international transfer safeguards. Overall compliance posture is assessed at 40%.',
  total_gaps: 13,
  high_risk: 5,
  medium_risk: 6,
  low_risk: 2,
  scan_number: 1,
  parent_audit_id: null,
  compliance_score: 40,
  requirements_total: 16,
  requirements_met: 3,
  strengths: [
    'Personal data is encrypted in transit (TLS 1.2+) and at rest (AES-256), satisfying the core technical measures of Article 32',
    'A consent capture mechanism with a granular opt-in is implemented for marketing communications, broadly consistent with Article 7',
    'A customer-facing privacy notice is published on the website and at account opening, addressing Articles 12–14',
  ],
  priority_actions: [
    'Document the Article 6 lawful basis for every processing activity, with a legitimate interests assessment where relied upon — no lawful basis is currently recorded',
    'Establish a personal data breach procedure with a 72-hour supervisory authority notification workflow under Articles 33–34',
    'Put Article 28-compliant Data Processing Agreements in place with all processors, including the firm’s cloud and KYC vendors',
    'Implement an international transfers framework (adequacy / SCCs + transfer impact assessment) for data sent outside the EEA',
    'Appoint and formally document a Data Protection Officer with defined responsibilities and reporting line under Article 37',
  ],
  findings: [
    {
      id: 'REQ-EU-007',
      req_id: 'REQ-EU-007',
      rule: 'GDPR Article 5',
      requirement: 'Lawfulness of Processing — Principles',
      policy_says:
        'The policy states that "Northwind respects customer privacy and handles data responsibly," but does not articulate the data protection principles or how they are applied.',
      gap: 'The Article 5 principles (purpose limitation, data minimisation, accuracy, storage limitation, integrity and confidentiality, and accountability) are not reflected in the policy. There is no evidence the principles govern processing decisions.',
      risk: 'High',
      recommendation:
        'Restate the six data protection principles in the policy and map each to a concrete control (e.g. data minimisation enforced at the collection form; accuracy via periodic data reviews).',
    },
    {
      id: 'REQ-EU-024',
      req_id: 'REQ-EU-024',
      rule: 'GDPR Article 6',
      requirement: 'Lawful Basis for Processing',
      policy_says: 'Not addressed. The policy does not identify a lawful basis for any processing activity.',
      gap: 'No Article 6 lawful basis is documented for any processing activity. Where legitimate interests would be relied upon, no legitimate interests assessment (LIA) exists. This is a foundational GDPR deficiency.',
      risk: 'High',
      recommendation:
        'Build a processing inventory and assign one of the six Article 6 lawful bases to each activity. Complete and retain an LIA wherever legitimate interests is the basis.',
    },
    {
      id: 'REQ-EU-010',
      req_id: 'REQ-EU-010',
      rule: 'GDPR Article 33 and 34',
      requirement: 'Personal Data Breach Notification',
      policy_says:
        'The policy notes that "security incidents are taken seriously and investigated," with no timelines, roles, or notification triggers.',
      gap: 'There is no breach notification procedure. The 72-hour supervisory authority notification obligation and the high-risk data subject communication requirement are absent, as is any breach register.',
      risk: 'High',
      recommendation:
        'Implement a documented breach response procedure with detection, assessment, a 72-hour notification workflow to the lead supervisory authority, data subject communication criteria, and a breach register.',
      drafted_policy:
        'Personal Data Breach Management (GDPR Articles 33 and 34)\n\n' +
        'The Firm shall maintain a documented procedure for the identification, assessment, containment, and notification of personal data breaches.\n\n' +
        '1. Detection and Escalation. Any employee or processor who becomes aware of a suspected personal data breach shall report it to the Data Protection Officer without undue delay and in any event within 24 hours of becoming aware. The DPO shall record the report in the Firm’s Breach Register.\n\n' +
        '2. Assessment. The DPO shall assess, without undue delay, whether a personal data breach has occurred and the likelihood and severity of the risk to the rights and freedoms of affected data subjects.\n\n' +
        '3. Supervisory Authority Notification. Where the breach is likely to result in a risk to data subjects, the DPO shall notify the lead supervisory authority not later than 72 hours after the Firm became aware of the breach. Where notification is made after 72 hours, the reasons for the delay shall be documented.\n\n' +
        '4. Data Subject Communication. Where the breach is likely to result in a high risk to data subjects, the Firm shall communicate the breach to affected data subjects without undue delay, in clear and plain language.\n\n' +
        '5. Record-Keeping. The Firm shall document all personal data breaches, including the facts, effects, and remedial action taken, in the Breach Register, irrespective of whether notification was required.',
    },
    {
      id: 'REQ-EU-030',
      req_id: 'REQ-EU-030',
      rule: 'GDPR Article 28',
      requirement: 'Processors and Data Processing Agreements',
      policy_says: 'The policy lists third-party vendors but references no data processing terms.',
      gap: 'No Article 28-compliant Data Processing Agreements are in place with processors (including the cloud hosting and KYC/identity-verification vendors). The mandatory Article 28(3) clauses are absent.',
      risk: 'High',
      recommendation:
        'Execute DPAs containing the Article 28(3) clauses with all processors; maintain a processor register and obtain documented sub-processor authorisations.',
    },
    {
      id: 'REQ-EU-033',
      req_id: 'REQ-EU-033',
      rule: 'GDPR Chapter V, Articles 44 to 49',
      requirement: 'International Transfers of Personal Data',
      policy_says: 'Not addressed, though the firm uses a US-based KYC provider.',
      gap: 'Personal data is transferred outside the EEA (US KYC provider) with no transfer mechanism — no adequacy reliance, Standard Contractual Clauses, or transfer impact assessment is documented.',
      risk: 'High',
      recommendation:
        'Map all cross-border transfers and put an appropriate Chapter V mechanism in place (SCCs plus a transfer impact assessment and supplementary measures where required).',
    },
    {
      id: 'REQ-EU-008',
      req_id: 'REQ-EU-008',
      rule: 'GDPR Article 24',
      requirement: 'Controller Accountability',
      policy_says: 'The policy asserts compliance but provides no governance or documentation framework.',
      gap: 'The accountability principle is not operationalised: there are no data protection policies maintained as a set, no evidence of management oversight, and no demonstrable compliance documentation.',
      risk: 'Medium',
      recommendation:
        'Establish a data protection governance framework: a policy suite, defined ownership, periodic management review, and a documentation set that demonstrates compliance.',
    },
    {
      id: 'REQ-EU-011',
      req_id: 'REQ-EU-011',
      rule: 'GDPR Article 37',
      requirement: 'Data Protection Officer Designation',
      policy_says: 'The policy names a "Compliance Manager" but does not designate a DPO or describe DPO tasks.',
      gap: 'Given large-scale, systematic monitoring of customers, a DPO is likely required. No DPO is formally designated, and the Article 39 tasks and independence/reporting line are not described.',
      risk: 'Medium',
      recommendation:
        'Assess the Article 37 trigger; formally designate a DPO with documented tasks, resources, independence, and a direct reporting line to senior management.',
      status: 'in_progress',
      reviewed_by: 'demo-user',
      reviewed_at: '2026-05-02T10:15:00.000Z',
      reviewer_label: 'dpo@northwindpay.eu',
      review_note:
        'DPO appointment approved by the board on 1 May; candidate identified, formal designation and job description in progress.',
    },
    {
      id: 'REQ-EU-026',
      req_id: 'REQ-EU-026',
      rule: 'GDPR Article 9',
      requirement: 'Special Categories of Personal Data',
      policy_says: 'Not addressed.',
      gap: 'The firm collects identity documents that may reveal special-category data; the policy does not identify an Article 9(2) condition or additional safeguards for such processing.',
      risk: 'Medium',
      recommendation:
        'Determine whether special-category data is processed; if so, identify the Article 9(2) condition and apply additional safeguards, or implement controls to avoid collecting it.',
    },
    {
      id: 'REQ-EU-028',
      req_id: 'REQ-EU-028',
      rule: 'GDPR Articles 15 to 22',
      requirement: 'Data Subject Rights',
      policy_says: 'The privacy notice mentions customers "may contact us about their data," with no procedure.',
      gap: 'There is no procedure to handle data subject rights requests (access, rectification, erasure, portability, objection) within the one-month statutory timeframe, and no identity verification or logging process.',
      risk: 'Medium',
      recommendation:
        'Implement a data subject rights procedure with intake, identity verification, a one-month response SLA, and a request log.',
    },
    {
      id: 'REQ-EU-031',
      req_id: 'REQ-EU-031',
      rule: 'GDPR Article 30',
      requirement: 'Records of Processing Activities (ROPA)',
      policy_says: 'Not addressed.',
      gap: 'No Record of Processing Activities is maintained. The Article 30 record (purposes, categories, recipients, transfers, retention, security measures) does not exist.',
      risk: 'Medium',
      recommendation:
        'Create and maintain a ROPA covering all processing activities and make it available to the supervisory authority on request.',
    },
    {
      id: 'REQ-EU-032',
      req_id: 'REQ-EU-032',
      rule: 'GDPR Article 35',
      requirement: 'Data Protection Impact Assessment (DPIA)',
      policy_says: 'Not addressed.',
      gap: 'The firm performs automated transaction monitoring and profiling likely to be high risk, but no DPIA process exists and no DPIA has been conducted.',
      risk: 'Medium',
      recommendation:
        'Adopt a DPIA methodology and complete DPIAs for high-risk processing (e.g. profiling/monitoring), consulting the supervisory authority where residual high risk remains.',
    },
    {
      id: 'REQ-EU-029',
      req_id: 'REQ-EU-029',
      rule: 'GDPR Article 25',
      requirement: 'Data Protection by Design and by Default',
      policy_says: 'Not addressed.',
      gap: 'Data protection by design and by default is not embedded into product or system development; default settings are not assessed for data minimisation.',
      risk: 'Low',
      recommendation:
        'Introduce a privacy-by-design checkpoint into the product development lifecycle and review default settings to ensure only necessary data is processed.',
    },
    {
      id: 'REQ-EU-034',
      req_id: 'REQ-EU-034',
      rule: 'GDPR Article 5(1)(e)',
      requirement: 'Storage Limitation and Retention',
      policy_says: 'The policy states data is "kept only as long as necessary" without a schedule.',
      gap: 'No data retention schedule defines retention periods per data category, and there is no documented secure deletion/anonymisation process.',
      risk: 'Low',
      recommendation:
        'Publish a retention schedule mapping each data category to a retention period and a secure deletion or anonymisation procedure, balanced against AML record-keeping obligations.',
    },
  ],
  created_at: '2026-04-30T09:00:00.000Z',
}

export const GDPR_DEMO_V2: Audit = {
  id: 'demo-gdpr-v2',
  document_id: 'demo-gdpr-doc-v2',
  user_id: 'demo-user',
  jurisdiction: 'EU',
  framework: 'GDPR',
  firm_name: 'Northwind Payments Ltd',
  exec_summary:
    'Following remediation, Northwind Payments resubmitted its updated Data Protection Policy for a GDPR re-scan. Of the 13 gaps identified in the initial audit, 10 have been fully closed — including the lawful basis register, breach procedure, processor DPAs, ROPA, DPIA methodology, and DPO designation. Two High-risk findings (international transfers and processor terms) have been materially improved but are not yet fully closed, one Low-risk retention gap has been formally risk-accepted, and one new Low-risk gap was identified in the revised privacy notice. Overall compliance posture has risen from 40% to 90%.',
  total_gaps: 4,
  high_risk: 0,
  medium_risk: 1,
  low_risk: 3,
  scan_number: 2,
  parent_audit_id: 'demo-gdpr-v1',
  compliance_score: 90,
  requirements_total: 16,
  requirements_met: 12,
  gaps_closed: 10,
  gaps_new: 1,
  gaps_persisting: 3,
  strengths: [
    'Article 6 lawful basis register completed for all processing activities, with legitimate interests assessments retained',
    'Breach response procedure implemented with a 72-hour notification workflow and breach register (Articles 33–34)',
    'Record of Processing Activities (ROPA) created and maintained (Article 30)',
    'DPIA methodology adopted and a DPIA completed for transaction-monitoring profiling (Article 35)',
    'Data Protection Officer formally designated with defined tasks and a direct reporting line (Article 37)',
    'Data subject rights procedure implemented with a one-month response SLA and request log (Articles 15–22)',
  ],
  priority_actions: [
    'Finalise Standard Contractual Clauses and the transfer impact assessment for the US KYC provider to fully close the international transfers gap',
    'Execute the remaining sub-processor authorisations to complete the Article 28 processor framework',
    'Update the customer privacy notice to include the new retention periods and lawful basis details',
  ],
  findings: [
    {
      id: 'REQ-EU-033',
      req_id: 'REQ-EU-033',
      rule: 'GDPR Chapter V, Articles 44 to 49',
      requirement: 'International Transfers of Personal Data',
      policy_says:
        'The updated policy commits to Standard Contractual Clauses for non-EEA transfers and references an in-progress transfer impact assessment for the US KYC provider.',
      gap: 'SCCs are drafted but not yet executed with the US KYC provider, and the transfer impact assessment is not finalised. The transfer mechanism is materially improved but not yet complete.',
      risk: 'Medium',
      recommendation:
        'Execute the SCCs and finalise the transfer impact assessment, documenting any supplementary measures, to fully close this gap.',
    },
    {
      id: 'REQ-EU-030',
      req_id: 'REQ-EU-030',
      rule: 'GDPR Article 28',
      requirement: 'Processors and Data Processing Agreements',
      policy_says:
        'DPAs containing the Article 28(3) clauses are now executed with the cloud host and KYC vendor; a processor register is maintained.',
      gap: 'Primary processor DPAs are in place. A small number of sub-processor authorisations remain outstanding, leaving a minor residual gap.',
      risk: 'Low',
      recommendation:
        'Obtain and document the outstanding sub-processor authorisations to complete the processor framework.',
    },
    {
      id: 'REQ-EU-034',
      req_id: 'REQ-EU-034',
      rule: 'GDPR Article 5(1)(e)',
      requirement: 'Storage Limitation and Retention',
      policy_says:
        'A retention schedule is published; transaction records are retained for 5 years to satisfy AMLD record-keeping obligations.',
      gap: 'The 5-year retention of transaction data exceeds the minimum needed for the original processing purpose, but is required under AML legislation. Residual tension between storage limitation and AML retention.',
      risk: 'Low',
      recommendation:
        'Retain the AML-driven retention period and document the legal obligation as justification; review periodically.',
      status: 'risk_accepted',
      reviewed_by: 'demo-user',
      reviewed_at: '2026-05-28T14:20:00.000Z',
      reviewer_label: 'dpo@northwindpay.eu',
      review_note:
        'Risk accepted: the 5-year retention is mandated by the EU AML Directive (Art. 40). The legal obligation overrides storage-limitation minimisation; documented and approved by the DPO and Head of Compliance.',
    },
    {
      id: 'REQ-EU-027',
      req_id: 'REQ-EU-027',
      rule: 'GDPR Articles 12, 13 and 14',
      requirement: 'Transparency and Privacy Notices',
      policy_says:
        'The privacy notice was revised during remediation but the new retention periods and updated lawful basis details were not carried through.',
      gap: 'Newly identified: the revised privacy notice is now inconsistent with the updated retention schedule and lawful basis register, so the Article 13/14 information is incomplete.',
      risk: 'Low',
      recommendation:
        'Update the privacy notice to reflect the finalised retention periods and lawful basis register so the transparency information is accurate.',
    },
  ],
  created_at: '2026-05-29T09:00:00.000Z',
}
