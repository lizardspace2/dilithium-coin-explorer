import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Command, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const detectSearchType = (value: string): "block" | "tx" | "address" | null => {
    const trimmed = value.trim();
    
    // If it's a number, it's a block index
    if (/^\d+$/.test(trimmed)) {
      return "block";
    }
    
    // If it starts with DIL, it's an address
    if (trimmed.toLowerCase().startsWith("dil")) {
      return "address";
    }
    
    // If it's 64 characters hex, it's a tx hash or block hash
    if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
      return "tx";
    }
    
    return null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const type = detectSearchType(query);
    
    if (type === "block") {
      navigate(`/block/${query.trim()}`);
    } else if (type === "tx") {
      navigate(`/tx/${query.trim()}`);
    } else if (type === "address") {
      navigate(`/address/${query.trim()}`);
    }
    
    setQuery("");
    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center",
        "glass-card rounded-xl transition-all duration-300",
        isFocused && "ring-2 ring-primary/50 border-primary/30"
      )}>
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by block, transaction, or address..."
          className="w-full bg-transparent py-3 pl-12 pr-24 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 p-1 rounded hover:bg-muted/50"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : (
          <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-xs text-muted-foreground">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </div>
      
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 glass-card rounded-xl">
          <p className="text-xs text-muted-foreground">
            {detectSearchType(query) 
              ? `Search for ${detectSearchType(query)} →` 
              : "Enter a block number, transaction hash, or address"}
          </p>
        </div>
      )}
    </form>
  );
};
