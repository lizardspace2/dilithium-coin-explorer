'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { Logo } from './Logo';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-8">
                    <Logo />
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/blocks" className="hover:text-white transition-colors">Blocks</Link>
                        <Link href="/transactions" className="hover:text-white transition-colors">Transactions</Link>
                        <a href="https://quantumresistantcoin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-blue transition-colors flex items-center gap-1">
                            Main Site <span className="text-xs">↗</span>
                        </a>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <SearchBar />

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-[#050508] border-b border-glass-border shadow-2xl animate-in slide-in-from-top-2">
                    <nav className="flex flex-col p-4 space-y-4 text-base font-medium text-gray-400">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/5">Dashboard</Link>
                        <Link href="/blocks" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/5">Blocks</Link>
                        <Link href="/transactions" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/5">Transactions</Link>
                        <a href="https://quantumresistantcoin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-blue transition-colors flex items-center gap-1 py-2 text-neon-blue">
                            Main Site <span className="text-xs">↗</span>
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
