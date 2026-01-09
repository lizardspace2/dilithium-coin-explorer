import React from 'react';
import clsx from 'clsx';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function GlassCard({ children, className, title }: GlassCardProps) {
    return (
        <div className={clsx("glass-panel glass-panel-hover p-6 relative overflow-hidden group", className)}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {title && <h3 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-2 font-space group-hover:text-neon-blue transition-colors duration-300">{title}</h3>}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
