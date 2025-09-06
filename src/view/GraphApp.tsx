import { use$ } from "@legendapp/state/react";
import { useState } from "react";
import type { IGraphNode } from "../types/IGraph";
import type { ITxSummary } from "../types/ITx";
import { fetchAddressTxs } from "../services/blockChainService";
import { graphStore$ } from "../store/graphStore";
import { LIMIT_SIZE } from "../config";
import { Box } from "@chakra-ui/react";
import { SearchInput } from "../components/SearchInput";
import { GraphContainer } from "../components/layout/GraphContainer";
import ErrorBoundary from "../components/utils/ErrorBoundary";
import GraphView from "../components/GraphView";
import AddressPanel from "../components/AdressPanel";
import { buildNodesAndEdges, buildNodesAndLinks } from "../utils/graphUtils";

export const GraphApp = () => {
  const [address, setAddress] = useState("1dice6YgEVBf88erBFra9BHf6ZMoyvG88");
  const [loading, setLoading] = useState(false);
  const { selected, nodes, edges } = use$(graphStore$);

  const loadMoreTransactions = async (nodeId: string) => {
    setLoading(true);
    const node = nodes.find((n: IGraphNode) => n.id === nodeId);
    if (!node) {
      return;
    }

    const offset = node.loadedTxs ?? 0;

    try {
      const txs: ITxSummary[] = await fetchAddressTxs(
        nodeId,
        LIMIT_SIZE,
        offset
      );
      const { newLinks, newNodes } = buildNodesAndLinks(txs, nodes);
      const updatedNodes = newNodes.map((n) =>
        n.id === nodeId
          ? { ...n, loadedTxs: (n.loadedTxs ?? 0) + txs.length }
          : n
      );

      graphStore$.addNodes(updatedNodes);
      graphStore$.addEdges(newLinks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit() {
    graphStore$.clear();
    setLoading(true);
    try {
      const txs: ITxSummary[] = await fetchAddressTxs(address);
      const { newEdges, newNodes } = buildNodesAndEdges(txs, address);
      graphStore$.addNodes(newNodes);
      graphStore$.addEdges(newEdges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <SearchInput
        title="BitCoin Address"
        value={address}
        onChange={(value) => setAddress(value)}
        onSubmit={onSubmit}
      />

      <GraphContainer>
        <ErrorBoundary>
          <GraphView
            selected={selected?.id || null}
            nodes={nodes}
            edges={edges}
            onNodeClick={graphStore$.setSelected}
            loading={loading}
          />
        </ErrorBoundary>
      </GraphContainer>

      <AddressPanel
        loading={loading}
        node={selected}
        onLoadMore={() => {
          if (selected) {
            loadMoreTransactions(selected?.id);
          }
        }}
      />
    </Box>
  );
};
