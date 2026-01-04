import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/blockchain/GlassCard";
import { HashBadge } from "@/components/blockchain/HashBadge";
import { 
  mockBlocks, 
  mockTransactions, 
  formatNumber, 
  formatDate, 
  timeAgo,
  formatDIL,
  getTotalValue
} from "@/lib/mockData";
import { 
  ChevronLeft, 
  ChevronRight, 
  Box, 
  Clock, 
  Hash,
  User,
  ArrowRightLeft,
  ArrowRight
} from "lucide-react";

const BlockPage = () => {
  const { id } = useParams();
  const blockIndex = parseInt(id || "0");
  
  const block = mockBlocks.find(b => b.index === blockIndex) || mockBlocks[0];
  const prevBlock = mockBlocks.find(b => b.index === blockIndex - 1);
  const nextBlock = mockBlocks.find(b => b.index === blockIndex + 1);
  
  const blockTxs = mockTransactions.filter(tx => tx.blockIndex === block.index);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Block Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-neon-purple/10">
              <Box className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Block <span className="neon-text-purple">#{formatNumber(block.index)}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {timeAgo(block.timestamp)} • {formatDate(block.timestamp)}
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link
              to={prevBlock ? `/block/${prevBlock.index}` : "#"}
              className={`p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors ${!prevBlock && "opacity-50 pointer-events-none"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link
              to={nextBlock ? `/block/${nextBlock.index}` : "#"}
              className={`p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors ${!nextBlock && "opacity-50 pointer-events-none"}`}
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Block Details */}
        <GlassCard className="mb-8">
          <h2 className="text-lg font-semibold mb-6">Block Details</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <Hash className="w-4 h-4" />
                <span className="text-sm">Block Hash</span>
              </div>
              <HashBadge hash={block.hash} type="block" shortened={false} className="break-all" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <Hash className="w-4 h-4" />
                <span className="text-sm">Parent Hash</span>
              </div>
              <Link to={prevBlock ? `/block/${prevBlock.index}` : "#"}>
                <HashBadge hash={block.prevHash} type="block" chars={12} />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Timestamp</span>
              </div>
              <span className="font-mono text-sm">{formatDate(block.timestamp)}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <User className="w-4 h-4" />
                <span className="text-sm">Minter</span>
              </div>
              <Link to={`/address/${block.minterAddress}`}>
                <HashBadge hash={block.minterAddress} type="address" chars={12} />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="text-sm">Transactions</span>
              </div>
              <span className="font-medium">{block.transactionCount}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                <Box className="w-4 h-4" />
                <span className="text-sm">Difficulty</span>
              </div>
              <span className="font-medium">{block.difficulty}</span>
            </div>
          </div>
        </GlassCard>

        {/* Transactions in Block */}
        <GlassCard padding="none">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-semibold">Transactions ({blockTxs.length})</h2>
          </div>
          
          <div className="divide-y divide-border/30">
            {blockTxs.length > 0 ? (
              blockTxs.map((tx) => (
                <Link
                  key={tx.id}
                  to={`/tx/${tx.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRightLeft className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <HashBadge hash={tx.id} type="tx" chars={12} />
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{tx.inputs.length} inputs</span>
                        <ArrowRight className="w-3 h-3" />
                        <span>{tx.outputs.length} outputs</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-medium text-neon-green">
                    {formatDIL(getTotalValue(tx))}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-muted-foreground">
                No transactions in this block
              </div>
            )}
          </div>
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
};

export default BlockPage;
