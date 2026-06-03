-- Compliance-grade human review for findings.
--
-- reviewed_by  — the profile that last changed the finding's status away from 'open'.
-- reviewed_at  — when that review happened (audit trail).
-- review_note  — optional rationale, especially for resolved / risk-accepted findings.
--
-- The status check is also widened to allow 'risk_accepted' — a real compliance
-- outcome where a firm documents and accepts a residual risk rather than closing it.
alter table findings
  add column if not exists reviewed_by uuid references profiles(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_note text;

alter table findings drop constraint if exists findings_status_check;
alter table findings add constraint findings_status_check
  check (status in ('open', 'in_progress', 'resolved', 'risk_accepted'));
