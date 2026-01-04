import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from '@/components/blockchain/HashBadge';
import { formatBalance } from '@/lib/utils';
import Link from 'next/link';
import type { TxOutput } from '@/lib/types';

interface OutputWithTx extends TxOutput {
    transactions: { block_index: number; timestamp: number; } | null; // Joined
}

async function getAddressBalance(address: string) {
    try {
        const NODE_URL = process.env.NODE_URL || 'http://localhost:3001';
        const res = await fetch(`${NODE_URL}/address/${address}/balance`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.balance;
    } catch (e) {
        console.error('Failed to fetch balance from node', e);
        return null;
    }
}

export default async function AddressPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch Balance from Node
    const balance = await getAddressBalance(id);

    // Fetch History from DB (Outputs)
    // Showing only received transactions for simplicity in this MVP
    const { data: outputTxs } = await supabase
        .from('tx_outputs')
        .select('*, transactions(timestamp, block_index)')
        .eq('address', id)
        .order('transaction_id', { ascending: false }) // Approximate ordering
        .limit(20);

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <Link href="/" className="text-cyan hover:underline">← Back to Dashboard</Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-space text-gray-400">Address</h1>
                    <div className="text-xl md:text-3xl font-mono break-all text-white">{id}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard title="Portfolio">
                    <div className="text-sm text-gray-400 mb-1">Current Balance</div>
                    <div className="text-4xl font-bold font-space text-green-400">
                        {balance !== null ? `${formatBalance(balance)} DIL` : '---'}
                    </div>
                </GlassCard>

                <GlassCard title="QR Code">
                    <div className="flex justify-center items-center h-full">
                        {/* Real QR code generation would go here */}
                        <div className="w-32 h-32 bg-white p-2 rounded">
                            <div className="w-full h-full bg-black/10 flex items-center justify-center text-xs text-black">
                                [QR CODE]
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <GlassCard title="Recent Transfers">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400">
                                <th className="p-2">Tx ID</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Block</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outputTxs && (outputTxs as unknown as OutputWithTx[]).map((out) => (
                                <tr key={out.id} className="hover:bg-white/5">
                                    <td className="p-2">
                                        <Link href={`/tx/${out.transaction_id}`}>
                                            <HashBadge hash={out.transaction_id || ''} />
                                        </Link>
                                    </td>
                                    <td className="p-2 text-green-400">+{out.amount}</td>
                                    <td className="p-2">#{out.transactions?.block_index}</td>
                                </tr>
                            ))}
                            {(!outputTxs || outputTxs.length === 0) && (
                                <tr><td colSpan={3} className="p-4 text-center text-gray-500">No recent transactions found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
