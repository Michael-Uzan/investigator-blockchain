/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import ForceGraph2D from "react-force-graph-2d";
import type { GraphEdge, GraphNode } from "../types";

interface Props {
  nodes: any;
  edges: any;
  onNodeClick: (nodeId: string) => void;
  onExpandNode: (nodeId: string) => void;
  loading: boolean;
}

export default function GraphView({
  nodes,
  edges,
  onNodeClick,
  onExpandNode,
  loading,
}: Props) {
  const fgRef = useRef<any>(null);
  const validLinks = edges.filter(
    (l: GraphEdge) =>
      nodes.some((n: GraphNode) => n.id === l.source) &&
      nodes.some((n: GraphNode) => n.id === l.target)
  );
  const graphData = {
    nodes: nodes.map((n: GraphNode) => ({ val: 1, ...n })),
    links: validLinks.map((e: GraphEdge) => ({
      source: e.source,
      target: e.target,
      txid: e.txid,
      value: 1,
    })),
  };

  return (
    <Box
      position="relative"
      height="600px"
      borderWidth={1}
      borderRadius="md"
      overflow="hidden"
    >
      {loading && (
        <Box position="absolute" top={2} right={2} zIndex={10}>
          <Spinner />
        </Box>
      )}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(n) => `${n.id}`}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node) => onNodeClick((node as any).id)}
        onNodeDragEnd={() => fgRef.current && fgRef.current.zoomToFit(400)}
        width={800}
        height={600}
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;

          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(label, node.x!, node.y! + 8);
        }}
      />
    </Box>
  );
}
