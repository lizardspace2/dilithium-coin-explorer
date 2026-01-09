'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { HashBadge } from './HashBadge';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';

interface Block {
    index: number;
    hash: string;
    minter_address: string;
    transaction_count: number;
    timestamp: number;
}

export function BlockFeed({ initialBlocks }: { initialBlocks: Block[] }) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

    useEffect(() => {
        const channel = supabase
            .channel('public:blocks')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blocks' }, (payload) => {
                const newBlock = payload.new as Block;
                setBlocks((prev) => [newBlock, ...prev].slice(0, 10));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-space text-neon-blue">Latest Blocks</h2>
                <Link href="/blocks" className="text-sm text-gray-400 hover:text-white transition-colors">
                    View All →
                </Link>
            </div>
            <div className="glass-panel p-1">
                {blocks.map((block, i) => (
                    <div key={block.hash} className={`p-4 flex justify-between items-center hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-0 ${i === 0 ? 'bg-white/[0.02]' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex h-10 w-10 rounded-lg bg-neon-blue/10 items-center justify-center text-neon-blue">
                                <span className="font-bold text-lg">Bk</span>
                            </div>
                            <div>
                                <Link href={`/block/${block.index}`} className="text-lg font-bold hover:text-neon-blue transition-colors font-mono block">
                                    #{block.index}
                                </Link>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    <HashBadge hash={block.hash} />
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-300">{block.transaction_count} txs</div>
                            <div className="text-xs text-gray-600 font-mono mt-0.5">{timeAgo(block.timestamp * 1000)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
