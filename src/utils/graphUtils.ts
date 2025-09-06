import type { IGraphEdge, IGraphNode } from "../types/IGraph";
import type { ITxSummary, ITxVin, ITxVout } from "../types/ITx";

export function buildNodesAndLinks(txs: ITxSummary[], nodes: IGraphNode[]) {
  // Build nodes and links from transactions
  const newNodes: IGraphNode[] = [];
  const newLinks: IGraphEdge[] = [];

  txs.forEach((tx) => {
    const inputs = tx.vin
      .map((v: ITxVin) => v.prevout?.scriptpubkey_address)
      .filter(Boolean) as string[];
    const outputs = tx.vout
      .map((v: ITxVout) => v.scriptpubkey_address)
      .filter(Boolean) as string[];

    // Add nodes for missing addresses
    inputs.concat(outputs).forEach((addr) => {
      if (
        !nodes.find((n: IGraphNode) => n.id === addr) &&
        !newNodes.find((n) => n.id === addr)
      ) {
        newNodes.push({ id: addr });
      }
    });

    // Add links
    inputs.forEach((inp) => {
      outputs.forEach((out) => {
        newLinks.push({ source: inp, target: out, txid: tx.txid });
      });
    });
  });

  return { newNodes, newLinks };
}

export function buildNodesAndEdges(txs: ITxSummary[], address: string) {
  // transform txs into nodes & edges - minimal example
  const newNodes = [{ id: address, txCount: txs.length }];
  const newEdges = txs.flatMap((tx: ITxSummary) => {
    // parse inputs/outputs to create edges
    const inputs = tx.vin
      .map((v: ITxVin) => v.prevout?.scriptpubkey_address || "")
      .filter(Boolean);

    const outputs = tx.vout
      .map((v: ITxVout) => v.scriptpubkey_address || "")
      .filter(Boolean);
    // link inputs -> outputs
    return inputs.flatMap((inp: string) =>
      outputs.map((out: string) => ({
        source: inp,
        target: out,
        txid: tx.txid,
      }))
    );
  });

  return { newNodes, newEdges };
}
