-- Policy update drafting: stores the Claude-generated amended policy language
-- for a finding so it persists across reloads and appears in exports.
alter table findings
  add column if not exists drafted_policy text;
