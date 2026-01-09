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
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <div className="flex justify-between items-center animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold font-space text-white mb-2">Blocks</h1>
                    <p className="text-gray-400">Explore the latest blocks mined on the network.</p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">Total Blocks</div>
                    <div className="text-2xl font-mono text-neon-blue">{count ? count.toLocaleString() : '...'}</div>
                </div>
            </div>

            <div className="glass-panel p-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider font-medium">
                    <div className="col-span-2">Height</div>
                    <div className="col-span-6 md:col-span-5">Hash</div>
                    <div className="col-span-2 md:col-span-2 text-center">Txns</div>
                    <div className="col-span-2 md:col-span-3 text-right">Time</div>
                </div>

                <div className="divide-y divide-white/5">
                    {blocks?.map((block) => (
                        <div key={block.index} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors items-center group">
                            <div className="col-span-2">
                                <Link href={`/block/${block.index}`} className="font-mono font-bold text-neon-blue group-hover:underline decoration-neon-blue/50 underline-offset-4">
                                    #{block.index}
                                </Link>
                            </div>
                            <div className="col-span-6 md:col-span-5 flex items-center">
                                <div className="hidden md:block w-full">
                                    <HashBadge hash={block.hash} className="text-gray-300" />
                                </div>
                                <div className="md:hidden truncate font-mono text-sm text-gray-300">
                                    {block.hash.substring(0, 12)}...
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-2 text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-neon-purple/10 text-neon-purple font-mono text-xs">
                                    {block.transaction_count}
                                </span>
                            </div>
                            <div className="col-span-2 md:col-span-3 text-right text-gray-500 text-sm font-mono">
                                {timeAgo(block.timestamp * 1000)}
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
                            href={`/blocks?page=${page - 1}`}
                            className="px-4 py-2 glass-panel hover:bg-white/10 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            ← Previous
                        </Link>
                    )}
                    {page < totalPages && (
                        <Link
                            href={`/blocks?page=${page + 1}`}
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
