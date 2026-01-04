'use client';
import { useState } from 'react';
import { truncateHash } from '@/lib/utils';
import clsx from 'clsx';

export function HashBadge({ hash, className }: { hash: string; className?: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(hash);
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = hash;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
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
