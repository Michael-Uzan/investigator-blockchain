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

  async function onSubmit() {
    clear();
    setLoading(true);
    try {
      const txs = await fetchAddressTxs(address, 10, 0);
      // transform txs into nodes & edges - minimal example
      const newNodes = [{ id: address, txCount: txs.length }];
      const newEdges = txs.flatMap((tx: any) => {
        // parse inputs/outputs to create edges
        const inputs = tx.vin
          .map((v: any) => v.prevout?.scriptpubkey_address)
          .filter(Boolean);
        const outputs = tx.vout
          .map((v: any) => v.scriptpubkey_address)
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
          nodes={nodes}
          edges={edges}
          onNodeClick={(id) => setSelected(id)}
          onExpandNode={() => {}}
          loading={loading}
        />
        {/* </ErrorBoundary> */}

        {/* <AddressPanel
          node={nodes.find((n) => n.id === selected) ?? null}
          onLoadMore={() => {
          }}
        /> */}

        {/* <ApiLogDrawer isOpen={open} onClose={onClose} logs={getApiLog()} /> */}
      </Container>
    </ChakraProvider>
  );
}
