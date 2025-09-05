/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Button,
  ChakraProvider,
  Container,
  Heading,
  HStack,
  Input,
} from "@chakra-ui/react";
import GraphView from "./components/GraphView";
// import AddressPanel from "./components/AddressPanel";
// import ApiLogDrawer from "./components/ApiLogDrawer";
// import ErrorBoundary from "./components/ErrorBoundary";
import { useLegendState } from "./hooks/useLegenedState";
import { fetchAddressTxs } from "./services/blockChain";
import AddressPanel from "./components/AdressPanel";
import axios from "axios";
import type { TxSummary, TxVin, TxVout } from "./types/ITx";
import type { GraphEdge, GraphNode } from "./types";
import { i } from "framer-motion/client";
import { LIMIT_SIZE } from "./config";

export default function App() {
  const [address, setAddress] = useState("1dice6YgEVBf88erBFra9BHf6ZMoyvG88");
  const [loading, setLoading] = useState(false);
  const {
    nodes,
    edges,
    addNodes,
    addEdges,
    selected,
    setSelected,
    getApiLog,
    pushLogUpdate,
    clear,
  } = useLegendState();
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const loadMoreTransactions = async (nodeId: string) => {
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
      addNodes(updatedNodes);
      addEdges(newLinks);
    } catch (err) {
      console.error(err);
    }
  };

  async function onSubmit() {
    clear();
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
      addNodes(newNodes);
      addEdges(newEdges);
    } catch (err) {
      console.error(err);
    } finally {
      pushLogUpdate();
      setLoading(false);
    }
  }

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={6}>
        <Heading size="lg" mb={4}>
          Leadspotting — Blockchain Investigator
        </Heading>
        <HStack mb={4} spacing={2}>
          <Input
            placeholder="Enter Bitcoin address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={onSubmit}>Search</Button>
          {/* <Button onClick={onOpen}>API Log</Button> */}
        </HStack>

        {/* <ErrorBoundary> */}
        <GraphView
          selected={selected}
          nodes={nodes}
          edges={edges}
          onNodeClick={(id) => setSelected(id)}
          onExpandNode={() => {}}
          loading={loading}
        />
        {/* </ErrorBoundary> */}

        <AddressPanel
          node={nodes.find((n) => n.id === selected) ?? null}
          onLoadMore={() => {
            if (selected) {
              loadMoreTransactions(selected);
            }
          }}
        />

        {/* <ApiLogDrawer isOpen={open} onClose={onClose} logs={getApiLog()} /> */}
      </Container>
    </ChakraProvider>
  );
}
