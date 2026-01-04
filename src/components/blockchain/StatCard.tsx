import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export const StatCard = ({ 
  label, 
  value, 
  icon: Icon,
  trend,
  className 
}: StatCardProps) => {
  return (
    <GlassCard hover className={cn("relative overflow-hidden", className)}>
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
        
        <div className="stat-value animate-count-up">
          {value}
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-neon-green" : "text-destructive"
            )}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
