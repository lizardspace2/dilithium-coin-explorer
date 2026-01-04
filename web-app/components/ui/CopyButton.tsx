'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export function CopyButton({ text, className }: { text: string; className?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={clsx(
                "p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white",
                className
            )}
            title="Copy to clipboard"
        >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
    );
}
