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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const q = query.trim();
        setLoading(true); // UI feedback

        // Heuristics
        const isNumber = /^\d+$/.test(q);
        const isHash = /^[a-fA-F0-9]{64}$/.test(q);

        // Routing
        if (isNumber) {
            router.push(`/block/${q}`);
        } else if (isHash) {
            // Assume Transactions for hashes usually, or try standard lookup
            // For explorer UX, jumping to TX page is a safe default for 64-char hex
            router.push(`/tx/${q}`);
        } else {
            // Assume Address for everything else
            router.push(`/address/${q}`);
        }

        // Reset state after navigation
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 800);
    };

    if (!open) return (
        <button onClick={() => setOpen(true)} className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-full bg-white/5 transition-all hover:bg-white/10 hover:border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Search Blockchain...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-white/10 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                <span className="text-xs">Ctrl K</span>
            </kbd>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-[20vh] animate-in fade-in duration-200" onClick={() => setOpen(false)}>
            <div className="w-full max-w-2xl p-4" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
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
                        className={`w-full bg-[#0a0a1a] border ${error ? 'border-red-500/50' : 'border-white/10 focus:border-neon-blue/50'} text-white rounded-2xl py-6 pl-12 pr-6 text-xl outline-none shadow-2xl transition-all placeholder:text-gray-600`}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (error) setError('');
                        }}
                    />
                    {error && (
                        <div className="absolute top-full left-0 mt-2 px-4 text-sm text-red-400 flex items-center gap-2 animate-in slide-in-from-top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            {error}
                        </div>
                    )}
                </form>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Enter</span>
                        <span className="text-gray-300">to search</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Esc</span>
                        <span className="text-gray-300">to close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
