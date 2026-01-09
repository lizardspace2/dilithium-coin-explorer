import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/blockchain/GlassCard";
import { HashBadge } from "@/components/blockchain/HashBadge";
import { mockBlocks, formatNumber, timeAgo, shortenAddress } from "@/lib/mockData";
import { Box, ArrowRight } from "lucide-react";

const BlocksListPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-neon-purple/10">
            <Box className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Blocks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse all minted blocks on the Quantix network
            </p>
          </div>
        </div>

        <GlassCard padding="none">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border/50 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Block</div>
            <div className="col-span-3">Hash</div>
            <div className="col-span-3">Minter</div>
            <div className="col-span-1">Txs</div>
            <div className="col-span-1">Diff</div>
            <div className="col-span-2 text-right">Age</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/30">
            {mockBlocks.map((block) => (
              <Link
                key={block.hash}
                to={`/block/${block.index}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-muted/30 transition-colors items-center"
              >
                {/* Block Number */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center md:hidden">
                    <Box className="w-4 h-4 text-neon-purple" />
                  </div>
                  <div>
                    <span className="font-medium">#{formatNumber(block.index)}</span>
                    <p className="md:hidden text-xs text-muted-foreground mt-0.5">
                      {block.transactionCount} txs • {timeAgo(block.timestamp)}
                    </p>
                  </div>
                </div>

                {/* Hash */}
                <div className="md:col-span-3 hidden md:block">
                  <HashBadge hash={block.hash} type="block" chars={8} />
                </div>

                {/* Minter */}
                <div className="md:col-span-3 hidden md:block">
                  <HashBadge hash={block.minterAddress} type="address" chars={8} />
                </div>

                {/* Txs */}
                <div className="md:col-span-1 hidden md:block">
                  <span className="text-sm">{block.transactionCount}</span>
                </div>

                {/* Difficulty */}
                <div className="md:col-span-1 hidden md:block">
                  <span className="text-sm">{block.difficulty}</span>
                </div>

                {/* Age */}
                <div className="md:col-span-2 hidden md:flex justify-end items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {timeAgo(block.timestamp)}
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

export default BlocksListPage;
