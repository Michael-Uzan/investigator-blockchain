import { Box, Heading, Text, Button } from "@chakra-ui/react";
import type { GraphNode } from "../types";

export default function AddressPanel({
  loading,
  node,
  onLoadMore,
}: {
  loading: boolean;
  node: GraphNode | null;
  onLoadMore: () => void;
}) {
  if (!node)
    return (
      <Box p={4}>
        <Text>Select a node to see details</Text>
      </Box>
    );

  return (
    <Box p={4} borderWidth={1} borderRadius="md">
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
    </Box>
  );
}
