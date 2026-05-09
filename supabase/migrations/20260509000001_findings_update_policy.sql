create policy "own findings update" on findings
  for update using (
    exists (
      select 1 from audits
      where audits.id = findings.audit_id
        and audits.user_id = auth.uid()
    )
  );
