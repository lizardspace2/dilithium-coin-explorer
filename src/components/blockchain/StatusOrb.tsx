import { cn } from "@/lib/utils";

interface StatusOrbProps {
  status: "online" | "syncing" | "offline";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const StatusOrb = ({ 
  status, 
  size = "md",
  showLabel = true 
}: StatusOrbProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusClasses = {
    online: "status-orb-online",
    syncing: "status-orb-syncing",
    offline: "bg-destructive shadow-[0_0_10px_hsl(var(--destructive)/0.6)]",
  };

  const labels = {
    online: "Network Online",
    syncing: "Syncing...",
    offline: "Offline",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("status-orb", sizeClasses[size], statusClasses[status])} />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{labels[status]}</span>
      )}
    </div>
  );
};
