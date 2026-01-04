import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/blockchain/GlassCard";
import { HashBadge } from "@/components/blockchain/HashBadge";
import { 
  mockTransactions, 
  formatDIL,
  getTotalValue,
  timeAgo,
  formatNumber
} from "@/lib/mockData";
import { 
  Wallet, 
  ArrowRightLeft,
  ArrowDownRight,
  ArrowUpRight,
  Copy,
  Check,
  QrCode
} from "lucide-react";
import { useState } from "react";

const AddressPage = () => {
  const { id } = useParams();
  const address = id || "";
  const [copied, setCopied] = useState(false);

  // Find transactions involving this address
  const addressTxs = mockTransactions.filter(tx => 
    tx.outputs.some(out => out.address === address) ||
    tx.inputs.some(inp => inp.txOutId.includes(address.slice(3, 10)))
  );

  // Calculate balance (mock: sum of outputs to this address)
  const balance = mockTransactions.reduce((sum, tx) => {
    const received = tx.outputs
      .filter(out => out.address === address)
      .reduce((s, out) => s + out.amount, 0);
    return sum + received;
  }, 0);

  // Mock transaction count
  const txCount = addressTxs.length || Math.floor(Math.random() * 50) + 10;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Address Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 rounded-xl bg-neon-green/10">
            <Wallet className="w-6 h-6 text-neon-green" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Address</h1>
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-mono text-sm text-muted-foreground break-all">
                {address}
              </code>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-muted/50 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-neon-green" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Balance & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard className="md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-neon-green/10">
                <Wallet className="w-8 h-8 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className="text-3xl font-bold neon-text">
                  {formatDIL(balance || 125847)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-primary/10">
                <ArrowRightLeft className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                <p className="text-3xl font-bold">{formatNumber(txCount)}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* QR Code Card */}
        <GlassCard className="mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="p-6 rounded-xl bg-white">
            <div className="w-24 h-24 flex items-center justify-center">
              <QrCode className="w-20 h-20 text-black" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Receive DIL</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Share this address to receive DIL tokens. Always verify the address before sending.
            </p>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {copied ? "Copied!" : "Copy Address"}
            </button>
          </div>
        </GlassCard>

        {/* Transaction History */}
        <GlassCard padding="none">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-semibold">Transaction History</h2>
          </div>
          
          <div className="divide-y divide-border/30">
            {(addressTxs.length > 0 ? addressTxs : mockTransactions.slice(0, 10)).map((tx) => {
              const isReceived = tx.outputs.some(out => out.address === address);
              const amount = isReceived 
                ? tx.outputs.filter(out => out.address === address).reduce((s, o) => s + o.amount, 0)
                : getTotalValue(tx);
              
              return (
                <Link
                  key={tx.id}
                  to={`/tx/${tx.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isReceived ? "bg-neon-green/10" : "bg-destructive/10"
                    }`}>
                      {isReceived ? (
                        <ArrowDownRight className="w-4 h-4 text-neon-green" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {isReceived ? "Received" : "Sent"}
                        </span>
                        <HashBadge hash={tx.id} type="tx" chars={6} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(tx.timestamp)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-mono text-sm font-medium ${
                    isReceived ? "text-neon-green" : "text-destructive"
                  }`}>
                    {isReceived ? "+" : "-"}{formatDIL(amount || Math.floor(Math.random() * 10000) + 100)}
                  </span>
                </Link>
              );
            })}
          </div>
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
};

export default AddressPage;
