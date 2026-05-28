ALTER TABLE regulatory_updates
  ADD COLUMN IF NOT EXISTS jurisdiction text NOT NULL DEFAULT 'US';
