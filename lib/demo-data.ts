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
