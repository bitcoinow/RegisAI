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
]

export function getRequirementById(id: string): RegulatoryRequirement | undefined {
  return REGULATORY_LIBRARY.find((req) => req.id === id)
}

export function getRequirementsByFramework(
  framework: RegulatoryRequirement['framework']
): RegulatoryRequirement[] {
  return REGULATORY_LIBRARY.filter((req) => req.framework === framework)
}
