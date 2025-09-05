export interface TxVin {
  txid?: string;
  vout?: number;
  prevout?: {
    scriptpubkey_address?: string;
    value?: number;
  };
}

export interface TxVout {
  scriptpubkey_address?: string;
  value?: number;
}

export interface TxSummary {
  txid: string;
  vin: TxVin[];
  vout: TxVout[];
  status?: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  fee?: number;
  version?: number;
  locktime?: number;
  size?: number;
  weight?: number;
}
