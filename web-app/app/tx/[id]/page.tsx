import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from '@/components/blockchain/HashBadge';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';
import type { Transaction, TxInput, TxOutput } from '@/lib/types';
import { CopyButton } from '@/components/ui/CopyButton';

export default async function TxPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: tx } = await supabase
        .from('transactions')
        .select('*, tx_inputs(*), tx_outputs(*)')
        .eq('id', id)
        .single();

    if (!tx) return <div className="p-8">Transaction not found</div>;

    return (
    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <Link href="/transactions" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors animate-fade-in mb-4 group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Transactions
            </Link>

            <div className="space-y-4 animate-slide-up">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-mono uppercase tracking-widest">
                        Transaction
                    </div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono uppercase tracking-widest font-bold">
                        ✓ Confirmed
                    </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-mono text-white break-all flex items-center gap-3">
                    {tx.id} <CopyButton text={tx.id} />
                </h1>
            </div>

            <GlassCard title="Transaction Details" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Block Height</div>
                        <Link href={`/block/${tx.block_index}`} className="text-neon-blue font-mono text-lg hover:underline decoration-neon-blue/50">
                            #{tx.block_index}
                        </Link>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Timestamp</div>
                        <div className="text-white font-mono text-lg">{timeAgo(tx.timestamp * 1000)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Fee</div>
                        <div className="text-white font-mono text-lg">{tx.fee ? `${tx.fee} QTX` : '0 QTX'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                        <div className="text-green-400 font-mono text-lg">Success</div>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {/* Inputs */}
                <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-xl font-bold font-space text-gray-300">Inputs ({tx.tx_inputs?.length || 0})</h3>
                    <div className="space-y-3">
                        {tx.tx_inputs && tx.tx_inputs.map((input: TxInput, idx: number) => (
                            <div key={input.id || idx} className="glass-panel p-4 hover:border-neon-purple/50 transition-colors relative group">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 hidden lg:block text-gray-600 z-10">→</div>
                                <div className="text-xs text-gray-500 mb-1">From Output</div>
                                <div className="font-mono text-sm text-neon-blue break-all">
                                    {input.tx_out_id || <span className="text-yellow-400 font-bold">COINBASE (New Coins)</span>}
                                </div>
                                {input.tx_out_id && (
                                    <div className="text-xs text-gray-600 mt-1 font-mono">Index: {input.tx_out_index}</div>
                                )}
                            </div>
                        ))}
                        {(!tx.tx_inputs?.length) && <div className="text-gray-500 italic">No inputs (Coinbase?)</div>}
                    </div>
                </div>

                {/* Arrow Divider (Desktop only) */}
                <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                        ➔
                    </div>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-xl font-bold font-space text-gray-300">Outputs ({tx.tx_outputs?.length || 0})</h3>
                    <div className="space-y-3">
                        {tx.tx_outputs && tx.tx_outputs.map((output: TxOutput, idx: number) => (
                            <div key={output.id || idx} className="glass-panel p-4 border-l-4 border-l-green-500/50 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="overflow-hidden">
                                        <div className="text-xs text-gray-500 mb-1">To Address</div>
                                        <Link href={`/address/${output.address}`} className="block">
                                            <HashBadge hash={output.address} noCopy className="text-sm font-mono text-gray-300 hover:text-white" />
                                        </Link>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                                        <div className="font-mono text-lg font-bold text-green-400">{output.amount} QTX</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
