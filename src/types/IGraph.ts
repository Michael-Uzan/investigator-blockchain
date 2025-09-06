export type IGraphNode = { id: string; txCount?: number; loadedTxs?: number };
export type IGraphEdge = { source: string; target: string; txid: string };
