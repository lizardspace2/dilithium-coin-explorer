const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// --- CONFIGURATION ---
// Credentials from Environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const NODE_URL = process.env.NODE_URL || 'http://34.66.15.88:3001';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in environment variables.');
    process.exit(1);
}

// GitHub Actions have ample time, but let's be efficient.
const MAX_BLOCKS_TO_SYNC = 500; // Index up to 500 blocks per run
const NODE_TIMEOUT_MS = 30000; // 30s timeout for node fetch

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
});

async function getLastIndexedBlock() {
    const { data, error } = await supabase
        .from('blocks')
        .select('index')
        .order('index', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching last block from DB:', error.message);
        throw error;
    }
    return data ? data.index : -1;
}

async function processBlock(block) {
    console.log(`Processing block ${block.index} (${block.hash})...`);

    const blockRow = {
        index: block.index,
        hash: block.hash,
        prev_hash: block.previousHash,
        timestamp: block.timestamp,
        difficulty: block.difficulty,
        minter_address: block.minterAddress,
        minter_balance: block.minterBalance,
        transaction_count: block.data.length,
        merkle_root: block.merkleRoot,
        size: JSON.stringify(block).length
    };

    const { error: errB } = await supabase.from('blocks').upsert(blockRow);
    if (errB) throw new Error(`Error inserting block ${block.index}: ${errB.message}`);

    const txRows = [];
    const inputRows = [];
    const outputRows = [];

    for (const tx of block.data) {
        txRows.push({
            id: tx.id,
            block_index: block.index,
            timestamp: block.timestamp,
            fee: 0
        });

        if (tx.txIns) {
            tx.txIns.forEach(inn => {
                inputRows.push({
                    transaction_id: tx.id,
                    tx_out_id: inn.txOutId,
                    tx_out_index: inn.txOutIndex,
                    signature: inn.signature
                });
            });
        }

        if (tx.txOuts) {
            tx.txOuts.forEach((out, idx) => {
                outputRows.push({
                    transaction_id: tx.id,
                    index: idx,
                    address: out.address,
                    amount: out.amount
                });
            });
        }
    }

    if (txRows.length > 0) await supabase.from('transactions').upsert(txRows);
    if (inputRows.length > 0) await supabase.from('tx_inputs').upsert(inputRows, { ignoreDuplicates: true });
    if (outputRows.length > 0) await supabase.from('tx_outputs').upsert(outputRows, { ignoreDuplicates: true });
}

async function run() {
    console.log('🚀 Starting GitHub Action Indexer...');
    try {
        // 1. Get DB State
        const lastIndexedBlockIndex = await getLastIndexedBlock();
        console.log(`📦 Last indexed block in DB: ${lastIndexedBlockIndex}`);

        // 2. Fetch All Blocks (Heavy Payload)
        console.log(`📡 Fetching blocks from ${NODE_URL}...`);
        const response = await axios.get(`${NODE_URL}/blocks`, {
            timeout: NODE_TIMEOUT_MS,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const allBlocks = response.data;
        console.log(`✅ Fetched ${allBlocks.length} blocks.`);

        // Sort to ensure order
        allBlocks.sort((a, b) => a.index - b.index);

        const latestNodeIndex = allBlocks[allBlocks.length - 1].index;

        if (latestNodeIndex <= lastIndexedBlockIndex) {
            console.log('✨ Database is already up to date.');
            return;
        }

        console.log(`🔄 Need to sync from ${lastIndexedBlockIndex + 1} to ${latestNodeIndex}`);

        let count = 0;
        for (const block of allBlocks) {
            if (block.index > lastIndexedBlockIndex) {
                if (count >= MAX_BLOCKS_TO_SYNC) {
                    console.log(`⚠️ Limit of ${MAX_BLOCKS_TO_SYNC} blocks reached. Stopping for this run.`);
                    break;
                }

                await processBlock(block);
                count++;
            }
        }

        console.log(`✅ Successfully processed ${count} blocks.`);

    } catch (err) {
        console.error('❌ Fatal Error:', err.message);
        process.exit(1);
    }
}

run();
