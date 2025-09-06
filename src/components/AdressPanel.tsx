import { Box, Heading, Text, Button } from "@chakra-ui/react";
import type { IGraphNode } from "../types/IGraph";

type AddressPanelProps = {
  loading: boolean;
  node: IGraphNode | null;
  onLoadMore: () => void;
};

export default function AddressPanel({
  loading,
  node,
  onLoadMore,
}: AddressPanelProps) {
  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      {node ? (
        <>
          <Heading size="sm">Address details</Heading>
          <Text mt={2}>
            <strong>Address:</strong> {node.id}
          </Text>
          <Text mt={2}>
            <strong>Known txs:</strong> {node.txCount ?? "unknown"}
          </Text>
          <Button mt={3} onClick={onLoadMore} size="sm" disabled={loading}>
            Load more
          </Button>
        </>
      ) : (
        <Box p={4}>
          <Text>Select a node to see details</Text>
        </Box>
      )}
    </Box>
  );
}
