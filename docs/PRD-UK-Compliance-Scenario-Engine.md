Product Requirements Document

Regis AI — UK Compliance Scenario & Policy Risk

Engine

1. Product Name

Regis AI Compliance Platform

Initial MVP module:

UK Compliance Scenario & Policy Risk Engine

2. Product Vision

Regis AI is a specialist AI-powered compliance intelligence platform that helps organisations assess real-

world compliance risks, review internal policies, monitor regulatory obligations, and produce

structured, audit-ready risk guidance with human oversight.

The platform is designed to support compliance teams, legal teams, risk teams, governance

professionals, and business leaders who need to interpret complex or grey-area compliance scenarios.

Regis AI should not operate as a general chatbot or replace legal/compliance professionals. It should

act as a structured compliance decision-support tool that reduces manual workload, improves

consistency, and helps organisations identify risk earlier.

3. Strategic Positioning

Regis AI should be positioned as:

“The specialist compliance intelligence layer for grey-area risk assessment, policy review,

governance dashboards, and audit-ready decision support.”

Regis should not compete directly with Microsoft Copilot or generic AI assistants.

Instead, Regis should become the compliance-focused layer that adds:

•

Structured risk assessment

•

Compliance-specific workflows

•

Policy-to-legislation gap analysis

•

Human review and approval

•

Audit trail

•

Risk scoring

1

•

Dashboard reporting

•

Industry-specific compliance interpretation

Generic AI tools can generate text. Regis AI should generate structured compliance assessments, risk

insights, and decision-ready outputs.

4. Problem Statement

Compliance teams regularly deal with practical business scenarios that are not clearly answered by

policy documents or legislation alone.

Examples include:

•

A client offering monthly hospitality or gifts

•

A team taking a prospective client to dinner during a pitch process

•

A vendor being linked to a sanctioned country or sanctioned individual

•

A policy being outdated against new legislation

•

A company operating in the UK but also being exposed to EU or US rules

•

A contract containing unclear compliance obligations

•

A business unit asking whether an activity is acceptable, risky, or requires escalation

These situations are often grey areas. Compliance officers must manually assess the risk, interpret

relevant policies, review legislation, ask follow-up questions, draft guidance, and escalate where

needed.

This process is time-consuming, inconsistent, and difficult to scale.

Regis AI should solve this by giving compliance teams a structured first draft of the risk analysis,

including risk areas, applicable policy themes, recommended questions, evidence requirements,

escalation guidance, and human review workflow.

5. Target Users

5.1 Primary Users

Compliance Officers

Users responsible for reviewing business scenarios, policies, controls, and regulatory obligations.

Key needs:

•

Save time on initial compliance assessments

•

Identify risk areas quickly

•

Produce consistent guidance

•

Maintain audit-ready records

•

Escalate high-risk cases appropriately

2

Legal and Risk Teams

Users responsible for reviewing contracts, regulatory exposure, sanctions concerns, governance issues,

and risk decisions.

Key needs:

•

Understand regulatory exposure

•

Identify legal and compliance risks

•

Track decisions

•

Review complex scenarios

•

Support internal advisory work

Governance and Operations Teams

Users responsible for ensuring internal policies, systems, processes, and procedures are aligned with

compliance requirements.

Key needs:

•

Understand organisational gaps

•

Track policy weaknesses

•

Monitor action plans

•

Report compliance status to leadership

5.2 Secondary Users

Business Unit Leaders

Users who need quick guidance before engaging in activities that may create compliance risk.

Examples:

•

Sales teams

•

Client service teams

•

Account managers

•

HR teams

•

Finance teams

•

Procurement teams

External Consultants

Consultants who assess client compliance maturity and produce governance reports.

6. Initial Industry Focus

The MVP should focus on:

3

UK-based media and advertising companies

This sector is a strong starting point because it commonly involves:

•

Client pitches

•

Hospitality

•

Gifts and entertainment

•

Agency relationships

•

Vendor onboarding

•

Personal data handling

•

Employee-related obligations

•

Global parent-company exposure

•

Sanctions and anti-bribery risk

•

Contractual compliance obligations

Future versions can expand into:

•

Financial services

•

Banking

•

Investment management

•

Technology

•

Healthcare

•

Education

•

Public sector

•

Professional services

7. Geographic Scope

MVP Scope

The MVP should focus on:

United Kingdom compliance requirements

Primary areas:

•

UK GDPR and Data Protection Act 2018

•

Bribery Act 2010

•

UK sanctions regime

•

Employment/HR compliance

•

Fraud-related controls

•

Gifts and hospitality governance

•

Basic accountancy and financial governance

•

Corporate governance expectations

4

Future Expansion

Phase 2:

•

European Union legislation and compliance obligations

Phase 3:

•

United States sanctions, anti-bribery, corruption, and related compliance obligations

The product should be architected to support multi-jurisdiction analysis from the beginning, even if only

UK coverage is enabled in the MVP.

8. Product Goals

The MVP should achieve the following goals:

1.

Allow users to input real-world compliance scenarios in plain English.

2.

Identify relevant risk areas from the scenario.

3.

Provide a structured compliance risk assessment.

4.

Allow users to upload policies for gap analysis.

5.
6.

Compare policies against UK compliance expectations.
Produce clear risk ratings and recommended actions.

7.

Provide a simple dashboard of compliance health.

8.

Support human review, editing, approval, rejection, and escalation.

9.

Maintain an audit trail of scenarios, AI outputs, user decisions, and final outcomes.

10.

Generate exportable reports for internal governance use.

9. Non-Goals for MVP

The MVP should not attempt to do the following:

1.

Provide final legal advice.

2.

Replace compliance officers or lawyers.

3.

Cover all industries.

4.

Cover all global legislation.

5.

Automate regulatory filings.

6.

Provide live sanctions screening at enterprise scale in the first release.

7.

Perform full contract lifecycle management.

8.

Replace Microsoft Copilot, Google Workspace, or enterprise document systems.

9.

Provide binding yes/no decisions on risky activities.

10.

Automatically approve or reject business activities without human oversight.

5

10. Core MVP Modules

Module 1: Scenario Risk Analyzer

Purpose

Allow users to enter real-world compliance scenarios and receive structured risk analysis.

User Input

The user should be able to enter a scenario such as:

“During a pitch process, one of our team members took a prospective client to dinner and then to a

hotel. The client then suggested they would approve us as a vendor if we provided monthly benefits.”

Expected AI Output

The system should return:

1.

Scenario summary

2.

Key facts identified

3.

Missing facts or clarification questions

4.

Relevant compliance areas

5.

Possible legal or regulatory concerns

6.

Internal policy areas likely to apply

7.

Risk rating

8.

Rationale for risk rating

9.

Suggested evidence to collect

10.

Recommended next steps

11.

Escalation recommendation

12.

Human review requirement

13.

Audit note

14.

Disclaimer

Supported Risk Categories

The MVP should support these initial categories:

•

Bribery and corruption

•

Gifts and hospitality

•

Sanctions exposure

•

Conflict of interest

•

Vendor/client onboarding

•

Fraud risk

•

Data protection

•

HR/employment

•

Financial governance

•

Reputational risk

6

Module 2: Policy Gap Analyzer

Purpose

Allow companies to upload internal policies and receive a structured gap assessment against selected

UK compliance expectations.

Supported Policy Types for MVP

1.

Anti-bribery and corruption policy

2.

Gifts and hospitality policy

3.

Sanctions policy

4.

Data protection/GDPR policy

5.

HR policy

6.

Fraud policy

7.

Whistleblowing policy

8.

Vendor onboarding policy

9.

Conflict of interest policy

Expected Output

The system should return:

1.

Policy summary

2.

Detected policy type

3.

Key clauses identified

4.

Missing clauses

5.

Weak or unclear areas

6.

Outdated language

7.

Suggested improvements

8.

Relevant compliance themes

9.

Risk rating

10.

Priority level

11.

Recommended next steps

12.

Human review requirement

Example Output Areas

For a gifts and hospitality policy, Regis should check whether the policy includes:

•

Approval thresholds

•

Recording requirements

•

Escalation process

•

Prohibited gifts

•

Hospitality during pitch/tender processes

•

Treatment of alcohol or entertainment

•

Conflict of interest checks

•

Senior approval requirements

•

Audit trail requirements

•

Sanctions-related checks where relevant

7

Module 3: Governance Dashboard

Purpose

Provide a simple visual dashboard showing the organisation’s compliance position.

Dashboard Sections

The MVP dashboard should include:

1.

Overall compliance health score

2.

Risk score by compliance area

3.

Open scenario assessments

4.

High-risk cases

5.

Policy gaps

6.

Human review queue

7.

Escalated cases

8.

Completed assessments

9.
10.

Sanctions-related flags
Recommended actions

11.

Recent activity

12.

Export/report section

Dashboard Risk Areas

The dashboard should show risk across:

•

Anti-bribery and corruption

•

Gifts and hospitality

•

Sanctions

•

GDPR/data protection

•

HR compliance

•

Fraud

•

Financial governance

•

Vendor/client onboarding

•

Conflict of interest

•

Reputational risk

Module 4: Policies, Procedures, Systems, and Processes

Assessment

Purpose

Assess an organisation’s compliance maturity across four governance pillars:

1.

Policies

2.

Procedures

3.

Systems

4.

Processes

8

Assessment Logic

The system should help consultants or compliance teams assess whether the organisation has:

•

Written policies

•

Documented procedures

•

Supporting systems

•

Operational processes

•

Clear ownership

•

Evidence of implementation

•

Review dates

•

Escalation routes

•

Monitoring controls

•

Audit records

Output

The system should produce:

1.

Governance maturity score

2.

Strengths

3.

Weaknesses

4.

Missing documents or controls

5.

Recommended actions

6.

Priority ranking

7.

Dashboard summary

8.

Report export

Module 5: Human Review Workflow

Purpose

Ensure AI outputs are reviewed by a qualified human before being treated as final compliance

guidance.

Workflow States

Each assessment should move through the following statuses:

1.

Draft AI assessment

2.

Awaiting human review

3.

Reviewed

4.

Approved

5.

Edited

6.

Escalated

7.

Rejected

8.

Closed

9

User Actions

The reviewer should be able to:

•

Edit the AI assessment

•

Add comments

•

Change risk rating

•

Add evidence

•

Mark as approved

•

Escalate to legal/compliance lead

•

Reject the assessment

•

Export the final report

Audit Requirement

The system must record:

•

Original user scenario

•

AI-generated output

•

Reviewer comments

•

Changes made

•

Final decision

•

Reviewer name

•

Date and time

•

Status history

Module 6: Audit Trail and Reporting

Purpose

Create a reliable compliance record for internal governance and audit purposes.

Required Audit Data

For every assessment, the system should store:

1.

User input

2.

Uploaded documents, where applicable

3.

AI assessment

4.

Risk rating

5.

Applicable compliance areas

6.

Human reviewer notes

7.

Decision history

8.

Final outcome

9.

Escalation record

10.

Exported reports

11.

Date/time metadata

12.

User metadata

10

Report Types

The MVP should support:

1.

Scenario risk assessment report

2.

Policy gap analysis report

3.

Governance dashboard summary

4.

Human review decision report

Reports should be exportable as PDF and/or DOCX in later releases. For MVP, HTML or downloadable

text/markdown export is acceptable.

11. User Stories

Scenario Risk Analyzer

User Story 1

As a compliance officer, I want to enter a business scenario so that I can quickly identify possible

compliance risks.

Acceptance criteria:

•

User can enter a scenario in plain English.

•

System returns structured analysis.

•

System identifies risk categories.

•

System provides risk rating.

•

System recommends next steps.

•

System clearly states that human review is required.

User Story 2

As a business user, I want to understand whether a proposed client activity creates compliance risk so

that I can avoid exposing the company to bribery or reputational issues.

Acceptance criteria:

•

User can describe the proposed activity.

•

System identifies gifts/hospitality, bribery, or conflict risks where relevant.

•

System asks clarification questions when facts are missing.

•

System recommends escalation if risk is high.

11

Policy Gap Analyzer

User Story 3

As a compliance officer, I want to upload a gifts and hospitality policy so that Regis can identify missing

controls and weak areas.

Acceptance criteria:

•

User can upload or paste policy text.

•

System identifies the policy type.

•

System highlights missing clauses.

•

System suggests improvements.

•

System assigns a risk level.

•

System provides a human review recommendation.

User Story 4

As a governance consultant, I want to assess a client’s policies, procedures, systems, and processes so

that I can produce a compliance maturity dashboard.

Acceptance criteria:

•

User can input assessment answers.

•

System scores each governance pillar.

•

System identifies gaps.

•

System creates dashboard summary.

•

System recommends improvement actions.

Human Review

User Story 5

As a compliance lead, I want to review, edit, approve, or escalate AI-generated assessments so that final

decisions remain under human control.

Acceptance criteria:

•

AI outputs are marked as draft.

•

Reviewer can edit the assessment.

•

Reviewer can change the risk rating.

•

Reviewer can approve or escalate.

•

All changes are recorded in the audit trail.

12

12. Functional Requirements

FR1: User Authentication

The system should allow users to sign in securely.

Minimum MVP roles:

1.

Admin

2.

Compliance Officer

3.

Business User

4.

Reviewer

FR2: Scenario Input

The system should provide a form where users can enter:

•

Scenario title

•

Scenario description

•

Business unit

•

Client/vendor name

•

Jurisdiction

•

Industry

•

Date of event

•

Relevant policy, if known

•

Urgency level

•

Attachments, if applicable

FR3: Scenario AI Assessment

The AI should analyse the scenario and return structured output including:

•

Summary

•

Risk categories

•

Risk rating

•

Reasoning

•

Applicable policy areas

•

Missing facts

•

Questions to ask

•

Evidence required

•

Recommended action

•

Escalation recommendation

•

Human review requirement

FR4: Policy Upload

The system should allow users to upload or paste policies.

13

Accepted MVP input types:

•

Plain text

•

PDF text extraction

•

DOCX text extraction

•

Manual copy/paste

FR5: Policy Gap Analysis

The AI should review the policy and identify:

•

Policy type

•

Covered areas

•

Missing areas

•

Weak clauses

•

Ambiguous wording

•

Suggested improvements

•
•

Risk level
Priority actions

FR6: Dashboard

The dashboard should display:

•

Total assessments

•

Open assessments

•

High-risk assessments

•

Pending reviews

•

Policy gaps

•

Risk by category

•

Recent activity

•

Governance maturity score

FR7: Human Review

The system should allow reviewers to:

•

View AI outputs

•

Add comments

•

Edit response

•

Change status

•

Escalate

•

Approve

•

Reject

•

Close assessment

14

FR8: Audit Trail

The system should store:

•

User input

•

AI output

•

Reviewer edits

•

Status changes

•

Time stamps

•

Final decision

•

Export history

FR9: Export

The system should allow users to export:

•

Scenario assessment

•

Policy gap analysis

•

Dashboard summary

MVP export format:

•

HTML

•

Markdown

•

PDF if available

FR10: Disclaimers

Every AI-generated output must include a clear disclaimer:

“This output is for compliance guidance and internal risk assessment only. It is not legal advice. Final

decisions should be reviewed by an authorised compliance, legal, or risk professional.”

13. Non-Functional Requirements

Security

The platform should:

•

Use secure authentication

•

Protect uploaded documents

•

Restrict access by user role

•

Encrypt sensitive data where possible

•

Avoid exposing confidential client information

15

Privacy

The platform should:

•

Follow UK GDPR principles

•

Minimise unnecessary personal data collection

•

Allow deletion of uploaded documents

•

Maintain clear data retention rules

Reliability

The platform should:

•

Save assessments automatically

•

Prevent loss of user input

•

Log system errors

•

Provide clear error messages

Explainability

The platform should:

•

Explain why a risk rating was assigned

•

List the factors used in assessment

•

Highlight missing facts

•

Avoid unsupported conclusions

Human Oversight

The platform must clearly indicate that AI outputs are drafts until reviewed.

14. Risk Rating Framework

The MVP should use a simple risk scale:

Low Risk

The scenario appears routine, controlled, and aligned with expected policy boundaries.

Medium Risk

The scenario contains potential issues requiring clarification, documentation, or manager/compliance

review.

High Risk

The scenario involves serious concerns such as bribery perception, sanctions exposure, conflict of

interest, excessive hospitality, regulatory breach, or reputational damage.

16

Critical Risk

The scenario may involve serious legal, regulatory, sanctions, fraud, bribery, or governance exposure

requiring urgent escalation.

15. AI Output Format for Scenario Analysis

The AI should return output in the following structure:

1.

Scenario Summary

2.

Key Facts Identified

3.

Missing Information

4.

Relevant Risk Categories

5.

Potential Compliance Issues

6.

Applicable Policy Areas

7.

Risk Rating

8.

Risk Rationale

9.

Questions to Ask

10.

Evidence to Collect

11.

Recommended Next Steps

12.
13.

Escalation Recommendation
Human Review Required

14.

Audit Note

15.

Disclaimer

16. AI Output Format for Policy Gap Analysis

The AI should return output in the following structure:

1.

Policy Summary

2.

Policy Type

3.

Key Clauses Identified

4.

Strengths

5.

Missing Clauses

6.

Weak or Ambiguous Clauses

7.

Compliance Gaps

8.

Risk Rating

9.

Priority Recommendations

10.

Suggested Policy Improvements

11.

Human Review Required

12.

Disclaimer

17

17. Suggested Data Model

User

Fields:

•

id

•

name

•

email

•

role

•

organisation_id

•

created_at

•

updated_at

Organisation

Fields:

•
•

id
name

•

industry

•

primary_jurisdiction

•

additional_jurisdictions

•

created_at

•

updated_at

ScenarioAssessment

Fields:

•

id

•

organisation_id

•

created_by_user_id

•

title

•

description

•

business_unit

•

client_or_vendor_name

•

jurisdiction

•

industry

•

event_date

•

urgency

•

ai_output

•

risk_rating

•

status

•

reviewer_id

•

final_decision

•

created_at

•

updated_at

18

PolicyDocument

Fields:

•

id

•

organisation_id

•

uploaded_by_user_id

•

title

•

policy_type

•

file_url

•

extracted_text

•

analysis_output

•

risk_rating

•

status

•

created_at

•

updated_at

ReviewComment

Fields:

•

id

•

assessment_id

•

assessment_type

•

user_id

•

comment

•

created_at

AuditLog

Fields:

•

id

•

organisation_id

•

user_id

•

entity_type

•

entity_id

•

action

•

previous_value

•

new_value

•

created_at

18. MVP Pages and Screens

1. Landing / Product Overview Page

Purpose:

Explain what Regis AI does and who it is for.

19

Sections:

•

Hero section

•

Key use cases

•

Compliance areas covered

•

Scenario examples

•

Dashboard preview

•

Human-in-the-loop message

•

Call to action

2. Dashboard Page

Purpose:

Show compliance health and activity overview.

Components:

•

Compliance health score

•

Risk cards

•

Open assessments

•

High-risk cases

•

Pending reviews

•

Policy gaps

•

Recent activity table

3. Scenario Analyzer Page

Purpose:

Allow users to submit and analyse business scenarios.

Components:

•

Scenario title field

•

Scenario description field

•

Jurisdiction selector

•

Industry selector

•

Business unit field

•

Client/vendor field

•

Urgency selector

•

Submit button

•

AI output panel

•

Save assessment button

20

4. Scenario Detail Page

Purpose:

Allow users to review one assessment.

Components:

•

Original scenario

•

AI assessment

•

Risk rating

•

Reviewer notes

•

Status selector

•

Escalation button

•

Export button

•

Audit history

5. Policy Analyzer Page

Purpose:

Allow users to upload or paste policies.

Components:

•

Upload file

•

Paste text

•

Policy type selector

•

Jurisdiction selector

•

Submit for analysis

•

AI gap analysis output

6. Policy Detail Page

Purpose:

Show policy analysis results.

Components:

•

Policy summary

•

Gaps

•

Recommendations

•

Risk rating

•

Reviewer comments

•

Status

•

Export button

21

7. Governance Assessment Page

Purpose:

Assess policies, procedures, systems, and processes.

Components:

•

Questionnaire

•

Pillar scores

•

Gap summary

•

Recommended actions

•

Exportable report

8. Settings Page

Purpose:

Manage organisation and user settings.

Components:

•

Organisation details

•

Jurisdiction settings

•

Industry settings

•

User roles

•

Data retention settings

19. MVP Success Metrics

Product Usage Metrics

•

Number of scenarios submitted

•

Number of policies analysed

•

Number of assessments reviewed

•

Number of reports exported

•

Number of high-risk cases identified

Efficiency Metrics

•

Time saved per compliance assessment

•

Reduction in manual drafting time

•

Faster escalation of high-risk cases

Quality Metrics

•

Reviewer approval rate

•

Number of AI outputs edited

22

•

Accuracy rating by compliance users

•

User satisfaction score

Business Metrics

•

Number of pilot organisations

•

Conversion from pilot to paid plan

•

Monthly active users

•

Retention rate

•

Expansion into additional compliance areas

20. Release Plan

Phase 1: MVP Foundation

Build:

•
•

Authentication
Basic dashboard

•

Scenario input

•

Scenario AI analysis

•

Save assessment

•

Human review status

•

Basic audit log

Phase 2: Policy Gap Analyzer

Build:

•

Policy upload

•

Text extraction

•

Policy analysis

•

Gap output

•

Policy risk rating

•

Policy review workflow

Phase 3: Governance Dashboard

Build:

•

Compliance health score

•

Risk category cards

•

Review queue

•

Policy gap summary

•

High-risk case view

•

Exportable dashboard summary

23

Phase 4: Sanctions and Jurisdiction Expansion

Build:

•

Sanctions risk workflow

•

EU compliance expansion

•

US compliance expansion

•

Multi-jurisdiction gap comparison

Phase 5: Advanced Enterprise Features

Build:

•

Custom company policy library

•

Contract review

•

Advanced reporting

•

Microsoft Copilot integration

•

Enterprise permissions

•

API integrations

•

External data feeds

21. Key Risks and Mitigations

Risk 1: AI gives overconfident guidance

Mitigation:

•

Always label AI output as draft guidance.

•

Require human review.

•

Include disclaimer.

•

Show reasoning and missing facts.

Risk 2: Compliance content becomes outdated

Mitigation:

•

Add legislation update workflow.

•

Store source dates.

•

Allow admin review of regulatory content.

•

Add future integration with trusted legal/regulatory sources.

Risk 3: Users treat Regis as legal advice

Mitigation:

•

Use clear disclaimers.

•

Require approval workflow.

•

Avoid definitive legal conclusions.

24

•

Use language such as “potential risk,” “consider,” and “requires review.”

Risk 4: Scope becomes too broad

Mitigation:

•

Start with UK media and advertising.

•

Focus on limited compliance categories.

•

Expand only after MVP validation.

Risk 5: Competing with Copilot

Mitigation:

•

Focus on specialist workflows, audit trail, scoring, dashboards, and governance.

•

Position Regis as a compliance intelligence layer, not a generic assistant.

22. Acceptance Criteria for MVP

The MVP is successful when:

1.

A user can log in.

2.

A user can submit a compliance scenario.

3.

Regis returns a structured risk assessment.

4.

The assessment includes risk rating, reasoning, questions, evidence, and next steps.

5.

A user can save the assessment.

6.

A reviewer can edit, approve, escalate, or reject the assessment.

7.

The system records an audit trail.

8.

A user can upload or paste a policy.

9.

Regis returns a structured policy gap analysis.

10.
11.

The dashboard displays scenario, policy, and risk summaries.
The system clearly states that AI output is not legal advice.

12.

The product can be demonstrated using at least three real-world scenarios.

23. Example MVP Test Scenarios

Scenario 1: Hospitality During Pitch Process

A team member takes a prospective client to dinner and a hotel during a live pitch process. The client

later asks for recurring monthly benefits before approving the company as a vendor.

Expected outcome:

•

High or critical risk

•

Bribery and corruption flagged

•

Gifts and hospitality flagged

•

Conflict of interest flagged

•

Escalation recommended

25

•

Human review required

Scenario 2: Monthly Alcohol Supply

A client offers to fill the company’s office fridges with alcohol every month.

Expected outcome:

•

Medium to high risk

•

Excessive hospitality flagged

•

Business justification requested

•

Approval and recording process recommended

•

Human review required

Scenario 3: Vendor Linked to Sanctioned Person

A supplier is not directly sanctioned, but one of its directors is connected to a sanctioned individual or

sanctioned country.

Expected outcome:

•

High or critical risk

•

Sanctions exposure flagged

•

Enhanced due diligence recommended

•

Legal/compliance escalation required

•

Human review required

24. Technical Recommendation

Recommended stack if the existing Regis app is web-based:

Frontend

•

Next.js or React

•

Tailwind CSS

•

ShadCN UI or similar component library

Backend

•

Node.js / Next.js API routes

•

Supabase or PostgreSQL

•

Authentication via Supabase Auth, Clerk, or Auth.js

AI Layer

•

OpenAI, Anthropic Claude, or hybrid provider abstraction

•

Structured JSON output from AI

26

•

Prompt templates for scenario analysis and policy review

•

Guardrails to prevent unsupported legal conclusions

Storage

•

Supabase Storage or S3-compatible storage for uploaded policies

•

PostgreSQL for assessments, users, audit logs, and review records

Future Integrations

•

Microsoft 365

•

SharePoint

•

Google Drive

•

Sanctions data providers

•

Legal/regulatory content feeds

•

Copilot extension/integration

25. Recommended Prompt Architecture

The system should use separate AI prompt templates for different tasks.

Prompt 1: Scenario Risk Analysis

Used when the user submits a business scenario.

Primary objective:

Analyse the scenario and return structured compliance risk guidance.

Prompt 2: Policy Gap Analysis

Used when the user uploads or pastes a policy.

Primary objective:

Review the policy and identify gaps, weaknesses, and recommended improvements.

Prompt 3: Governance Maturity Assessment

Used when the user completes the policies, procedures, systems, and processes questionnaire.

Primary objective:

Score maturity and recommend improvement actions.

Prompt 4: Reviewer Summary

Used when a compliance officer needs a shorter summary for leadership or escalation.

27

Primary objective:

Produce an executive-ready summary of the assessment.

26. Final Recommendation

The Regis AI MVP should focus on one clear and valuable use case:

UK compliance scenario and policy risk assessment for media and advertising companies.

The strongest initial product modules are:

1.

Scenario Risk Analyzer

2.

Policy Gap Analyzer

3.

Human Review Workflow

4.

Compliance Dashboard

5.

Audit Trail and Reporting

This gives Regis a differentiated position in the market because it addresses the real-world grey-area

work that compliance professionals handle every day.

The long-term opportunity is to expand Regis into a full compliance intelligence platform covering

multiple industries, jurisdictions, regulatory sources, sanctions exposure, policy libraries, contract

review, and enterprise governance reporting.

28

