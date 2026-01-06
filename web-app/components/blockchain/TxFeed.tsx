'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HashBadge } from './HashBadge';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';

interface Transaction {
    id: string;
    block_index: number;
    timestamp: number;
}

// Note: To get 'amount', we need to join with outputs. 
// A simple query might not give amount directly unless we denormalize or fetch it.
// For the feed, we might skip amount or fetch it separately. 
// For now, let's just show ID and Block Index.

export function TxFeed({ initialTxs }: { initialTxs: Transaction[] }) {
    const [txs, setTxs] = useState<Transaction[]>(initialTxs);

    useEffect(() => {
        const channel = supabase
            .channel('public:transactions')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload) => {
                const newTx = payload.new as Transaction;
                setTxs((prev) => [newTx, ...prev].slice(0, 10));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-space text-neon-purple">Latest Transactions</h2>
                <Link href="/transactions" className="text-sm text-gray-400 hover:text-white transition-colors">
                    View All →
                </Link>
            </div>
            {txs.map((tx) => (
                <div key={tx.id} className="glass-panel p-4 flex justify-between items-center hover:bg-white/5 transition-all animate-in fade-in slide-in-from-top-4 duration-500 border-l-2 border-l-transparent hover:border-l-neon-purple">
                    <Link href={`/tx/${tx.id}`} className="font-mono text-neon-blue hover:text-neon-purple transition-colors">
                        {tx.id.substring(0, 8)}...{tx.id.substring(tx.id.length - 8)}
                    </Link>
                    <div className="text-right">
                        <div className="text-sm font-mono text-gray-400">Block #{tx.block_index}</div>
                        <div className="text-xs text-gray-500">{timeAgo(tx.timestamp * 1000)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
