export interface Block {
    index: number;
    hash: string;
    prev_hash: string;
    timestamp: number;
    difficulty: number;
    minter_address: string;
    minter_balance?: number;
    transaction_count: number;
    created_at?: string;
}

export interface Transaction {
    id: string;
    block_index: number;
    timestamp: number;
    created_at?: string;
    tx_inputs?: TxInput[];
    tx_outputs?: TxOutput[];
}

export interface TxInput {
    id?: string;
    transaction_id?: string;
    tx_out_id?: string;
    tx_out_index?: number;
    signature?: string;
}

export interface TxOutput {
    id?: string;
    transaction_id?: string;
    index: number;
    address: string;
    amount: number;
}
