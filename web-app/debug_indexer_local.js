const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
function loadEnv(filename) {
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
        console.log(`Loading env from ${filename}...`);
        const content = fs.readFileSync(filePath, 'utf8');
        content.split(/\r?\n/).forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["'](.*)["']$/, '$1'); // clean quotes
                if (!process.env[key]) process.env[key] = value;
            }
        });
    }
}

loadEnv('.env');
loadEnv('.env.local');

const SUPABASE_URL = 'https://ugetaqllizziswruqdvm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZXRhcWxsaXp6aXN3cnVxZHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ5Nzc5NSwiZXhwIjoyMDgzMDczNzk1fQ.zD6BftehXYd5IOYenK09_DmAspoeYz2Uu1DJC556C9I';
const NODE_URL = 'http://34.66.15.88:3001';

console.log('--- DEBUG INDEXER (HARDCODED AUTH) ---');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
});

async function run() {
    try {
        console.log('1. Testing Supabase Connection (fetching last block)...');
        // Test basic connectivity first
        const { data, error } = await supabase
            .from('blocks')
            .select('index')
            .order('index', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code !== 'PGRST116') {
                console.error('❌ Supabase Error:', error.message, error.code);
                if (error.message.includes('JWT')) console.error('Hint: Check your SUPABASE_SERVICE_ROLE_KEY.');
                return;
            } else {
                console.log('✅ Supabase Connection OK (No blocks found).');
            }
        } else {
            const lastIndex = data ? data.index : -1;
            console.log('✅ Supabase Connection OK. Last DB Index:', lastIndex);
        }

        console.log('2. Fetching Node blocks...');
        const start = Date.now();
        const res = await fetch(`${NODE_URL}/blocks`);
        if (!res.ok) throw new Error(`Node fetch failed: ${res.status}`);

        const blob = await res.blob();
        console.log(`✅ Node Fetch OK. Payload size: ${(blob.size / 1024 / 1024).toFixed(2)} MB in ${Date.now() - start}ms`);

        // Memory check
        if (blob.size > 9 * 1024 * 1024) {
            console.warn('⚠️ WARNING: Payload is > 9MB. This is approaching Vercel function payload limits (though mostly for response body).');
        }

        const text = await blob.text();
        const allBlocks = JSON.parse(text);
        console.log(`✅ Parsed ${allBlocks.length} blocks.`);

    } catch (e) {
        console.error('❌ Script Failed:', e.message);
    }
}

run();
