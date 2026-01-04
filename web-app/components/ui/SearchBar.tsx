'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Ctrl+K to toggle
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        const q = query.trim();

        // 1. Check if Integer (Block Index)
        if (/^\d+$/.test(q)) {
            router.push(`/block/${q}`);
            setOpen(false);
            return;
        }

        // 2. Check if Length 64 (Hash)
        if (q.length === 64) {
            // Check Block Hash
            const { data: block } = await supabase.from('blocks').select('index').eq('hash', q).single();
            if (block) {
                router.push(`/block/${block.index}`);
                setOpen(false);
                return;
            }

            // Check Tx Hash
            const { data: tx } = await supabase.from('transactions').select('id').eq('id', q).single();
            if (tx) {
                router.push(`/tx/${q}`);
                setOpen(false);
                return;
            }
        }

        // 3. Default to Address
        // Simple heuristic: if it looks like an address (usually hex, maybe different length)
        // Dilithium addresses might be public keys. Let's assume if it's not the above, it's an address.
        router.push(`/address/${q}`);
        setOpen(false);
    };

    if (!open) return (
        <button onClick={() => setOpen(true)} className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-cyan border border-white/10 px-3 py-1.5 rounded-full bg-white/5 transition-colors">
            <span>Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100">
                <span className="text-xs">Ctrl K</span>
            </kbd>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
            <div className="w-full max-w-lg p-4" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSearch} className="relative">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search blocks, txs, addresses..."
                        className="w-full bg-[#0a0a1a] border border-cyan/30 text-white rounded-xl py-4 px-6 text-lg outline-none shadow-[0_0_20px_rgba(0,243,255,0.1)] focus:shadow-[0_0_30px_rgba(0,243,255,0.2)] placeholder:text-gray-600"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
                <div className="text-center mt-4 text-sm text-gray-500">
                    Press <span className="text-gray-300">Enter</span> to search
                </div>
            </div>
        </div>
    );
}
