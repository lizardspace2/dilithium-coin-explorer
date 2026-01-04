import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/blockchain/GlassCard";
import { HashBadge } from "@/components/blockchain/HashBadge";
import { 
  mockTransactions, 
  mockBlocks,
  formatDate, 
  timeAgo,
  formatDIL,
  getTotalValue,
  shortenAddress
} from "@/lib/mockData";
import { 
  ArrowRightLeft, 
  Clock, 
  Hash,
  Box,
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react";

const TransactionPage = () => {
  const { id } = useParams();
  
  const tx = mockTransactions.find(t => t.id === id) || mockTransactions[0];
  const block = mockBlocks.find(b => b.index === tx.blockIndex);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Transaction Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <ArrowRightLeft className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Transaction Details</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {timeAgo(tx.timestamp)} • {formatDate(tx.timestamp)}
            </p>
          </div>
        </div>

        {/* Transaction Overview */}
        <GlassCard className="mb-8">
          <h2 className="text-lg font-semibold mb-6">Overview</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <Hash className="w-4 h-4" />
                <span className="text-sm">Transaction ID</span>
              </div>
              <HashBadge hash={tx.id} type="tx" shortened={false} className="break-all" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <Box className="w-4 h-4" />
                <span className="text-sm">Block</span>
              </div>
              <Link to={`/block/${tx.blockIndex}`} className="text-primary hover:underline">
                #{tx.blockIndex}
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Timestamp</span>
              </div>
              <span className="font-mono text-sm">{formatDate(tx.timestamp)}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="text-sm">Total Value</span>
              </div>
              <span className="font-mono font-bold text-lg text-neon-green">
                {formatDIL(getTotalValue(tx))}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Inputs & Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <GlassCard padding="none">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <ArrowUpRight className="w-4 h-4 text-destructive" />
              </div>
              <h2 className="font-semibold">Inputs ({tx.inputs.length})</h2>
            </div>
            
            <div className="divide-y divide-border/30">
              {tx.inputs.map((input, idx) => (
                <div key={idx} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Input #{idx}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">From TX:</span>
                      <Link to={`/tx/${input.txOutId}`}>
                        <HashBadge hash={input.txOutId} type="tx" chars={8} />
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Output Index:</span>
                      <span className="font-mono text-sm">{input.txOutIndex}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Outputs */}
          <GlassCard padding="none">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon-green/10">
                <ArrowDownRight className="w-4 h-4 text-neon-green" />
              </div>
              <h2 className="font-semibold">Outputs ({tx.outputs.length})</h2>
            </div>
            
            <div className="divide-y divide-border/30">
              {tx.outputs.map((output, idx) => (
                <div key={idx} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Output #{idx}</span>
                    <span className="font-mono text-sm font-medium text-neon-green">
                      {formatDIL(output.amount)}
                    </span>
                  </div>
                  <Link to={`/address/${output.address}`}>
                    <HashBadge hash={output.address} type="address" chars={12} />
                  </Link>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TransactionPage;
