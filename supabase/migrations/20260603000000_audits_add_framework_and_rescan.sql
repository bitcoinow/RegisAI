-- Framework scoping + re-scan/versioning support for the audits table.
--
-- framework        — when set (e.g. 'GDPR'), the audit was scoped to a single
--                    regulatory framework rather than the whole jurisdiction.
-- parent_audit_id  — links a re-scan to the audit it supersedes; null on a first scan.
-- scan_number      — 1 for an initial scan, parent.scan_number + 1 for each re-scan.
-- compliance_score — 0–100 risk-weighted posture score (see app/api/analyse).
-- requirements_*   — scope size and how many requirements were met (no open gap).
-- gaps_*           — delta vs the parent audit, computed at re-scan time (null on first scan).
alter table audits
  add column if not exists framework text,
  add column if not exists parent_audit_id uuid references audits(id) on delete set null,
  add column if not exists scan_number int not null default 1,
  add column if not exists compliance_score numeric,
  add column if not exists requirements_total int,
  add column if not exists requirements_met int,
  add column if not exists gaps_closed int,
  add column if not exists gaps_new int,
  add column if not exists gaps_persisting int;

create index if not exists audits_parent_audit_id_idx on audits(parent_audit_id);
