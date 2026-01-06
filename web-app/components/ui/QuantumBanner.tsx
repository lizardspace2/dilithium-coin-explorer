import Link from 'next/link';

export function QuantumBanner() {
    return (
        <div className="w-full bg-gradient-to-r from-neon-purple/20 via-blue-900/40 to-neon-purple/20 border-b border-white/10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center items-center text-sm">
                <Link href="/quantum-security" className="group flex items-center gap-2 hover:opacity-100 transition-opacity">
                    <span className="text-neon-purple animate-pulse">🛡️</span>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                        Secured by <span className="font-bold text-neon-blue">Post-Quantum Cryptography</span>
                    </span>
                    <span className="text-gray-500 group-hover:text-white transition-colors">→</span>
                </Link>
            </div>
        </div>
    );
}
