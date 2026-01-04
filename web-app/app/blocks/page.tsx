import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from '@/components/blockchain/HashBadge';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 0;

export default async function BlocksPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');
    const pageSize = 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: blocks, count } = await supabase
        .from('blocks')
        .select('*', { count: 'exact' })
        .order('index', { ascending: false })
        .range(from, to);

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold font-space text-white">Blocks</h1>
            </div>

            <GlassCard title={`Latest Blocks (Page ${page})`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="p-3 font-medium">Height</th>
                                <th className="p-3 font-medium">Hash</th>
                                <th className="p-3 font-medium">Tx Count</th>
                                <th className="p-3 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {blocks?.map((block) => (
                                <tr key={block.index} className="hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                                    <td className="p-3">
                                        <Link href={`/block/${block.index}`} className="text-neon-blue hover:underline font-mono">
                                            {block.index}
                                        </Link>
                                    </td>
                                    <td className="p-3">
                                        <HashBadge hash={block.hash} />
                                    </td>
                                    <td className="p-3 text-neon-purple font-mono">
                                        {block.transaction_count}
                                    </td>
                                    <td className="p-3 text-gray-500">
                                        {timeAgo(block.timestamp)}
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
                                href={`/blocks?page=${page - 1}`}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm transition-colors"
                            >
                                Previous
                            </Link>
                        )}
                        {page < totalPages && (
                            <Link
                                href={`/blocks?page=${page + 1}`}
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
