'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
        if (!query.trim()) return;

        const q = query.trim();
        setLoading(true); // UI feedback
        setError('');

        try {
            // Heuristics
            const isNumber = /^\d+$/.test(q);
            const isHash = /^[a-fA-F0-9]{64}$/.test(q);

            if (isNumber) {
                // Block Index
                router.push(`/block/${q}`);
            } else if (isHash) {
                // Ambiguity: Could be Tx Hash, Block Hash, or Address
                // check Transaction first (most common search)
                const { data: tx } = await supabase
                    .from('transactions')
                    .select('id')
                    .eq('id', q)
                    .maybeSingle();

                if (tx) {
                    router.push(`/tx/${q}`);
                } else {
                    // Check Block Hash
                    const { data: block } = await supabase
                        .from('blocks')
                        .select('index')
                        .eq('hash', q)
                        .maybeSingle();

                    if (block) {
                        router.push(`/block/${block.index}`);
                    } else {
                        // Fallback to Address
                        router.push(`/address/${q}`);
                    }
                }
            } else {
                // Assume Address for everything else
                router.push(`/address/${q}`);
            }

            // Reset state after navigation
            setTimeout(() => {
                setLoading(false);
                setOpen(false);
            }, 800);
        } catch (err) {
            console.error('Search failed', err);
            setError('Search failed. Please try again.');
            setLoading(false);
        }
    };

    if (!open) return (
        <>
            {/* Desktop Trigger */}
            <button onClick={() => setOpen(true)} className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-full bg-white/5 transition-all hover:bg-white/10 hover:border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Search...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-white/10 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                    <span className="text-xs">Ctrl K</span>
                </kbd>
            </button>

            {/* Mobile Trigger */}
            <button onClick={() => setOpen(true)} className="md:hidden flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white rounded-full bg-white/5 border border-white/10 active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
        </>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200" onClick={() => setOpen(false)}>
            <div className="w-full max-w-2xl transform transition-all animate-in slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="relative group p-[1px] rounded-2xl bg-gradient-to-r from-neon-blue/50 via-neon-purple/50 to-neon-blue/50 shadow-2xl shadow-neon-blue/20">
                    <form onSubmit={handleSearch} className="relative bg-[#050508] rounded-2xl overflow-hidden">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-blue"></div>
                            ) : (
                                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-neon-blue transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            )}
                        </div>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search by Block Height, Hash, or Address..."
                            className={`w-full bg-transparent border-none text-white text-xl py-6 pl-14 pr-6 outline-none placeholder:text-gray-600 font-light tracking-wide`}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                if (error) setError('');
                            }}
                        />
                        {error && (
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 text-sm text-red-400 flex items-center gap-2 animate-in fade-in slide-in-from-right-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className="mt-4 flex gap-3 justify-center opacity-0 animate-in fade-in slide-in-from-top-2 fill-mode-forwards delay-100">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-gray-500">
                        <kbd className="font-mono bg-white/10 rounded px-1 text-gray-300">Enter</kbd>
                        <span>to search</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-gray-500">
                        <kbd className="font-mono bg-white/10 rounded px-1 text-gray-300">Esc</kbd>
                        <span>to close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
