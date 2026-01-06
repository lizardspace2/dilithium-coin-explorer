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
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <Link href="/" className="text-cyan hover:underline">← Back to Dashboard</Link>

            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-space break-all">TX: {tx.id}</h1>
                <CopyButton text={tx.id} />
            </div>

            <GlassCard title="Details">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-400 block mb-1">Block</span>
                        <Link href={`/block/${tx.block_index}`} className="text-purple hover:underline">#{tx.block_index}</Link>
                    </div>
                    <div>
                        <span className="text-gray-400 block mb-1">Time</span>
                        <span className="font-mono">{timeAgo(tx.timestamp * 1000)}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block mb-1">Status</span>
                        <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs uppercase font-bold tracking-wider">Confirmed</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block mb-1">Fee</span>
                        <span className="font-mono text-gray-300">{tx.fee ? `${tx.fee} DIL` : '0 DIL'}</span>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard title="Inputs">
                    <div className="space-y-2">
                        {tx.tx_inputs && tx.tx_inputs.map((input: TxInput, idx: number) => (
                            <div key={input.id || idx} className="p-2 bg-white/5 rounded">
                                <div className="text-xs text-gray-400">Previous Output</div>
                                <div className="font-mono text-sm truncate">{input.tx_out_id || 'Coinbase'}</div>
                                <div className="text-xs text-gray-500">Index: {input.tx_out_index}</div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard title="Outputs">
                    <div className="space-y-2">
                        {tx.tx_outputs && tx.tx_outputs.map((output: TxOutput, idx: number) => (
                            <div key={output.id || idx} className="p-2 bg-white/5 rounded flex justify-between items-center">
                                <div className="truncate flex-1 mr-4">
                                    <Link href={`/address/${output.address}`}>
                                        <HashBadge hash={output.address} />
                                    </Link>
                                </div>
                                <div className="font-mono text-green-400">{output.amount} DIL</div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
