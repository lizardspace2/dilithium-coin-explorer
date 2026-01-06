'use client';
import { useState } from 'react';
import { truncateHash } from '@/lib/utils';
import clsx from 'clsx';

export function HashBadge({ hash, className, noCopy = false }: { hash: string; className?: string; noCopy?: boolean }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (e: React.MouseEvent) => {
        if (noCopy) return; // Allow propagation if noCopy is true
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
            onClick={noCopy ? undefined : copyToClipboard}
            className={clsx(
                "font-mono text-sm transition-colors px-2 py-1 rounded inline-block",
                noCopy ? "cursor-pointer hover:underline" : "cursor-pointer bg-black/20 hover:neon-glow hover:text-cyan",
                copied && !noCopy ? "bg-green-500/20 text-green-400" : "",
                className
            )}
            title={noCopy ? undefined : "Click to copy"}
        >
            {copied && !noCopy ? "Copied!" : truncateHash(hash, 8, 8)}
        </span>
    );
}
