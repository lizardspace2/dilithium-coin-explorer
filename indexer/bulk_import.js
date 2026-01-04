/* bulk_import.js */
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'VOTRE_SUPABASE_URL_ICI';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'VOTRE_SERVICE_ROLE_KEY_ICI'; // Clé secrète (backend)
const NODE_URL = process.env.NODE_URL || 'http://localhost:3001';
const BATCH_SIZE = 50; // Nombre de blocs par envoi (ajuster selon limites)

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

async function run() {
    console.time('Importation');
    console.log('📡 Téléchargement de la blockchain complète depuis le nœud...');
    
    try {
        // Attention : Si la chaîne est > 100MB, il faut utiliser un stream. 
        // Pour l'instant, on assume que ça tient en mémoire (< 500k blocs).
        const { data: allBlocks } = await axios.get(`${NODE_URL}/blocks`);
        console.log(`✅ ${allBlocks.length} blocs récupérés. Début de l'indexation...`);

        // Trier par index croissant pour être propre
        allBlocks.sort((a, b) => a.index - b.index);

        for (let i = 0; i < allBlocks.length; i += BATCH_SIZE) {
            const batch = allBlocks.slice(i, i + BATCH_SIZE);
            await processBatch(batch);
            const progress = Math.round(((i + batch.length) / allBlocks.length) * 100);
            process.stdout.write(`\r🚀 Progression : ${progress}% (${i + batch.length}/${allBlocks.length})`);
        }
        
        console.log('\n✨ Importation terminée avec succès !');
        console.timeEnd('Importation');

    } catch (err) {
        console.error('\n❌ Erreur fatale:', err.message);
        if (err.response) console.error('Détails:', err.response.statusText);
    }
}

async function processBatch(blocks) {
    const blockRows = [];
    const txRows = [];
    const inputRows = [];
    const outputRows = [];

    for (const block of blocks) {
        // Préparer Bloc
        blockRows.push({
            index: block.index,
            hash: block.hash,
            prev_hash: block.previousHash,
            timestamp: block.timestamp,
            difficulty: block.difficulty,
            minter_address: block.minterAddress,
            minter_balance: block.minterBalance,
            transaction_count: block.data.length
        });

        // Préparer Transactions
        for (const tx of block.data) {
            txRows.push({
                id: tx.id,
                block_index: block.index,
                timestamp: block.timestamp
            });

            // Inputs
            tx.txIns.forEach(inn => {
                inputRows.push({
                    transaction_id: tx.id,
                    tx_out_id: inn.txOutId,
                    tx_out_index: inn.txOutIndex,
                    signature: inn.signature
                });
            });

            // Outputs
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

    // Insérer en base (upsert pour éviter les erreurs de doublons si on relance)
    const { error: errB } = await supabase.from('blocks').upsert(blockRows, { ignoreDuplicates: true });
    if (errB) throw new Error(`Erreur Blocs: ${errB.message}`);

    if (txRows.length > 0) {
        const { error: errT } = await supabase.from('transactions').upsert(txRows, { ignoreDuplicates: true });
        if (errT) throw new Error(`Erreur TXs: ${errT.message}`);
    }

    // Pour Inputs/Outputs, pas d'ID unique stable facile à générer dans le script, 
    // donc on insert simplement. Idéalement on vide les tables avant un full import.
    if (inputRows.length > 0) {
        const { error: errI } = await supabase.from('tx_inputs').insert(inputRows);
        if (errI) console.warn('Warn Inputs:', errI.message); // On log juste car duplicata possible sur UUID
    }
    if (outputRows.length > 0) {
        const { error: errO } = await supabase.from('tx_outputs').insert(outputRows);
        if (errO) console.warn('Warn Outputs:', errO.message);
    }
}

run();
