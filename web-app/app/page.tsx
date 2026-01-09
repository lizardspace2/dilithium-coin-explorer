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
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-12 pb-24 relative">

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-mono uppercase tracking-widest mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
            </span>
            Quantum Resistant Network
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-space text-white tracking-tight">
            QUANTIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">EXPLORER</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg font-light">
            Explore the next generation of blockchain technology. Secured by Crystals-Dilithium post-quantum cryptography.
          </p>
        </div>

        <div className="flex items-center gap-4 glass-panel px-6 py-3 bg-black/40">
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">Network Status</div>
            <div className={`text-lg font-bold ${isLive ? 'text-green-400' : 'text-red-400'}`}>
              {isLive ? 'MAINNET ONLINE' : 'DISCONNECTED'}
            </div>
          </div>
          <StatusOrb status={isLive ? 'active' : 'inactive'} className="scale-150" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <GlassCard title="Block Height">
          <div className="absolute top-4 right-4 text-neon-blue opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div className="text-4xl font-mono text-white mt-2">#{height.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2 font-mono">Latest: {timeAgo(latestTimestamp * 1000)}</div>
        </GlassCard>

        <GlassCard title="Avg Block Time">
          <div className="absolute top-4 right-4 text-neon-green opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div className="text-4xl font-mono text-neon-green mt-2">{avgBlockTime}s</div>
          <div className="text-xs text-gray-500 mt-2 font-mono">Target: 60s</div>
        </GlassCard>

        <GlassCard title="Total Supply">
          <div className="absolute top-4 right-4 text-neon-purple opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="2"></line></svg>
          </div>
          <div className="text-2xl font-bold text-white mt-2 break-all">{supply}</div>
          <div className="text-xs text-gray-500 mt-2 font-mono">Max: Infinite</div>
        </GlassCard>

        <GlassCard title="Hashrate (Est)">
          <div className="absolute top-4 right-4 text-orange-400 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
          </div>
          <div className="text-4xl font-mono text-orange-400 mt-2">-- MH/s</div>
          <div className="text-xs text-gray-500 mt-2 font-mono">Coming Soon</div>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-50">
            <div className="flex gap-2 text-xs font-mono text-gray-500">
              <span className="text-neon-blue">●</span> TX Volume
            </div>
          </div>
          <TransactionChart />
        </div>
      </div>

      {/* Main Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <BlockFeed initialBlocks={blocks || []} />
        <TxFeed initialTxs={txs || []} />
      </div>
    </div>
  );
}
