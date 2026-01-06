import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';

export default function QuantumSecurityPage() {
    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-12 text-white">
            <Link href="/" className="text-cyan hover:underline">← Back to Dashboard</Link>

            <header className="space-y-4">
                <h1 className="text-5xl font-bold font-space neon-text">Quantum Security</h1>
                <p className="text-xl text-gray-400">Why Quantix is built to survive the quantum era.</p>
            </header>

            <section className="space-y-6">
                <GlassCard title="The Threat: Shor's Algorithm">
                    <p className="text-gray-300 leading-relaxed">
                        Traditional blockchains like Bitcoin and Ethereum rely on <strong>Elliptic Curve Cryptography (ECC)</strong> to secure wallets and transactions.
                        While secure today, ECC is vulnerable to a specific quantum algorithm called <em>Shor's Algorithm</em>.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                        Experts predict that within the next decade, a sufficiently powerful quantum computer will be able to run this algorithm to derive private keys from public keys,
                        effectively breaking the security model of almost all existing cryptocurrencies.
                    </p>
                </GlassCard>

                <GlassCard title="The Solution: Crystals-Dilithium">
                    <p className="text-gray-300 leading-relaxed">
                        Quantix uses <strong>Crystals-Dilithium</strong>, a Digital Signature Algorithm (DSA) that is part of the <strong>NIST Post-Quantum Cryptography</strong> standardization suite.
                    </p>
                    <div className="my-6 p-4 bg-white/5 rounded-lg border-l-4 border-neon-purple">
                        <h3 className="text-neon-purple font-bold mb-2">Lattice-Based Cryptography</h3>
                        <p className="text-sm text-gray-400">
                            Dilithium's security is based on the hardness of finding short vectors in lattices (Module-LWE and Module-SIS problems).
                            Unlike factorization (which Shor's algorithm solves), these lattice problems currently have no known efficient quantum solution.
                        </p>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        By using Dilithium signatures for every transaction, Quantix ensures that your funds remain secure even in a world with powerful quantum computers.
                    </p>
                </GlassCard>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h3 className="text-xl font-bold mb-2">Future Proof</h3>
                    <p className="text-gray-400 text-sm">Your keys are generated using quantum-resistant math from day one.</p>
                </div>
                <div className="glass-panel p-6">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2">High Performance</h3>
                    <p className="text-gray-400 text-sm">Dilithium offers fast signature verification, ensuring high network throughput.</p>
                </div>
            </section>
        </div>
    );
}
