-- Add jurisdiction column to audits table for EU/UK regulatory expansion.
-- Defaults to 'US' so all existing audit rows remain valid.
ALTER TABLE audits
  ADD COLUMN IF NOT EXISTS jurisdiction text NOT NULL DEFAULT 'US';
