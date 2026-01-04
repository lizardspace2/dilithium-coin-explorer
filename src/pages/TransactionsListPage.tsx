import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/blockchain/GlassCard";
import { HashBadge } from "@/components/blockchain/HashBadge";
import { mockTransactions, formatDIL, getTotalValue, timeAgo } from "@/lib/mockData";
import { ArrowRightLeft, ArrowRight } from "lucide-react";

const TransactionsListPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <ArrowRightLeft className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse all transactions on the Dilithium network
            </p>
          </div>
        </div>

        <GlassCard padding="none">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border/50 text-sm font-medium text-muted-foreground">
            <div className="col-span-4">Transaction Hash</div>
            <div className="col-span-2">Block</div>
            <div className="col-span-2">Inputs</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-2 text-right">Age</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-border/30">
            {mockTransactions.slice(0, 50).map((tx) => (
              <Link
                key={tx.id}
                to={`/tx/${tx.id}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-muted/30 transition-colors items-center"
              >
                {/* Hash */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center md:hidden">
                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <HashBadge hash={tx.id} type="tx" chars={10} />
                    <div className="md:hidden flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="text-neon-green font-mono">{formatDIL(getTotalValue(tx))}</span>
                      <span>•</span>
                      <span>{timeAgo(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Block */}
                <div className="md:col-span-2 hidden md:block">
                  <Link 
                    to={`/block/${tx.blockIndex}`}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{tx.blockIndex}
                  </Link>
                </div>
                
                {/* Inputs/Outputs */}
                <div className="md:col-span-2 hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{tx.inputs.length} in</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{tx.outputs.length} out</span>
                </div>
                
                {/* Value */}
                <div className="md:col-span-2 hidden md:block">
                  <span className="font-mono text-sm font-medium text-neon-green">
                    {formatDIL(getTotalValue(tx))}
                  </span>
                </div>
                
                {/* Age */}
                <div className="md:col-span-2 hidden md:flex justify-end items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {timeAgo(tx.timestamp)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
};

export default TransactionsListPage;
