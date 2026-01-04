export function truncateHash(hash: string, startLength = 6, endLength = 4) {
    if (!hash) return '';
    if (hash.length <= startLength + endLength) return hash;
    return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

export function formatBalance(balance: number | string) {
    const num = typeof balance === 'string' ? parseFloat(balance) : balance;
    if (isNaN(num)) return '0.00';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }).format(num);
}

export function timeAgo(timestamp: number) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
