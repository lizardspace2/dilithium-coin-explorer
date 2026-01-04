-- Run these commands in your Supabase SQL Editor to update your existing tables

-- 1. Add new columns to 'blocks' table
ALTER TABLE blocks 
ADD COLUMN IF NOT EXISTS merkle_root TEXT,
ADD COLUMN IF NOT EXISTS size INTEGER;

-- 2. Add new column to 'transactions' table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS fee NUMERIC;

-- 3. Verify the changes (Optional)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'blocks';
