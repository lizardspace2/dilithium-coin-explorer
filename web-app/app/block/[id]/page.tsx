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
    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <Link href="/blocks" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors animate-fade-in mb-4 group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blocks
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-mono uppercase tracking-widest mb-2">
                        Block Height
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold font-space text-white">#{block.index}</h1>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">Mined</div>
                    <div className="text-xl font-mono text-neon-purple">{timeAgo(block.timestamp * 1000)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <GlassCard title="Block Hash" className="md:col-span-2">
                    <div className="flex items-center gap-4 break-all">
                        <div className="hidden sm:flex h-12 w-12 rounded-xl bg-neon-blue/10 items-center justify-center text-neon-blue text-2xl">
                            📦
                        </div>
                        <div className="font-mono text-gray-300 text-sm md:text-base break-all">
                            {block.hash}
                        </div>
                    </div>
                </GlassCard>

                <GlassCard title="Transactions">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple text-2xl">
                            ⚡
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{block.transaction_count}</div>
                            <div className="text-xs text-gray-500">Total in block</div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <GlassCard title="Block Details" className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Parent Hash</div>
                        <HashBadge hash={block.prev_hash} className="text-gray-300" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Merkle Root</div>
                        <HashBadge hash={block.merkle_root || 'N/A'} className="text-gray-300" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Difficulty</div>
                        <div className="font-mono text-white text-lg">{block.difficulty}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Size</div>
                        <div className="font-mono text-white text-lg">{block.size ? `${block.size.toLocaleString()} bytes` : '---'}</div>
                    </div>
                </div>
            </GlassCard>

            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-2xl font-bold font-space text-white">Transactions</h2>
                <div className="glass-panel p-1">
                    {txs && txs.map((tx, i) => (
                        <div key={tx.id} className={`p-4 flex flex-col sm:flex-row justify-between items-center hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-0 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                            <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                                <Link href={`/tx/${tx.id}`} className="font-mono text-neon-blue hover:text-white transition-colors truncate w-full sm:w-auto">
                                    {tx.id}
                                </Link>
                            </div>
                            <div className="w-full sm:w-auto text-right mt-2 sm:mt-0">
                                <span className="text-sm text-gray-500">{timeAgo(tx.timestamp * 1000)}</span>
                            </div>
                        </div>
                    ))}
                    {(!txs || txs.length === 0) && (
                        <div className="p-8 text-center text-gray-500 italic">
                            No transactions found in this block
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
