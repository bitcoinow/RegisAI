import type { RegulatoryRequirement } from '@/types'

// 32 core requirements evaluated in every gap analysis.
// Add new requirements here; they are automatically included in the next analysis run.
export const REGULATORY_LIBRARY: RegulatoryRequirement[] = [
  // ── FINRA ─────────────────────────────────────────────────────────────────
  {
    id: 'REQ-001',
    rule: 'FINRA Rule 3110(a)',
    framework: 'FINRA',
    requirement: 'Supervisory System',
    description:
      'Each member shall establish and maintain a system to supervise the activities of each associated person that is reasonably designed to achieve compliance with applicable securities laws and regulations, and with applicable FINRA rules.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-002',
    rule: 'FINRA Rule 3110(b)',
    framework: 'FINRA',
    requirement: 'Written Supervisory Procedures (WSPs)',
    description:
      'Each member shall establish, maintain, and enforce written procedures to supervise the types of business in which it engages and the activities of its associated persons that are reasonably designed to achieve compliance with applicable securities laws and regulations.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-003',
    rule: 'FINRA Rule 3120',
    framework: 'FINRA',
    requirement: 'Supervisory Control System',
    description:
      'Each member shall designate and specifically identify to FINRA one or more principals who will be responsible for establishing, maintaining, and enforcing a system of supervisory control policies and procedures.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-004',
    rule: 'FINRA Rule 2010',
    framework: 'FINRA',
    requirement: 'Standards of Commercial Honor',
    description:
      'A member, in the conduct of its business, shall observe high standards of commercial honor and just and equitable principles of trade.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-005',
    rule: 'FINRA Rule 2111',
    framework: 'FINRA',
    requirement: 'Suitability',
    description:
      "A member or an associated person must have a reasonable basis to believe that a recommended transaction or investment strategy involving a security or securities is suitable for the customer, based on the information obtained through the reasonable diligence of the member or associated person to ascertain the customer's investment profile.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-006',
    rule: 'FINRA Rule 4511',
    framework: 'FINRA',
    requirement: 'Books and Records — General',
    description:
      'Each member shall make and preserve books and records as required under the FINRA rules, the Exchange Act and the applicable Exchange Act rules.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-007',
    rule: 'FINRA Rule 3310',
    framework: 'FINRA',
    requirement: 'Anti-Money Laundering Compliance Program',
    description:
      'Each member shall develop and implement a written anti-money laundering program reasonably designed to achieve and monitor the member\'s compliance with the requirements of the Bank Secrecy Act and the implementing regulations promulgated thereunder.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-008',
    rule: 'FINRA Rule 3130',
    framework: 'FINRA',
    requirement: 'Annual Certification of Compliance',
    description:
      'Each member shall designate and specifically identify to FINRA one or more principals who certify annually that the member has in place processes to establish, maintain, review, test, and modify written compliance policies and written supervisory procedures.',
    defaultRisk: 'Medium',
  },
  // ── SEC ───────────────────────────────────────────────────────────────────
  {
    id: 'REQ-009',
    rule: 'SEC Rule 17a-3',
    framework: 'SEC',
    requirement: 'Books and Records — Required Records',
    description:
      'Every registered broker-dealer shall make and keep current specified books and records including blotters, ledgers, order tickets, confirmations, and customer account records.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-010',
    rule: 'SEC Rule 17a-4',
    framework: 'SEC',
    requirement: 'Books and Records — Retention',
    description:
      'Every registered broker-dealer shall preserve for specified periods all books and records required to be made pursuant to Rule 17a-3, with certain records preserved for six years and others for three years.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-011',
    rule: 'SEC Regulation S-P',
    framework: 'SEC',
    requirement: 'Privacy of Consumer Financial Information',
    description:
      'Financial institutions must provide clear and conspicuous notice of their privacy policies and practices to customers, must allow customers to opt out of having their information shared with nonaffiliated third parties, and must implement safeguards to protect customer records and information.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-012',
    rule: 'SEC Rule 206(4)-7',
    framework: 'SEC',
    requirement: 'Investment Adviser Compliance Programs',
    description:
      'Each investment adviser registered with the SEC shall adopt and implement written policies and procedures reasonably designed to prevent violations of the Investment Advisers Act and rules thereunder, review those policies and procedures at least annually, and designate a Chief Compliance Officer.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-013',
    rule: 'SEC Rule 204A-1',
    framework: 'SEC',
    requirement: 'Investment Adviser Codes of Ethics',
    description:
      'Each investment adviser registered or required to be registered with the SEC shall establish, maintain, and enforce a written code of ethics that sets standards of business conduct required of supervised persons and addresses personal securities trading.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-014',
    rule: 'SEC Regulation S-ID',
    framework: 'SEC',
    requirement: 'Identity Theft Red Flags',
    description:
      'Financial institutions and creditors that offer or maintain covered accounts must develop and implement a written Identity Theft Prevention Program to detect, prevent, and mitigate identity theft.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-015',
    rule: 'SEC Rule 15c3-3',
    framework: 'SEC',
    requirement: 'Customer Protection — Reserves and Custody',
    description:
      'Every broker-dealer shall promptly obtain and shall thereafter maintain the physical possession or control of all fully-paid securities and excess margin securities carried by such broker-dealer for the account of customers.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-016',
    rule: 'SEC Rule 206(4)-2',
    framework: 'SEC',
    requirement: 'Custody of Client Funds and Securities',
    description:
      'It is unlawful for any investment adviser registered or required to be registered with the SEC to have custody of client funds or securities unless the adviser maintains those assets with a qualified custodian and satisfies specific notification and verification requirements.',
    defaultRisk: 'High',
  },
  // ── AML / BSA ─────────────────────────────────────────────────────────────
  {
    id: 'REQ-017',
    rule: 'BSA 31 CFR 1020.210',
    framework: 'AML',
    requirement: 'AML Program — Written Procedures',
    description:
      'Financial institutions must establish and implement a written anti-money laundering program that is reasonably designed to assure and monitor compliance with the Bank Secrecy Act, including policies, procedures, and internal controls.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-018',
    rule: 'FinCEN 31 CFR 1020.220',
    framework: 'AML',
    requirement: 'Customer Identification Program (CIP)',
    description:
      'Financial institutions must implement a written Customer Identification Program (CIP) that includes procedures for collecting minimum identifying information, verifying customer identity, maintaining records, and checking customers against government lists.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-019',
    rule: 'FinCEN 31 CFR 1010.610',
    framework: 'AML',
    requirement: 'Customer Due Diligence (CDD)',
    description:
      'Financial institutions must have written CDD procedures to identify and verify beneficial owners of legal entity customers, understand the nature and purpose of customer relationships, and conduct ongoing monitoring to identify and report suspicious transactions.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-020',
    rule: 'FinCEN 31 CFR 1020.320',
    framework: 'AML',
    requirement: 'Suspicious Activity Reports (SARs)',
    description:
      'Financial institutions shall file a Suspicious Activity Report no later than 30 calendar days after the date of initial detection of facts that may constitute a basis for filing a SAR when a transaction involves funds of $5,000 or more and the institution knows, suspects, or has reason to suspect it involves illicit activity.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-021',
    rule: 'BSA 31 CFR 1010.311',
    framework: 'AML',
    requirement: 'Currency Transaction Reports (CTRs)',
    description:
      'Financial institutions must file a Currency Transaction Report (FinCEN Form 112) for each currency transaction in excess of $10,000 and must aggregate multiple same-day transactions by or for the same person.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-022',
    rule: 'OFAC 31 CFR Chapter V',
    framework: 'AML',
    requirement: 'Sanctions Screening Program',
    description:
      'Financial institutions must maintain a compliance program to screen customers, transactions, and counterparties against OFAC Specially Designated Nationals (SDN) and other sanction lists, and must have procedures for blocking or rejecting prohibited transactions.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-023',
    rule: 'FinCEN 31 CFR 1010.415',
    framework: 'AML',
    requirement: 'Beneficial Ownership — Legal Entity Customers',
    description:
      'Financial institutions must collect and verify the identity of beneficial owners of legal entity customers at account opening, including the identity of any individual who owns 25% or more equity interest and one individual who controls the entity.',
    defaultRisk: 'High',
  },
  // ── Reg BI ────────────────────────────────────────────────────────────────
  {
    id: 'REQ-024',
    rule: 'SEC Reg BI — Rule 15l-1(a)(1)',
    framework: 'RegBI',
    requirement: 'Best Interest Obligation',
    description:
      'A broker, dealer, or a natural person associated with a broker or dealer, when making a recommendation of any securities transaction or investment strategy involving securities to a retail customer, shall act in the best interest of the retail customer at the time the recommendation is made.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-025',
    rule: 'SEC Reg BI — Form CRS',
    framework: 'RegBI',
    requirement: 'Disclosure Obligation — Form CRS',
    description:
      'Broker-dealers and investment advisers must deliver a Client Relationship Summary (Form CRS) to retail investors at the beginning of the relationship and when certain changes occur, describing services offered, fees, conflicts of interest, disciplinary history, and how to obtain additional information.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-026',
    rule: 'SEC Reg BI — Rule 15l-1(a)(2)(iii)',
    framework: 'RegBI',
    requirement: 'Conflict of Interest Obligation',
    description:
      'Broker-dealers must establish, maintain, and enforce written policies and procedures reasonably designed to identify all conflicts of interest associated with their recommendations to retail customers and to disclose or eliminate those conflicts.',
    defaultRisk: 'High',
  },
  {
    id: 'REQ-027',
    rule: 'SEC Reg BI — Rule 15l-1(a)(2)(iv)',
    framework: 'RegBI',
    requirement: 'Compliance Obligation',
    description:
      'Broker-dealers must establish, maintain, and enforce written policies and procedures reasonably designed to achieve compliance with Regulation Best Interest.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-028',
    rule: 'Advisers Act Section 206',
    framework: 'RegBI',
    requirement: 'Fiduciary Duty',
    description:
      'Investment advisers owe their clients a fiduciary duty, which requires the adviser to act in the client\'s best interest, make full and fair disclosure of all material facts, and eliminate or disclose all conflicts of interest that might affect the advisory relationship.',
    defaultRisk: 'High',
  },
  // ── BCP / Operational ─────────────────────────────────────────────────────
  {
    id: 'REQ-029',
    rule: 'FINRA Rule 4370',
    framework: 'BCP',
    requirement: 'Business Continuity Plan (BCP)',
    description:
      'Each member must create and maintain a written business continuity plan identifying procedures relating to an emergency or significant business disruption, including data backup and recovery, mission critical systems, financial and operational assessments, alternate communications, and regulatory reporting.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-030',
    rule: 'SEC Rule 206(4)-7',
    framework: 'BCP',
    requirement: 'Annual Compliance Review',
    description:
      'Each investment adviser must review its compliance policies and procedures at least annually to assess the adequacy of the policies and procedures and the effectiveness of their implementation.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-031',
    rule: 'FINRA Rule 3110(c)',
    framework: 'BCP',
    requirement: 'Internal Inspections',
    description:
      'Each member shall conduct a review, at least annually, of the businesses in which it engages. The review must be reasonably designed to assist in detecting and preventing violations of and achieving compliance with applicable securities laws and regulations.',
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-032',
    rule: 'SEC Regulation S-P Rule 30',
    framework: 'BCP',
    requirement: 'Incident Response Plan',
    description:
      'Financial institutions must have written policies and procedures that address administrative, technical, and physical safeguards for the protection of customer records and information, including procedures for responding to security incidents that result in unauthorized access to customer information.',
    defaultRisk: 'High',
  },
  // ── FINRA (additional) ────────────────────────────────────────────────────
  {
    id: 'REQ-033',
    rule: 'FINRA Rule 2111',
    framework: 'FINRA',
    requirement: 'Suitability — Know Your Customer Obligations',
    description:
      "Under FINRA Rule 2111, members must exercise reasonable diligence to ascertain each customer's investment profile before making a suitability determination. The required profile includes financial situation and needs, tax status, investment objectives, investment experience, investment time horizon, liquidity needs, risk tolerance, and any other information the customer may disclose. Profile information must be documented at account opening and updated as material changes occur.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-034',
    rule: 'FINRA Rule 3310',
    framework: 'FINRA',
    requirement: 'AML Compliance Program — Independent Testing',
    description:
      "FINRA Rule 3310(c) requires each member's AML program to include independent testing for compliance, no less than annually (or more frequently for higher-risk firms). Testing may be performed by member personnel or qualified outside parties not responsible for implementing the AML program. The rule also requires designating a qualified AML compliance officer responsible for overseeing the program and ensuring timely SAR filing with FinCEN.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-035',
    rule: 'FINRA Rule 4370',
    framework: 'FINRA',
    requirement: 'Business Continuity Plan — Emergency Contact and Customer Disclosure',
    description:
      "FINRA Rule 4370(e) requires each member to disclose to customers, at account opening and on the member's website, how to contact the firm or a key person in the event of a significant business disruption if the firm is unable to continue operations. Members must also provide FINRA with emergency contact information for one or more principals. The BCP must be approved in writing by a senior manager and reviewed annually to ensure it remains current.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-036',
    rule: 'FINRA Rule 2210',
    framework: 'FINRA',
    requirement: 'Communications with the Public — Standards and Principal Approval',
    description:
      "FINRA Rule 2210 establishes content standards and approval requirements for three categories of member communications: retail communications, correspondence, and institutional communications. All communications must be fair and balanced, not omit material information, and not contain false or misleading statements. Retail communications must receive prior written principal approval before first use, and specified types (e.g., investment company advertising) must be filed with FINRA's Advertising Regulation Department within 10 business days of first use.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-037',
    rule: 'FINRA Rule 3270',
    framework: 'FINRA',
    requirement: 'Outside Business Activities of Registered Persons',
    description:
      "FINRA Rule 3270 requires registered persons to provide prior written notice to their employing member before engaging in any outside business activity (OBA) for compensation. The member must evaluate the notice and, where warranted, record the activity, supervise the individual's conduct, and ensure the OBA is not in conflict with or disadvantageous to customers' interests. Members must maintain records of all disclosed OBAs and have written supervisory procedures to detect and manage related conflicts of interest.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-038',
    rule: 'FINRA Rule 5310',
    framework: 'FINRA',
    requirement: 'Best Execution — Most Favorable Terms',
    description:
      "FINRA Rule 5310 requires members to use reasonable diligence to ascertain the best market for a security and buy or sell in that market so that the resultant price to the customer is as favorable as possible under prevailing market conditions. Members must periodically review execution quality to evaluate whether order flow arrangements are consistent with best execution. Relevant factors include price improvement opportunities, likelihood of execution, market impact, transaction costs, and speed of execution.",
    defaultRisk: 'High',
  },
  // ── SEC (additional) ──────────────────────────────────────────────────────
  {
    id: 'REQ-039',
    rule: 'SEC Rule 206(4)-7',
    framework: 'SEC',
    requirement: 'Compliance Programs — CCO Designation and Annual Review',
    description:
      "SEC Rule 206(4)-7 requires each registered investment adviser to designate a Chief Compliance Officer (CCO) who is competent and knowledgeable regarding the Advisers Act and is empowered with full responsibility and authority to develop and enforce the compliance program. The CCO must report to senior management and conduct (or oversee) at least an annual review of the adequacy of the compliance policies and procedures and the effectiveness of their implementation, with findings documented for the adviser's records.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-040',
    rule: 'SEC Rule 17a-4',
    framework: 'SEC',
    requirement: 'Books and Records Preservation — WORM Storage and Accessibility',
    description:
      "SEC Rule 17a-4 requires broker-dealers to preserve required books and records for specified periods — six years for most records, three years for others — with the first two years in an easily accessible location. Electronic records must be stored in a non-rewriteable, non-erasable (WORM) format with third-party access arrangements. The rule also requires that all electronic records include a means to verify file integrity and be downloadable in human-readable format for examination by regulators within 24 hours of request.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-041',
    rule: 'SEC Rule 206(4)-2',
    framework: 'SEC',
    requirement: 'Custody Rule — Qualified Custodian and Surprise Examination',
    description:
      "SEC Rule 206(4)-2 (Custody Rule) requires registered investment advisers that have custody of client funds or securities to maintain those assets with a qualified custodian (e.g., a bank or registered broker-dealer), send quarterly account statements directly to clients, and undergo a surprise examination by an independent PCAOB-registered public accountant at least annually to verify client assets. Advisers who rely on the audit exception must deliver audited financial statements to clients within 120 days of fiscal year end.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-042',
    rule: 'SEC Rule 206(4)-1',
    framework: 'SEC',
    requirement: 'Marketing Rule — Testimonials, Endorsements, and Performance Advertising',
    description:
      "SEC Rule 206(4)-1 (the Marketing Rule, effective May 4, 2021) modernises advertising requirements for investment advisers, prohibiting materially false or misleading statements, untrue statements of material fact, cherry-picked performance results, and testimonials or endorsements without the required compensation and conflict-of-interest disclosures. Performance advertising must include relevant time periods and net-of-fee figures. Advisers must adopt compliance policies addressing the rule and retain all advertisements for at least five years.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-043',
    rule: 'SEC Regulation S-ID',
    framework: 'SEC',
    requirement: 'Identity Theft Red Flags — Prevention Program',
    description:
      "SEC Regulation S-ID (17 CFR Part 248, Subpart C) requires financial institutions and creditors that maintain covered accounts (including brokerage and investment advisory accounts) to develop, implement, and administer a written Identity Theft Prevention Program. The program must include policies to identify relevant red flags, detect and respond to those red flags, and update the program periodically to reflect changes in risks. The program must be approved by the board of directors and subject to senior management oversight and annual reporting.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-044',
    rule: 'SEC Form ADV Parts 1 and 2',
    framework: 'SEC',
    requirement: 'Disclosure Brochure — Form ADV Delivery Requirements',
    description:
      "SEC Form ADV requires registered investment advisers to file and annually update Part 1 (business and ownership information) and deliver Part 2A (the brochure, disclosing services, fees, conflicts, and disciplinary history) and Part 2B (the brochure supplement for supervised persons) to each client. Advisers must deliver the brochure to prospective clients before or at the time of entering into an advisory contract, and must offer an updated brochure or a summary of material changes to existing clients within 120 days after fiscal year end.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-045',
    rule: 'SEC Rule 206(4)-6',
    framework: 'SEC',
    requirement: 'Proxy Voting — Policies, Procedures, and Disclosure',
    description:
      "SEC Rule 206(4)-6 requires each registered investment adviser that exercises voting authority over client securities to adopt and implement written proxy voting policies and procedures reasonably designed to ensure votes are cast in clients' best interests. Advisers must disclose to clients how they may obtain information about how their proxies were voted, and must describe the proxy voting policies to clients. Where conflicts of interest exist between the adviser's interests and the client's, the procedures must ensure votes are cast in the client's best interest.",
    defaultRisk: 'Low',
  },
  // ── AML (additional) ─────────────────────────────────────────────────────
  {
    id: 'REQ-046',
    rule: '31 CFR 1023.320',
    framework: 'AML',
    requirement: 'SAR Filing Requirements — Broker-Dealers',
    description:
      "Under 31 CFR 1023.320, broker-dealers must file a Suspicious Activity Report (FinCEN Form SAR) within 30 calendar days of initial detection of a known or suspected violation involving $5,000 or more in funds or assets. Where no suspect can be identified, the filing period extends to 60 days. SARs must not be disclosed to the subject of the report (the 'tipping off' prohibition). Broker-dealers must retain copies of all filed SARs and supporting documentation for five years from the date of filing.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-047',
    rule: '31 CFR 1010.311',
    framework: 'AML',
    requirement: 'Currency Transaction Reports (CTR) — Filing and Aggregation',
    description:
      "Under 31 CFR 1010.311, financial institutions must file a Currency Transaction Report (FinCEN Form 112) for each transaction in currency exceeding $10,000 conducted by, through, or to the institution. Multiple currency transactions by the same person on the same business day must be aggregated and treated as a single transaction. CTRs must be filed within 15 calendar days after the date of the transaction. Institutions must maintain copies of all CTRs and supporting documentation for five years.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-048',
    rule: 'OFAC 31 CFR Chapter V',
    framework: 'AML',
    requirement: 'OFAC Sanctions Screening — SDN List and Blocked Property',
    description:
      "Financial institutions must screen all customers, transactions, and counterparties against OFAC's Specially Designated Nationals and Blocked Persons (SDN) List and Consolidated Sanctions List in real time before executing transactions. Transactions involving SDNs or sanctioned countries must be blocked or rejected and reported to OFAC within 10 business days of blocking. Institutions must maintain a risk-based sanctions compliance program with documented policies, periodic screening of existing customers, and training for relevant personnel.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-049',
    rule: '31 CFR 1010.230',
    framework: 'AML',
    requirement: 'Beneficial Ownership / CDD Rule — Legal Entity Customers',
    description:
      "FinCEN's Customer Due Diligence (CDD) Rule under 31 CFR 1010.230 requires covered financial institutions to identify and verify the beneficial owners of legal entity customers at account opening. Beneficial ownership includes each individual who owns 25% or more of the equity interests of the entity (ownership prong) and one individual with significant responsibility for controlling, managing, or directing the entity (control prong). Institutions must obtain a certification form from the customer and maintain records for five years after account closure.",
    defaultRisk: 'High',
  },
  // ── SOX ──────────────────────────────────────────────────────────────────
  {
    id: 'REQ-050',
    rule: 'SOX Section 404',
    framework: 'SOX',
    requirement: 'Internal Controls over Financial Reporting (ICFR)',
    description:
      "Sarbanes-Oxley Act Section 404 requires management of public companies to include in each annual report an internal control report that states management's responsibility for establishing adequate internal controls over financial reporting (ICFR) and provides an assessment of ICFR effectiveness as of fiscal year end using a recognised framework (e.g., COSO). For accelerated filers, an independent registered public accounting firm must also attest to and report on management's ICFR assessment. All identified material weaknesses must be disclosed.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-051',
    rule: 'SOX Sections 302 and 906',
    framework: 'SOX',
    requirement: 'CEO/CFO Certification of Financial Reports',
    description:
      "SOX Section 302 requires the CEO and CFO to certify in each annual (10-K) and quarterly (10-Q) SEC report that they have reviewed the filing, it contains no material misstatements or omissions, and they are responsible for establishing and maintaining disclosure controls and procedures. Section 906 imposes a separate criminal certification that the report fairly presents the financial condition and results of operations. Knowingly false Section 302 certifications carry penalties of up to $1M and 10 years imprisonment; wilful violations of Section 906 carry up to $5M and 20 years.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-052',
    rule: 'SOX Section 301',
    framework: 'SOX',
    requirement: 'Audit Committee Independence and Financial Expert Disclosure',
    description:
      "SOX Section 301 requires listed company audit committees to consist entirely of independent directors who do not accept consulting, advisory, or compensatory fees from the company. The audit committee must be directly responsible for the appointment, compensation, and oversight of the work of the external auditor, must establish procedures for handling employee accounting complaints (including anonymous submissions), and must have authority to engage independent counsel. Companies must disclose whether a 'financial expert' sits on the audit committee.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-053',
    rule: 'SOX Section 806',
    framework: 'SOX',
    requirement: 'Whistleblower Protection — Anti-Retaliation',
    description:
      "SOX Section 806 prohibits publicly traded companies, their subsidiaries, and contractors from discharging, demoting, suspending, threatening, harassing, or otherwise discriminating against employees who lawfully report suspected securities fraud, mail fraud, wire fraud, bank fraud, or violations of SEC rules to a supervisor, the SEC, federal regulators, Congress, or law enforcement, or who participate in such proceedings. Employees alleging retaliation may file complaints with OSHA within 180 days and seek reinstatement, back pay, and special damages.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-054',
    rule: 'SOX Section 802',
    framework: 'SOX',
    requirement: 'Document Retention and Anti-Destruction',
    description:
      "SOX Section 802 makes it a federal crime knowingly to alter, destroy, mutilate, conceal, cover up, falsify, or make a false entry in any record, document, or tangible object with intent to impede a federal investigation or in contemplation of a federal proceeding. It mandates that auditors retain all audit or review work papers for five years from the end of the fiscal period of the engagement. Companies must implement and enforce records retention policies, ensure litigation holds are triggered promptly, and prohibit premature destruction of records that may be relevant to investigations.",
    defaultRisk: 'High',
  },
  // ── CCPA ─────────────────────────────────────────────────────────────────
  {
    id: 'REQ-055',
    rule: 'CCPA Cal. Civ. Code §1798.100',
    framework: 'CCPA',
    requirement: 'Consumer Right to Know About Personal Information',
    description:
      "California Consumer Privacy Act §1798.100 grants California consumers the right to request that a business disclose the categories and specific pieces of personal information it has collected about them, the categories of sources from which the information was collected, the business or commercial purpose for collecting or selling the information, and the categories of third parties with whom the information is shared or sold. Businesses must respond to verifiable consumer requests within 45 days (extendable by 45 additional days with notice) and must provide two or more methods for submitting requests.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-056',
    rule: 'CCPA Cal. Civ. Code §1798.105',
    framework: 'CCPA',
    requirement: 'Right to Delete Personal Information',
    description:
      "CCPA §1798.105 grants consumers the right to request deletion of personal information a business has collected from them. Upon receiving a verifiable request, the business must delete the information from its records and direct service providers to delete it as well, unless an exception applies — such as completing a transaction, detecting security incidents, complying with a legal obligation, or exercising free speech. Businesses must respond within 45 days and must explain any denial with reference to a specific exception.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-057',
    rule: 'CCPA Cal. Civ. Code §1798.120',
    framework: 'CCPA',
    requirement: 'Right to Opt-Out of Sale and Sharing of Personal Information',
    description:
      "CCPA §1798.120 (as amended by CPRA effective January 1, 2023) gives consumers the right to direct a business to stop selling or sharing their personal information to or with third parties, including for cross-context behavioral advertising. Businesses must post a clear 'Do Not Sell or Share My Personal Information' link on their homepage and in their privacy notice. Once a consumer opts out, the business must wait at least 12 months before requesting opt-in authorisation. Businesses must honour opt-out signals from recognised platforms.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-058',
    rule: 'CPRA amendments to CCPA (Cal. Civ. Code §1798.100(a)(3))',
    framework: 'CCPA',
    requirement: 'Data Minimisation and Purpose Limitation',
    description:
      "The California Privacy Rights Act (CPRA), amending the CCPA effective January 1, 2023, introduces explicit data minimization and purpose limitation requirements. Businesses may only collect personal information that is reasonably necessary and proportionate to the purposes disclosed to the consumer at the time of collection. Collection, use, retention, and sharing must not extend to incompatible secondary purposes. Sensitive personal information — including financial data, precise geolocation, and health information — is subject to heightened restrictions, and consumers may limit its use and disclosure.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-059',
    rule: 'CCPA Cal. Civ. Code §1798.130',
    framework: 'CCPA',
    requirement: 'Privacy Notice at Collection and Annual Privacy Policy',
    description:
      "CCPA §1798.130 requires businesses to provide consumers with a conspicuous privacy notice at or before the point of personal information collection, disclosing the categories of information to be collected and the purposes for which each category will be used. The annual privacy policy must describe the categories of personal information collected, sold, or disclosed; consumer rights under the CCPA; and methods for submitting requests. The policy must be posted prominently online and updated at least once every 12 months, reflecting any material changes.",
    defaultRisk: 'Medium',
  },
  // ── NIST ─────────────────────────────────────────────────────────────────
  {
    id: 'REQ-060',
    rule: 'NIST CSF 2.0 — ID.AM / ID.RA',
    framework: 'NIST',
    requirement: 'Identify — Asset Management and Risk Assessment',
    description:
      "The NIST Cybersecurity Framework (CSF) 2.0 Identify function requires organisations to understand their cybersecurity context, resources, and risks. ID.AM requires maintaining an up-to-date inventory of hardware assets, software platforms, data flows, and external systems, and classifying assets by criticality and business value. ID.RA requires conducting risk assessments to identify threats and vulnerabilities, estimating likelihood and impact, and documenting risk responses. Risk assessments must be updated at least annually and after material changes to the environment.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-061',
    rule: 'NIST CSF 2.0 — PR.AC / PR.DS',
    framework: 'NIST',
    requirement: 'Protect — Access Control and Data Security',
    description:
      "The NIST CSF 2.0 Protect function's PR.AC category requires managing identities and credentials with least-privilege principles, implementing multi-factor authentication for privileged accounts and remote access, and promptly revoking access upon role change or termination. PR.DS requires protecting data at rest and in transit through encryption appropriate to the classification level, implementing data loss prevention controls, maintaining tested backups, and establishing integrity verification mechanisms to detect unauthorised modification of software, firmware, and information.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-062',
    rule: 'NIST CSF 2.0 — DE.AE / DE.CM',
    framework: 'NIST',
    requirement: 'Detect — Anomalies and Continuous Monitoring',
    description:
      "The NIST CSF 2.0 Detect function requires organisations to develop and implement activities to identify cybersecurity events. DE.AE requires establishing baselines of normal operations and data flows, correlating event data from multiple sources, and determining the impact of detected events. DE.CM requires continuous monitoring of networks, physical environments, personnel activity, and external service providers to detect potential cybersecurity events, including monitoring for malware, unauthorised connections, and anomalous user activity through SIEM or equivalent tooling.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-063',
    rule: 'NIST CSF 2.0 — RS.RP',
    framework: 'NIST',
    requirement: 'Respond — Incident Response Planning and Execution',
    description:
      "The NIST CSF 2.0 Respond function's RS.RP category requires organisations to develop, maintain, and exercise an incident response plan that defines roles and responsibilities, communication protocols (including regulatory notification timelines), escalation criteria, and containment and eradication procedures. Response plans must address the full incident lifecycle — preparation, detection, analysis, containment, eradication, recovery, and post-incident review. Plans must be tested through tabletop exercises or live drills at least annually and updated to reflect lessons learned.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-064',
    rule: 'NIST CSF 2.0 — RC.RP / RC.CO',
    framework: 'NIST',
    requirement: 'Recover — Recovery Planning and Stakeholder Communications',
    description:
      "The NIST CSF 2.0 Recover function requires organisations to restore capabilities and services impaired by a cybersecurity incident. RC.RP requires maintaining and testing a recovery plan that defines recovery time objectives (RTO) and recovery point objectives (RPO), prioritises critical systems, and outlines procedures for restoring systems and data from verified backups. RC.CO requires coordinating restoration activities with internal stakeholders, service providers, and — where applicable under SEC Reg S-P or other rules — communicating incident details to affected customers and regulators within required timeframes.",
    defaultRisk: 'Medium',
  },
  // ── Reg BI (additional) ───────────────────────────────────────────────────
  {
    id: 'REQ-065',
    rule: 'SEC Reg BI — Form CRS (17 CFR 249.640)',
    framework: 'RegBI',
    requirement: 'Disclosure Obligation — Form CRS Relationship Summary',
    description:
      "Under Regulation Best Interest, broker-dealers and investment advisers must prepare and file a Client Relationship Summary (Form CRS) with the SEC and deliver it to retail investors at the commencement of the relationship. Form CRS must describe in plain English the types of services offered, the fees and costs associated with those services, conflicts of interest, the legal standard of conduct applicable to the relationship, and any reportable disciplinary history. Updates reflecting material changes must be filed and delivered to existing retail customers within 30 days of the change.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-066',
    rule: 'SEC Reg BI — Rule 15l-1(a)(2)(ii)',
    framework: 'RegBI',
    requirement: 'Care Obligation — Reasonable Diligence and Best-Interest Basis',
    description:
      "Reg BI's Care Obligation requires broker-dealers to exercise reasonable diligence, care, and skill when making a recommendation to a retail customer. This means understanding the potential risks, rewards, and costs of the recommended security or strategy; having a reasonable basis to believe the recommendation is in the retail customer's best interest given their investment profile; and considering reasonably available alternatives offered by the firm. The obligation applies at the time the recommendation is made and requires documentation sufficient to demonstrate the basis for the recommendation.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-067',
    rule: 'SEC Reg BI — Rule 15l-1(a)(2)(iii)',
    framework: 'RegBI',
    requirement: 'Conflict of Interest Obligation — Identification and Mitigation',
    description:
      "Reg BI's Conflict of Interest Obligation requires broker-dealers to establish, maintain, and enforce written policies and procedures to identify all conflicts of interest associated with recommendations to retail customers, and to mitigate conflicts that create an incentive to place the firm's or associated person's interests ahead of the retail customer's interest. Conflicts that cannot be adequately managed must be eliminated. Specific areas addressed include differential compensation, sales contests tied to specific securities or types of securities, and differential marketing support from product manufacturers.",
    defaultRisk: 'High',
  },
  // ── BCP (additional) ─────────────────────────────────────────────────────
  {
    id: 'REQ-068',
    rule: 'FINRA Rule 4370 / SEC IM Guidance Update 2020-02',
    framework: 'BCP',
    requirement: 'Pandemic and Large-Scale Disruption Planning',
    description:
      "FINRA Rule 4370 and SEC Investment Management Guidance Update 2020-02 require financial firms to address large-scale geographic or pandemic-level scenarios in their BCPs, including provisions for remote work capability, dispersal of critical personnel and functions across geographies, extended disruption duration, and communication protocols for clients, vendors, and regulators when normal channels are unavailable. BCPs must be tested annually under pandemic-style assumptions, and findings must be used to update the plan and address identified gaps.",
    defaultRisk: 'Medium',
  },
  {
    id: 'REQ-069',
    rule: 'SEC Rule 206(4)-7 / FINRA Regulatory Notice 11-26',
    framework: 'BCP',
    requirement: 'Cybersecurity Incident Response Plan',
    description:
      "SEC Rule 206(4)-7 and FINRA Regulatory Notice 11-26 require financial firms to develop, maintain, and test a written cybersecurity incident response plan as a component of their compliance and operational resilience programs. The plan must define incident identification and triage procedures, assign response roles and escalation paths, specify regulatory and customer notification timelines (including obligations under SEC Regulation S-P and any applicable state breach notification laws), and require post-incident reviews to identify control improvements. Plans must be tested at least annually.",
    defaultRisk: 'High',
  },
  {
    id: 'REQ-070',
    rule: 'SEC Examination Priorities / FINRA Regulatory Notice 08-19',
    framework: 'BCP',
    requirement: 'Vendor and Third-Party Risk Management',
    description:
      "SEC examination priorities and FINRA Regulatory Notice 08-19 require financial firms to conduct risk-based due diligence on third-party service providers that access customer data, perform critical business functions, or provide key technology infrastructure. Due diligence must occur before engagement and be refreshed periodically. Contracts must include provisions for data security standards, incident notification, right-to-audit, and business continuity requirements. Firms must maintain a vendor inventory, track concentration risk, and have contingency plans to manage vendor failures or terminations without disruption to client services.",
    defaultRisk: 'Medium',
  },
]

export function getRequirementById(id: string): RegulatoryRequirement | undefined {
  return REGULATORY_LIBRARY.find((req) => req.id === id)
}

export function getRequirementsByFramework(
  framework: RegulatoryRequirement['framework']
): RegulatoryRequirement[] {
  return REGULATORY_LIBRARY.filter((req) => req.framework === framework)
}
