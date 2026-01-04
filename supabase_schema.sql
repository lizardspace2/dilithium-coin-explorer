-- Nettoyage (Optionnel, attention aux données existantes)
-- DROP TABLE IF EXISTS tx_inputs, tx_outputs, transactions, blocks;

-- 1. Table des blocs
CREATE TABLE IF NOT EXISTS blocks (
    index BIGINT PRIMARY KEY,
    hash TEXT UNIQUE NOT NULL,
    prev_hash TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    difficulty BIGINT NOT NULL,
    minter_address TEXT NOT NULL,
    minter_balance NUMERIC,
    transaction_count INTEGER DEFAULT 0,
    merkle_root TEXT,
    size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    block_index BIGINT REFERENCES blocks(index) ON DELETE CASCADE,
    timestamp BIGINT NOT NULL,
    fee NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des entrées (Inputs)
CREATE TABLE IF NOT EXISTS tx_inputs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
    tx_out_id TEXT, -- ID de la transaction d'origine
    tx_out_index INTEGER, -- Index de la sortie d'origine
    signature TEXT
);

-- 4. Table des sorties (Outputs)
CREATE TABLE IF NOT EXISTS tx_outputs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
    index INTEGER NOT NULL,
    address TEXT NOT NULL,
    amount NUMERIC NOT NULL
);

-- 5. Index pour la performance
CREATE INDEX IF NOT EXISTS idx_blocks_hash ON blocks(hash);
-- CHANGE: Partial index for large Dilithium keys
CREATE INDEX IF NOT EXISTS idx_blocks_minter ON blocks(substring(minter_address from 1 for 64));
CREATE INDEX IF NOT EXISTS idx_tx_block_index ON transactions(block_index);
CREATE INDEX IF NOT EXISTS idx_tx_inputs_txid ON tx_inputs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_tx_outputs_txid ON tx_outputs(transaction_id);
-- CHANGE: Partial index for large Dilithium keys
CREATE INDEX IF NOT EXISTS idx_tx_outputs_address ON tx_outputs(substring(address from 1 for 64));
