import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { shortenHash } from "@/lib/mockData";

interface HashBadgeProps {
  hash: string;
  type?: "block" | "tx" | "address";
  className?: string;
  shortened?: boolean;
  chars?: number;
}

export const HashBadge = ({ 
  hash, 
  type = "tx",
  className,
  shortened = true,
  chars = 8
}: HashBadgeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayHash = shortened ? shortenHash(hash, chars) : hash;

  const typeColors = {
    block: "hover:border-neon-purple/50 hover:bg-neon-purple/10",
    tx: "hover:border-neon-cyan/50 hover:bg-neon-cyan/10",
    address: "hover:border-neon-green/50 hover:bg-neon-green/10",
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "hash-badge inline-flex items-center gap-2 group",
        typeColors[type],
        className
      )}
    >
      <span className="font-mono text-sm text-foreground/90">{displayHash}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-neon-green" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </span>
    </button>
  );
};
