import { useState } from "react";
import {
  Button,
  ChakraProvider,
  Container,
  Heading,
  HStack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import GraphView from "./components/GraphView";
import { fetchAddressTxs } from "./services/blockChain";
import AddressPanel from "./components/AdressPanel";
import type { TxSummary, TxVin, TxVout } from "./types/ITx";
import type { GraphEdge, GraphNode } from "./types";
import { LIMIT_SIZE } from "./config";
import ApiLogDrawer from "./components/ApiLogDrawer";
import { graphStore$ } from "./store/graphStore";
import { use$ } from "@legendapp/state/react";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const [address, setAddress] = useState("1dice6YgEVBf88erBFra9BHf6ZMoyvG88");
  const [loading, setLoading] = useState(false);
  const { selected, nodes, edges } = use$(graphStore$);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadMoreTransactions = async (nodeId: string) => {
    setLoading(true);
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) {
      return;
    }

    const offset = node.loadedTxs ?? 0;

    try {
      const txs: TxSummary[] = await fetchAddressTxs(
        nodeId,
        LIMIT_SIZE,
        offset
      );

      // Build nodes and links from transactions
      const newNodes: GraphNode[] = [];
      const newLinks: GraphEdge[] = [];

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
            !nodes.find((n) => n.id === addr) &&
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
      const txs: TxSummary[] = await fetchAddressTxs(address);
      // transform txs into nodes & edges - minimal example
      const newNodes = [{ id: address, txCount: txs.length }];
      const newEdges = txs.flatMap((tx: TxSummary) => {
        // parse inputs/outputs to create edges
        const inputs = tx.vin
          .map((v: TxVin) => v.prevout?.scriptpubkey_address || "")
          .filter(Boolean);

        const outputs = tx.vout
          .map((v: TxVout) => v.scriptpubkey_address || "")
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
      <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
        <Heading size={{ base: "sm", sm: "lg" }} mb={4}>
          Blockchain Investigator
        </Heading>
        <HStack mb={4} spacing={{ base: 1, sm: 2 }} flexWrap="wrap">
          <Input
            w={{ base: "100%", sm: "350px" }}
            placeholder="Enter Bitcoin address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            flexShrink={0}
            size={{ base: "sm", sm: "md" }}
            w={{ base: "100%", sm: "auto" }}
            onClick={onSubmit}
          >
            Search
          </Button>
          <Button
            flexShrink={0}
            size={{ base: "sm", sm: "md" }}
            w={{ base: "100%", sm: "auto" }}
            onClick={onOpen}
          >
            API Log
          </Button>
        </HStack>

        <ErrorBoundary>
          <GraphView
            selected={selected?.id || null}
            nodes={nodes}
            edges={edges}
            onNodeClick={graphStore$.setSelected}
            loading={loading}
          />
        </ErrorBoundary>

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
      </Container>
    </ChakraProvider>
  );
}
