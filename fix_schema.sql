-- FIX: Drop problematic indexes for large keys
DROP INDEX IF EXISTS idx_blocks_minter;
DROP INDEX IF EXISTS idx_tx_outputs_address;

-- Recreate with Partial Indexes (indexing only the first 64 chars)
-- This avoids the "index row size exceeds maximum" error for Dilithium keys (~3KB)
CREATE INDEX IF NOT EXISTS idx_blocks_minter ON blocks(substring(minter_address from 1 for 64));
CREATE INDEX IF NOT EXISTS idx_tx_outputs_address ON tx_outputs(substring(address from 1 for 64));
