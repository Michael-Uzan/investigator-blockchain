/* eslint-disable @typescript-eslint/no-explicit-any */
export type GraphNode = { id: string; txCount?: number; loadedTxs?: number }; // how many transactions we have loaded already;
export type GraphEdge = { source: string; target: string; txid: string };
export type ApiLog = {
  url: string;
  params?: any;
  state: "loading" | "success" | "error";
  error?: string;
  resultCount?: number;
};
export type TxSummary = any; // for brevity in the scaffold
