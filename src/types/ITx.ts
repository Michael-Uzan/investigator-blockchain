export interface ITxVin {
  txid?: string;
  vout?: number;
  prevout?: {
    scriptpubkey_address?: string;
    value?: number;
  };
}

export interface ITxVout {
  scriptpubkey_address?: string;
  value?: number;
}

export interface ITxSummary {
  txid: string;
  vin: ITxVin[];
  vout: ITxVout[];
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
