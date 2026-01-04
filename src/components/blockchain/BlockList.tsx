import { Link } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { HashBadge } from "./HashBadge";
import { Block, timeAgo, formatNumber } from "@/lib/mockData";
import { Box, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockListProps {
  blocks: Block[];
  limit?: number;
  showHeader?: boolean;
}

export const BlockList = ({ 
  blocks, 
  limit = 10, 
  showHeader = true 
}: BlockListProps) => {
  const displayBlocks = blocks.slice(0, limit);

  return (
    <GlassCard padding="none" className="overflow-hidden">
      {showHeader && (
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-purple/10">
              <Box className="w-4 h-4 text-neon-purple" />
            </div>
            <h3 className="font-semibold">Latest Blocks</h3>
          </div>
          <Link 
            to="/blocks" 
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
      
      <div className="divide-y divide-border/30">
        {displayBlocks.map((block, index) => (
          <Link
            key={block.hash}
            to={`/block/${block.index}`}
            className={cn(
              "flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors",
              index === 0 && "animate-slide-in bg-primary/5"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                <span className="text-sm font-mono font-bold text-neon-purple">
                  {block.index.toString().slice(-3)}
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Block #{formatNumber(block.index)}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <HashBadge hash={block.hash} type="block" chars={6} />
                  <span className="text-xs text-muted-foreground">
                    {block.transactionCount} txs
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-sm text-muted-foreground">
                {timeAgo(block.timestamp)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
};
