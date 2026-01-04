import React from 'react';
import clsx from 'clsx';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function GlassCard({ children, className, title }: GlassCardProps) {
    return (
        <div className={clsx("glass-panel p-6", className)}>
            {title && <h3 className="text-xl font-bold mb-4 font-space text-cyan">{title}</h3>}
            {children}
        </div>
    );
}
