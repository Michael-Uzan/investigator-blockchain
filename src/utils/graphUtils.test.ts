import type { ITxSummary } from "../types/ITx";
import { buildNodesAndEdges, buildNodesAndLinks } from "./graphUtils";

describe("graphBuilder utils", () => {
  const mockTxs: ITxSummary[] = [
    {
      txid: "tx1",
      vin: [
        { prevout: { scriptpubkey_address: "addr1" } },
        { prevout: { scriptpubkey_address: "addr2" } },
      ],
      vout: [
        { scriptpubkey_address: "addr3" },
        { scriptpubkey_address: "addr4" },
      ],
    },
    {
      txid: "tx2",
      vin: [{ prevout: { scriptpubkey_address: "addr3" } }],
      vout: [{ scriptpubkey_address: "addr5" }],
    },
  ];

  it("buildNodesAndLinks adds new nodes and links correctly", () => {
    const { newNodes, newLinks } = buildNodesAndLinks(mockTxs, []);

    // nodes should include all unique addresses
    const ids = newNodes.map((n) => n.id);
    expect(ids).toEqual(
      expect.arrayContaining(["addr1", "addr2", "addr3", "addr4", "addr5"])
    );

    // links should connect inputs -> outputs for each tx
    expect(newLinks).toEqual(
      expect.arrayContaining([
        { source: "addr1", target: "addr3", txid: "tx1" },
        { source: "addr1", target: "addr4", txid: "tx1" },
        { source: "addr2", target: "addr3", txid: "tx1" },
        { source: "addr2", target: "addr4", txid: "tx1" },
        { source: "addr3", target: "addr5", txid: "tx2" },
      ])
    );
  });

  it("buildNodesAndEdges creates single central node and edges", () => {
    const { newNodes, newEdges } = buildNodesAndEdges(mockTxs, "central");

    // should create one node with txCount = number of txs
    expect(newNodes).toEqual([{ id: "central", txCount: 2 }]);

    // should link inputs -> outputs
    expect(newEdges).toEqual(
      expect.arrayContaining([
        { source: "addr1", target: "addr3", txid: "tx1" },
        { source: "addr1", target: "addr4", txid: "tx1" },
        { source: "addr2", target: "addr3", txid: "tx1" },
        { source: "addr2", target: "addr4", txid: "tx1" },
        { source: "addr3", target: "addr5", txid: "tx2" },
      ])
    );
  });
});
