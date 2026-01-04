import { supabase } from '@/lib/supabase';
import { BlockFeed } from '@/components/blockchain/BlockFeed';
import { TxFeed } from '@/components/blockchain/TxFeed';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusOrb } from '@/components/ui/StatusOrb';

export const revalidate = 0; // Dynamic

export default async function Dashboard() {
  // Fetch initial data
  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .order('index', { ascending: false })
    .limit(10);

  const { data: txs } = await supabase
    .from('transactions')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(10);

  // Stats (Optimized: use count or dedicated stats table in production)
  // For now, let's just grab the latest block for height.
  const height = blocks?.[0]?.index || 0;
  const difficulty = blocks?.[0]?.difficulty || 0;
  const supply = '1,000,000 DIL'; // Placeholder or calc

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold font-space neon-glow">DILITHIUM NEXUS</h1>
          <p className="text-text-secondary">Quantum Secure Blockchain Explorer</p>
        </div>
        <div className="flex items-center gap-2 glass-panel px-4 py-2">
          <span className="text-sm font-mono text-green-400">Mainnet Live</span>
          <StatusOrb status="active" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard title="Block Height">
          <div className="text-3xl font-mono">{height}</div>
        </GlassCard>
        <GlassCard title="Difficulty">
          <div className="text-3xl font-mono">{difficulty}</div>
        </GlassCard>
        <GlassCard title="24h Txs">
          <div className="text-3xl font-mono text-cyan">--</div>
        </GlassCard>
        <GlassCard title="Supply">
          <div className="text-3xl font-bold text-purple">{supply}</div>
        </GlassCard>
      </div>

      {/* Main Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BlockFeed initialBlocks={blocks || []} />
        <TxFeed initialTxs={txs || []} />
      </div>
    </div>
  );
}
