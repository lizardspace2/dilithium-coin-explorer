import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
    return (
        <footer className="border-t border-glass-border bg-black/40 backdrop-blur-md text-gray-400 py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <Logo size="sm" />
                    <p className="text-sm">
                        The next generation quantum-secure blockchain explorer.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Blockchain</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/blocks" className="hover:text-neon-blue transition-colors">Blocks</Link></li>
                        <li><Link href="/transactions" className="hover:text-neon-blue transition-colors">Transactions</Link></li>
                        <li><Link href="/validators" className="hover:text-neon-blue transition-colors">Validators</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-neon-blue transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-neon-blue transition-colors">API</Link></li>
                        <li><Link href="#" className="hover:text-neon-blue transition-colors">Whitepaper</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Community</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-neon-blue transition-colors">GitHub</Link></li>
                        <li><Link href="#" className="hover:text-neon-blue transition-colors">Discord</Link></li>
                        <li><Link href="#" className="hover:text-neon-blue transition-colors">Twitter</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
                &copy; {new Date().getFullYear()} Quantix Explorer. All rights reserved.
            </div>
        </footer>
    );
}
