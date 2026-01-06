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
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold font-space text-white">Transactions</h1>
            </div>

            <GlassCard title={`Latest Transactions (Page ${page})`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="p-3 font-medium">Tx Hash</th>
                                <th className="p-3 font-medium">Block</th>
                                <th className="p-3 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {txs?.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                                    <td className="p-3">
                                        <Link href={`/tx/${tx.id}`}>
                                            <HashBadge hash={tx.id} className="text-neon-blue hover:text-white" />
                                        </Link>
                                    </td>
                                    <td className="p-3">
                                        <Link href={`/block/${tx.block_index}`} className="text-purple hover:underline font-mono">
                                            #{tx.block_index}
                                        </Link>
                                    </td>
                                    <td className="p-3 text-gray-500">
                                        {timeAgo(tx.timestamp * 1000)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-500">
                        Showing {from + 1}-{Math.min(to + 1, count || 0)} of {count}
                    </div>
                    <div className="flex gap-2">
                        {page > 1 && (
                            <Link
                                href={`/transactions?page=${page - 1}`}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm transition-colors"
                            >
                                Previous
                            </Link>
                        )}
                        {page < totalPages && (
                            <Link
                                href={`/transactions?page=${page + 1}`}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm transition-colors"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
