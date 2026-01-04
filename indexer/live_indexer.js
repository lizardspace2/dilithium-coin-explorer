/* live_indexer.js */
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ugetaqllizziswruqdvm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZXRhcWxsaXp6aXN3cnVxZHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ5Nzc5NSwiZXhwIjoyMDgzMDczNzk1fQ.zD6BftehXYd5IOYenK09_DmAspoeYz2Uu1DJC556C9I';
const NODE_URL = process.env.NODE_URL || 'http://34.66.15.88:3001';
const POLL_INTERVAL = 3000; // 3 seconds

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
});

let lastIndexedBlockIndex = -1;

async function getLastIndexedBlock() {
    const { data, error } = await supabase
        .from('blocks')
        .select('index')
        .order('index', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Rest contains 0 rows"
        console.error('Error fetching last block from DB:', error.message);
        return -1;
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
        transaction_count: block.data.length
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
            timestamp: block.timestamp
        });

        tx.txIns.forEach(inn => {
            inputRows.push({
                transaction_id: tx.id,
                tx_out_id: inn.txOutId,
                tx_out_index: inn.txOutIndex,
                signature: inn.signature
            });
        });

        tx.txOuts.forEach((out, idx) => {
            outputRows.push({
                transaction_id: tx.id,
                index: idx,
                address: out.address,
                amount: out.amount
            });
        });
    }

    if (txRows.length > 0) {
        const { error: errT } = await supabase.from('transactions').upsert(txRows);
        if (errT) throw new Error(`Error inserting TXs for block ${block.index}: ${errT.message}`);
    }
    if (inputRows.length > 0) {
        const { error: errI } = await supabase.from('tx_inputs').insert(inputRows);
        if (errI) console.warn('Warn Inputs:', errI.message);
    }
    if (outputRows.length > 0) {
        const { error: errO } = await supabase.from('tx_outputs').insert(outputRows);
        if (errO) console.warn('Warn Output:', errO.message);
    }

    console.log(`✅ Block ${block.index} indexed.`);
}

async function sync() {
    try {
        // 1. Get local last index if needed
        if (lastIndexedBlockIndex === -1) {
            lastIndexedBlockIndex = await getLastIndexedBlock();
            console.log(`Last indexed block in DB: ${lastIndexedBlockIndex}`);
        }

        // 2. Get latest block from node
        // Ideally the node has /info or /latestBlock endpoint. 
        // We will fetch /blocks (heavy) or try to fetch next block specifically if we know the index.
        // Assuming we can fetch /blocks for now or check chain size.
        // Optimization: create an endpoint on the node for /latestBlock later.
        // For now, let's just fetch all blocks (inefficient but safe as per bulk_import) 
        // OR better: fetch the specific next block index if the node supports /block/{index} or similar.
        // The prompt implies "listening and adding".

        // Let's assume the node supports /blocks and we take the last one.
        const { data: allBlocks } = await axios.get(`${NODE_URL}/blocks`);
        const latestNodeBlock = allBlocks[allBlocks.length - 1]; // Node returns sorted array?

        if (latestNodeBlock.index > lastIndexedBlockIndex) {
            console.log(`New blocks detected! Node height: ${latestNodeBlock.index}, DB height: ${lastIndexedBlockIndex}`);
            // Sync all missing blocks
            // Note: simple implementation using the array.
            for (const block of allBlocks) {
                if (block.index > lastIndexedBlockIndex) {
                    await processBlock(block);
                    lastIndexedBlockIndex = block.index;
                }
            }
        }
    } catch (err) {
        console.error('Sync error:', err.message);
    }

    // Schedule next poll
    setTimeout(sync, POLL_INTERVAL);
}

console.log('🚀 Starting User-defined Live Indexer...');
sync();
