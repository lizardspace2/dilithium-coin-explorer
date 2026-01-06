import { supabase } from '@/lib/supabase';
import { BlockFeed } from '@/components/blockchain/BlockFeed';
import { TxFeed } from '@/components/blockchain/TxFeed';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusOrb } from '@/components/ui/StatusOrb';
import { TransactionChart } from '@/components/blockchain/TransactionChart';
import { timeAgo } from '@/lib/utils';

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
  // Stats Logic
  const latestBlock = blocks?.[0];
  const height = latestBlock?.index || 0;
  // Calculate Supply: 100M Pre-mine + ~50 coins per block * height
  // Accurate calc requires summing all coinbase txs, but we'll approximate:
  const supply = `${(100000000 + (height * 50)).toLocaleString()} QTX`;

  const latestTimestamp = latestBlock?.timestamp || 0;
  const isLive = (Date.now() / 1000) - latestTimestamp < 600; // Live if block < 10 mins ago

  // Calc Avg Block Time (last 10 blocks)
  let avgBlockTime = 0;
  if (blocks && blocks.length > 1) {
    const oldestInBatch = blocks[blocks.length - 1];
    const timeDiff = latestBlock.timestamp - oldestInBatch.timestamp;
    avgBlockTime = Math.floor(timeDiff / (blocks.length - 1));
  }

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold font-space neon-text text-white">QUANTIX EXPLORER</h1>
          <p className="text-gray-400">Quantum Resistant Blockchain | Powered by Crystals-Dilithium</p>
        </div>
        <div className="flex items-center gap-2 glass-panel px-4 py-2">
          <span className="text-sm font-mono text-green-400">Mainnet Live</span>
          <StatusOrb status="active" />
        </div>
      </div>

      {/* Stats Grid */}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard title="Block Height">
          <div className="text-3xl font-mono text-cyan-400">#{height}</div>
        </GlassCard>
        <GlassCard title="Network Status">
          <div className="flex items-center gap-2">
            <StatusOrb status={isLive ? 'active' : 'inactive'} />
            <span className={`text-2xl font-bold ${isLive ? 'text-green-400' : 'text-red-400'}`}>
              {isLive ? 'ONLINE' : 'LAST UPDATE'}
            </span>
          </div>
          {(Date.now() / 1000) - latestTimestamp > 3600 && latestTimestamp > 0 && (
            <div className="text-xs text-red-500 mt-1">Last block: {timeAgo(latestTimestamp * 1000)}</div>
          )}
        </GlassCard>
        <GlassCard title="Avg Block Time">
          <div className="text-3xl font-mono text-neon-blue">{avgBlockTime}s</div>
        </GlassCard>
        <GlassCard title="Total Supply">
          <div className="text-3xl font-bold text-neon-purple">{supply}</div>
        </GlassCard>
      </div>



      {/* Charts */}
      < div className="w-full" >
        <TransactionChart />
      </div >

      {/* Main Feeds */}
      < div className="grid grid-cols-1 lg:grid-cols-2 gap-8" >
        <BlockFeed initialBlocks={blocks || []} />
        <TxFeed initialTxs={txs || []} />
      </div >
    </div >
  );
}
