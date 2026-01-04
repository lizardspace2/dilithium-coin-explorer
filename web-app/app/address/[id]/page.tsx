import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from '@/components/blockchain/HashBadge';
import { formatBalance } from '@/lib/utils';
import Link from 'next/link';
import type { TxOutput } from '@/lib/types';
import { ClientQRCode } from '@/components/ui/ClientQRCode';
import { CopyButton } from '@/components/ui/CopyButton';

interface OutputWithTx extends TxOutput {
    transactions: { block_index: number; timestamp: number; } | null; // Joined
}

async function getAddressBalance(address: string) {
    try {
        const NODE_URL = process.env.NODE_URL || 'http://34.66.15.88:3001';
        // The node returns { unspentTxOuts: [...] } at /address/:id
        const res = await fetch(`${NODE_URL}/address/${address}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();

        // Calculate balance from UTXOs if balance is not provided directly
        if (data.balance !== undefined) return data.balance;
        if (Array.isArray(data.unspentTxOuts)) {
            return data.unspentTxOuts.reduce((acc: number, out: any) => acc + out.amount, 0);
        }
        return 0;
    } catch (e) {
        console.warn('Node unavailable, displaying cached/empty data.');
        return null;
    }
}

export default async function AddressPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

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
                    <div className="flex items-center gap-3">
                        <div className="text-xl md:text-3xl font-mono break-all text-white">{id}</div>
                        <CopyButton text={id} />
                    </div>
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
                    <div className="flex justify-center items-center h-full py-4">
                        <ClientQRCode value={id} />
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
