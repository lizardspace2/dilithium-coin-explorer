import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// --- CONFIGURATION ---
// Ensure these env vars are set in Vercel
// Fallback to known working credentials if env vars are missing
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ugetaqllizziswruqdvm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZXRhcWxsaXp6aXN3cnVxZHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ5Nzc5NSwiZXhwIjoyMDgzMDczNzk1fQ.zD6BftehXYd5IOYenK09_DmAspoeYz2Uu1DJC556C9I';
const NODE_URL = process.env.NODE_URL || 'http://34.66.15.88:3001';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
});

export const dynamic = 'force-dynamic'; // Static generation won't work for cron
export const maxDuration = 60; // Increase to 60s (max for Hobby/Pro usually allows more but safe bet)

const MAX_BLOCKS_PER_RUN = 5; // Reduced from 50 to 5 to avoid timeouts with large payloads


export async function GET(request: NextRequest) {
    try {
        // Optional: Secure this endpoint so only Vercel Cron can call it
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            // For now, keeping it open or allowing manual trigger for testing
        }

        const result = await sync();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function getLastIndexedBlock() {
    const { data, error } = await supabase
        .from('blocks')
        .select('index')
        .order('index', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        // PGRST116 is "Rest contains 0 rows"
        console.error('Error fetching last block from DB:', error.message);
        return -1;
    }
    return data ? data.index : -1;
}

async function processBlock(block: any) {
    // console.log(`Processing block ${block.index} (${block.hash})...`);

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
        size: JSON.stringify(block).length,
    };

    const { error: errB } = await supabase.from('blocks').upsert(blockRow);
    if (errB) throw new Error(`Error inserting block ${block.index}: ${errB.message}`);

    const txRows: any[] = [];
    const inputRows: any[] = [];
    const outputRows: any[] = [];

    for (const tx of block.data) {
        txRows.push({
            id: tx.id,
            block_index: block.index,
            timestamp: block.timestamp,
            fee: 0, // Placeholder
        });

        if (tx.txIns) {
            tx.txIns.forEach((inn: any) => {
                inputRows.push({
                    transaction_id: tx.id,
                    tx_out_id: inn.txOutId,
                    tx_out_index: inn.txOutIndex,
                    signature: inn.signature,
                });
            });
        }

        if (tx.txOuts) {
            tx.txOuts.forEach((out: any, idx: number) => {
                outputRows.push({
                    transaction_id: tx.id,
                    index: idx,
                    address: out.address,
                    amount: out.amount,
                });
            });
        }
    }

    if (txRows.length > 0) {
        const { error: errT } = await supabase.from('transactions').upsert(txRows);
        if (errT) throw new Error(`Error inserting TXs for block ${block.index}: ${errT.message}`);
    }
    if (inputRows.length > 0) {
        // Ignore errors for inputs/outputs to prevent full failure if duplicates
        const { error: errI } = await supabase.from('tx_inputs').upsert(inputRows, { ignoreDuplicates: true });
        if (errI) console.warn('Warn Inputs:', errI.message);
    }
    if (outputRows.length > 0) {
        const { error: errO } = await supabase.from('tx_outputs').upsert(outputRows, { ignoreDuplicates: true });
        if (errO) console.warn('Warn Output:', errO.message);
    }
}

async function sync() {
    let blocksProcessed = 0;

    // 1. Get local last index
    const lastIndexedBlockIndex = await getLastIndexedBlock();

    // 2. Get all blocks from node (or only recent ones if API supported it)
    // Warning: Fetching ALL blocks is heavy. 
    // Ideally, the node should support /blocks?fromIndex=...
    // For now, we fetch all and filter, mirroring the original script.
    const res = await fetch(`${NODE_URL}/blocks`);
    if (!res.ok) throw new Error(`Failed to fetch blocks from node: ${res.statusText}`);

    const allBlocks = await res.json();

    // Sort by index just in case
    allBlocks.sort((a: any, b: any) => a.index - b.index);

    const latestNodeBlock = allBlocks[allBlocks.length - 1];

    if (latestNodeBlock && latestNodeBlock.index > lastIndexedBlockIndex) {
        console.log(`[Indexer] New blocks detected! Node height: ${latestNodeBlock.index}, DB height: ${lastIndexedBlockIndex}`);

        // Sync missing blocks
        // Limit to MAX_BLOCKS_PER_RUN blocks per run to avoid Vercel timeouts
        let count = 0;

        for (const block of allBlocks) {
            if (block.index > lastIndexedBlockIndex) {
                if (count >= MAX_BLOCKS_PER_RUN) {
                    console.log(`[Indexer] Reached batch limit of ${MAX_BLOCKS_PER_RUN}. Stopping run.`);
                    break;
                }

                console.log(`[Indexer] Processing block ${block.index}...`);
                await processBlock(block);
                count++;
            }
        }
        blocksProcessed = count;
        console.log(`[Indexer] processed ${blocksProcessed} blocks successfully.`);
    } else {
        console.log('[Indexer] No new blocks to sync.');
    }

    return {
        success: true,
        lastIndexedBlockIndex,
        newNodeHeight: latestNodeBlock?.index,
        blocksProcessed
    };
}
