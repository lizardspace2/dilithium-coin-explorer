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
            {blocks.map((block) => (
                <div key={block.hash} className="glass-panel p-4 flex justify-between items-center hover:bg-white/5 transition-all animate-in fade-in slide-in-from-top-4 duration-500 border-l-2 border-l-transparent hover:border-l-neon-blue">
                    <div>
                        <Link href={`/block/${block.index}`} className="text-lg font-bold hover:text-neon-blue block">
                            #{block.index}
                        </Link>
                        <div className="text-xs text-gray-400 mt-1">
                            <HashBadge hash={block.hash} />
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-mono text-neon-purple">{block.transaction_count} txs</div>
                        <div className="text-xs text-gray-500">{timeAgo(block.timestamp * 1000)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
