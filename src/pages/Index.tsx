import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatCard } from "@/components/blockchain/StatCard";
import { BlockList } from "@/components/blockchain/BlockList";
import { TransactionList } from "@/components/blockchain/TransactionList";
import { GlassCard } from "@/components/blockchain/GlassCard";
import { 
  mockBlocks, 
  mockTransactions, 
  mockNetworkStats, 
  formatNumber 
} from "@/lib/mockData";
import { 
  Layers, 
  Gauge, 
  ArrowRightLeft, 
  Coins, 
  Shield,
  Zap
} from "lucide-react";

const Index = () => {
  const stats = mockNetworkStats;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Quantum-Resistant Security</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="neon-text">Dilithium</span>{" "}
            <span className="text-foreground">Nexus Explorer</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the quantum-resistant blockchain. Track blocks, transactions, 
            and addresses in real-time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Block Height"
            value={formatNumber(stats.blockHeight)}
            icon={Layers}
            trend={{ value: 2.4, label: "blocks/min" }}
          />
          <StatCard
            label="Difficulty"
            value={stats.difficulty.toString()}
            icon={Gauge}
          />
          <StatCard
            label="Transactions"
            value={formatNumber(stats.totalTransactions)}
            icon={ArrowRightLeft}
            trend={{ value: 12.5, label: "vs yesterday" }}
          />
          <StatCard
            label="Total Supply"
            value={`${(stats.totalSupply / 1000000).toFixed(1)}M DIL`}
            icon={Coins}
          />
        </div>

        {/* Network Info Banner */}
        <GlassCard className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-neon-green/10">
              <Zap className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <h3 className="font-semibold">Network Status: Healthy</h3>
              <p className="text-sm text-muted-foreground">
                Avg. block time: {stats.avgBlockTime}s • {mockBlocks[0]?.transactionCount} txs in latest block
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-muted-foreground">Live updates enabled</span>
          </div>
        </GlassCard>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BlockList blocks={mockBlocks} limit={8} />
          <TransactionList transactions={mockTransactions} limit={8} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
