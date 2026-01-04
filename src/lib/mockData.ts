// Mock data for the Dilithium Blockchain Explorer
// This will be replaced with real Supabase data once connected

export interface Block {
  index: number;
  hash: string;
  prevHash: string;
  timestamp: number;
  difficulty: number;
  minterAddress: string;
  minterBalance: number;
  transactionCount: number;
}

export interface Transaction {
  id: string;
  blockIndex: number;
  timestamp: number;
  inputs: TxInput[];
  outputs: TxOutput[];
}

export interface TxInput {
  txOutId: string;
  txOutIndex: number;
  signature: string;
}

export interface TxOutput {
  index: number;
  address: string;
  amount: number;
}

export interface NetworkStats {
  blockHeight: number;
  difficulty: number;
  totalTransactions: number;
  totalSupply: number;
  networkStatus: 'online' | 'syncing' | 'offline';
  avgBlockTime: number;
}

// Generate random hash
const generateHash = () => {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate random address
const generateAddress = () => {
  return 'DIL' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Mock blocks
export const mockBlocks: Block[] = Array.from({ length: 50 }, (_, i) => ({
  index: 847392 - i,
  hash: generateHash(),
  prevHash: generateHash(),
  timestamp: Date.now() - i * 30000,
  difficulty: 18 + Math.floor(Math.random() * 3),
  minterAddress: generateAddress(),
  minterBalance: Math.floor(Math.random() * 1000000) + 10000,
  transactionCount: Math.floor(Math.random() * 15) + 1,
}));

// Mock transactions
export const mockTransactions: Transaction[] = mockBlocks.flatMap((block, blockIdx) => 
  Array.from({ length: block.transactionCount }, (_, txIdx) => ({
    id: generateHash(),
    blockIndex: block.index,
    timestamp: block.timestamp - txIdx * 1000,
    inputs: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
      txOutId: generateHash(),
      txOutIndex: Math.floor(Math.random() * 5),
      signature: generateHash(),
    })),
    outputs: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, outIdx) => ({
      index: outIdx,
      address: generateAddress(),
      amount: Math.floor(Math.random() * 50000) + 100,
    })),
  }))
);

// Network stats
export const mockNetworkStats: NetworkStats = {
  blockHeight: 847392,
  difficulty: 19,
  totalTransactions: 2847291,
  totalSupply: 21000000,
  networkStatus: 'online',
  avgBlockTime: 30,
};

// Helper functions
export const shortenHash = (hash: string, chars = 6): string => {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
};

export const shortenAddress = (address: string, chars = 8): string => {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDIL = (amount: number): string => {
  return `${formatNumber(amount)} DIL`;
};

export const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const getTotalValue = (tx: Transaction): number => {
  return tx.outputs.reduce((sum, out) => sum + out.amount, 0);
};
