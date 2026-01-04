'use client';
import { truncateHash } from '@/lib/utils';
import clsx from 'clsx';

export function HashBadge({ hash, className }: { hash: string; className?: string }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(hash);
        // Could add toast here
    };

    return (
        <span
            onClick={copyToClipboard}
            className={clsx(
                "font-mono text-sm cursor-pointer hover:neon-glow hover:text-cyan transition-colors bg-black/20 px-2 py-1 rounded",
                className
            )}
            title="Click to copy"
        >
            {truncateHash(hash, 8, 8)}
        </span>
    );
}
