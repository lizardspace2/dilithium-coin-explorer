import { Hexagon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
    const sizeMap = {
        sm: { icon: 'w-6 h-6', text: 'text-lg', letter: 'text-[10px]' },
        md: { icon: 'w-8 h-8', text: 'text-xl', letter: 'text-xs' },
        lg: { icon: 'w-12 h-12', text: 'text-3xl', letter: 'text-lg' }
    };

    const currentSize = sizeMap[size];

    return (
        <Link href="/" className={cn("flex items-center gap-3 group", className)}>
            <div className="relative">
                <Hexagon
                    className={cn(
                        currentSize.icon,
                        "text-neon-blue transition-all group-hover:drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                    )}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(currentSize.letter, "font-bold text-neon-blue")}>Q</span>
                </div>
            </div>
            {showText && (
                <span className={cn(currentSize.text, "font-bold font-space tracking-tight")}>
                    QUANTIX<span className="text-neon-blue">EXPLORER</span>
                </span>
            )}
        </Link>
    );
}
