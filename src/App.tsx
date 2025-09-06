import { useState } from "react";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import GraphView from "./components/GraphView";
import { fetchAddressTxs } from "./services/blockChain";
import AddressPanel from "./components/AdressPanel";
import type { ITxSummary, ITxVin, ITxVout } from "./types/ITx";
import { LIMIT_SIZE } from "./config";
import ApiLogDrawer from "./components/ApiLogDrawer";
import { graphStore$ } from "./store/graphStore";
import { use$ } from "@legendapp/state/react";
import ErrorBoundary from "./components/utils/ErrorBoundary";
import { GraphContainer } from "./components/layout/GraphContainer";
import { MainContainer } from "./components/layout/MainContainer";
import { Header } from "./components/layout/Header";
import { SearchInput } from "./components/SearchInput";
import type { IGraphEdge, IGraphNode } from "./types/IGraph";

export default function App() {
  const [address, setAddress] = useState("1dice6YgEVBf88erBFra9BHf6ZMoyvG88");
  const [loading, setLoading] = useState(false);
  const { selected, nodes, edges } = use$(graphStore$);

  const { isOpen, onOpen, onClose } = useDisclosure();

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

      // Build nodes and links from transactions
      const newNodes: IGraphNode[] = [];
      const newLinks: IGraphEdge[] = [];

      txs.forEach((tx) => {
        const inputs = tx.vin
          .map((v) => v.prevout?.scriptpubkey_address)
          .filter(Boolean) as string[];
        const outputs = tx.vout
          .map((v) => v.scriptpubkey_address)
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
      graphStore$.addNodes(newNodes);
      graphStore$.addEdges(newEdges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChakraProvider>
      <MainContainer>
        <Header title="Blockchain Investigator" onMenuClick={onOpen} />
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

        <ApiLogDrawer isOpen={isOpen} onClose={onClose} />
      </MainContainer>
    </ChakraProvider>
  );
}
