import { Link } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { HashBadge } from "./HashBadge";
import { Transaction, timeAgo, formatDIL, getTotalValue } from "@/lib/mockData";
import { ArrowRightLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  showHeader?: boolean;
}

export const TransactionList = ({ 
  transactions, 
  limit = 10, 
  showHeader = true 
}: TransactionListProps) => {
  const displayTxs = transactions.slice(0, limit);

  return (
    <GlassCard padding="none" className="overflow-hidden">
      {showHeader && (
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold">Latest Transactions</h3>
          </div>
          <Link 
            to="/transactions" 
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
      
      <div className="divide-y divide-border/30">
        {displayTxs.map((tx, index) => (
          <Link
            key={tx.id}
            to={`/tx/${tx.id}`}
            className={cn(
              "flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors",
              index === 0 && "animate-slide-in bg-primary/5"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-primary" />
              </div>
              
              <div>
                <HashBadge hash={tx.id} type="tx" chars={8} />
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{tx.inputs.length} inputs</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{tx.outputs.length} outputs</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="font-mono text-sm font-medium text-neon-green">
                {formatDIL(getTotalValue(tx))}
              </span>
              <div className="text-xs text-muted-foreground mt-1">
                {timeAgo(tx.timestamp)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
};
