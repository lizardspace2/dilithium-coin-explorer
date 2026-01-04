import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const GlassCard = ({ 
  children, 
  className, 
  hover = false,
  padding = "md" 
}: GlassCardProps) => {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  return (
    <div 
      className={cn(
        hover ? "glass-card-hover" : "glass-card",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};
