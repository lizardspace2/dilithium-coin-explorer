import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from '@/components/blockchain/HashBadge';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';

export default async function BlockPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: block } = await supabase
        .from('blocks')
        .select('*')
        .eq('index', id)
        .single();

    if (!block) return <div className="p-8">Block not found</div>;

    const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('block_index', id);

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <Link href="/" className="text-cyan hover:underline">← Back to Dashboard</Link>

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold font-space">Block #{block.index}</h1>
                <div className="text-gray-400">{timeAgo(block.timestamp)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard title="Metadata">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Hash</span>
                            <HashBadge hash={block.hash} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Parent</span>
                            <HashBadge hash={block.prev_hash} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Minter</span>
                            <HashBadge hash={block.minter_address} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Difficulty</span>
                            <span className="font-mono">{block.difficulty}</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard title="Stats">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Transactions</span>
                            <span className="font-mono text-xl">{block.transaction_count}</span>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <GlassCard title="Transactions">
                <div className="space-y-2">
                    {txs && txs.map(tx => (
                        <div key={tx.id} className="p-2 border-b border-white/5 flex justify-between">
                            <Link href={`/tx/${tx.id}`} className="text-cyan font-mono hover:neon-glow">
                                {tx.id}
                            </Link>
                            <span className="text-sm text-gray-500">{timeAgo(tx.timestamp)}</span>
                        </div>
                    ))}
                    {(!txs || txs.length === 0) && <div className="text-gray-500 italic">No transactions</div>}
                </div>
            </GlassCard>
        </div>
    );
}
