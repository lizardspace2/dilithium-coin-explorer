import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from '@/components/blockchain/HashBadge';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 0;

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');
    const pageSize = 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: txs, count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .range(from, to);

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <div className="flex justify-between items-center animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold font-space text-white mb-2">Transactions</h1>
                    <p className="text-gray-400">View recent activity on the quantum ledger.</p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">Total Txs</div>
                    <div className="text-2xl font-mono text-neon-purple">{count ? count.toLocaleString() : '...'}</div>
                </div>
            </div>

            <div className="glass-panel p-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider font-medium">
                    <div className="col-span-5 md:col-span-5">Tx Hash</div>
                    <div className="col-span-4 md:col-span-4">Block</div>
                    <div className="col-span-3 md:col-span-3 text-right">Time</div>
                </div>

                <div className="divide-y divide-white/5">
                    {txs?.map((tx) => (
                        <div key={tx.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors items-center group">
                            <div className="col-span-5 md:col-span-5">
                                <Link href={`/tx/${tx.id}`} className="block">
                                    <div className="hidden md:block">
                                        <HashBadge hash={tx.id} className="text-neon-blue hover:text-white" noCopy />
                                    </div>
                                    <div className="md:hidden font-mono text-neon-blue truncate text-sm">
                                        {tx.id.substring(0, 10)}...
                                    </div>
                                </Link>
                            </div>
                            <div className="col-span-4 md:col-span-4">
                                <Link href={`/block/${tx.block_index}`} className="flex items-center gap-2 text-gray-300 hover:text-neon-purple transition-colors font-mono text-sm">
                                    <span className="text-neon-purple opacity-50">#</span>
                                    {tx.block_index}
                                </Link>
                            </div>
                            <div className="col-span-3 md:col-span-3 text-right text-gray-500 text-sm font-mono">
                                {timeAgo(tx.timestamp * 1000)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-sm text-gray-500 font-mono">
                    Showing <span className="text-white">{from + 1}-{Math.min(to + 1, count || 0)}</span> of <span className="text-white">{count}</span>
                </div>
                <div className="flex gap-2">
                    {page > 1 && (
                        <Link
                            href={`/transactions?page=${page - 1}`}
                            className="px-4 py-2 glass-panel hover:bg-white/10 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            ← Previous
                        </Link>
                    )}
                    {page < totalPages && (
                        <Link
                            href={`/transactions?page=${page + 1}`}
                            className="px-4 py-2 glass-panel hover:bg-white/10 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Next →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
