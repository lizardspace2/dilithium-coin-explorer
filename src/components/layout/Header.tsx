import { Link } from "react-router-dom";
import { StatusOrb } from "../blockchain/StatusOrb";
import { SearchBar } from "../blockchain/SearchBar";
import { Hexagon, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Blocks", href: "/blocks" },
    { label: "Transactions", href: "/transactions" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-primary transition-all group-hover:drop-shadow-[0_0_10px_hsl(var(--primary))]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">D</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight">Dilithium</span>
              <span className="text-xs block text-muted-foreground -mt-0.5">NEXUS EXPLORER</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search & Status */}
          <div className="flex items-center gap-4">
            <SearchBar className="hidden lg:block w-80" />
            <StatusOrb status="online" size="sm" />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden px-4 pb-4">
          <SearchBar className="w-full" />
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-48 pb-4" : "max-h-0"
        )}>
          <nav className="flex flex-col gap-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
