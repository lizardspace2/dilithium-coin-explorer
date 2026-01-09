import Link from 'next/link';

export function QuantumBanner() {
    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-b border-white/5 relative z-50">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent opacity-50" />
            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center items-center text-xs md:text-sm font-medium tracking-wide">
                <Link href="/quantum-security" className="group flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-white/5 transition-all duration-300">
                    <span className="text-neon-purple animate-pulse-slow">🛡️</span>
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                        Secured by <span className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">Post-Quantum Cryptography</span>
                    </span>
                    <span className="text-gray-600 group-hover:text-neon-purple transform group-hover:translate-x-1 transition-all">→</span>
                </Link>
            </div>
        </div>
    );
}
