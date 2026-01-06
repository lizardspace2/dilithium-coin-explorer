import Link from 'next/link';
import { SearchBar } from './SearchBar';

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="font-bold text-xl font-space tracking-tight hover:text-neon-blue transition-colors">
                        QUANTIX<span className="text-neon-blue">EXPLORER</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/blocks" className="hover:text-white transition-colors">Blocks</Link>
                        <Link href="/transactions" className="hover:text-white transition-colors">Transactions</Link>
                    </nav>
                </div>
                <div>
                    <SearchBar />
                </div>
            </div>
        </header>
    );
}
