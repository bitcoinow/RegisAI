-- ── Document deletion (owner-scoped) ──────────────────────────────────────────
-- The initial schema granted select/insert/update on documents and select/insert
-- on storage.objects, but never delete. The Documents view lets a user remove a
-- document (and, via the audits.document_id cascade, its audits + findings), so we
-- add owner-scoped DELETE policies that mirror the existing own-folder pattern.

create policy "own documents delete" on documents
  for delete using (auth.uid() = user_id);

create policy "users delete own documents" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
