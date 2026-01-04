import clsx from 'clsx';

export function StatusOrb({ status = 'active', className }: { status?: 'active' | 'inactive' | 'pending'; className?: string }) {
    const colors = {
        active: 'bg-green-500 shadow-green-500/50',
        inactive: 'bg-red-500 shadow-red-500/50',
        pending: 'bg-yellow-500 shadow-yellow-500/50'
    };

    return (
        <div className={clsx("relative flex items-center justify-center", className)}>
            <div className={clsx("w-3 h-3 rounded-full shadow-lg animate-pulse", colors[status])} />
            <div className={clsx("absolute w-3 h-3 rounded-full animate-ping opacity-75", colors[status])} />
        </div>
    );
}
