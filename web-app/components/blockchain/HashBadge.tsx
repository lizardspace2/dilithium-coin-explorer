'use client';
import { useState } from 'react';
import { truncateHash } from '@/lib/utils';
import clsx from 'clsx';

export function HashBadge({ hash, className }: { hash: string; className?: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <span
            onClick={copyToClipboard}
            className={clsx(
                "font-mono text-sm cursor-pointer transition-colors px-2 py-1 rounded inline-block",
                copied ? "bg-green-500/20 text-green-400" : "bg-black/20 hover:neon-glow hover:text-cyan",
                className
            )}
            title="Click to copy"
        >
            {copied ? "Copied!" : truncateHash(hash, 8, 8)}
        </span>
    );
}
