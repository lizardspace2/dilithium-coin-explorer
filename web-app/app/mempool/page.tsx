import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from '@/components/blockchain/HashBadge';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';

// Helper to fetch mempool directly from node
async function getMempool() {
    try {
        const NODE_URL = process.env.NODE_URL || 'http://34.66.15.88:3001';
        const res = await fetch(`${NODE_URL}/transaction-pool`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.error('Failed to fetch mempool', e);
        return [];
    }
}

export const revalidate = 0;

export default async function MempoolPage() {
    const txs = await getMempool();

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <Link href="/" className="text-cyan hover:underline">← Back to Dashboard</Link>

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold font-space text-orange-400">Mempool</h1>
                <div className="text-gray-400">{txs.length} Pending Txs</div>
            </div>

            <GlassCard title="Unconfirmed Transactions">
                <div className="space-y-2">
                    {txs.map((tx: any) => (
                        <div key={tx.id} className="p-4 bg-white/5 rounded flex flex-col md:flex-row justify-between gap-4 border-l-2 border-orange-500">
                            <div className="flex-1">
                                <div className="text-xs text-orange-400 mb-1">Transaction Hash</div>
                                <Link href={`/tx/${tx.id}?status=pending`} className="text-lg font-mono hover:text-cyan break-all">
                                    {tx.id}
                                </Link>
                            </div>
                            <div className="flex flex-col gap-1 items-end min-w-[150px]">
                                <div className="text-xs text-gray-400">Inputs</div>
                                <div className="font-mono">{tx.txIns?.length || 0}</div>
                                <div className="text-xs text-gray-400">Outputs</div>
                                <div className="font-mono">{tx.txOuts?.length || 0}</div>
                            </div>
                        </div>
                    ))}
                    {txs.length === 0 && (
                        <div className="text-center py-12 text-gray-500 italic">
                            Mempool is empty. Use the faucet or wallet to send a transaction.
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
