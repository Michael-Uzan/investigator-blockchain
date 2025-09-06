import { useRef } from "react";
import { Box, Spinner, useBreakpointValue } from "@chakra-ui/react";
import ForceGraph2D, {
  type ForceGraphMethods,
  type LinkObject,
  type NodeObject,
} from "react-force-graph-2d";
import type { IGraphEdge, IGraphNode } from "../types/IGraph";

interface Props {
  selected: string | null;
  nodes: IGraphNode[];
  edges: IGraphEdge[];
  loading: boolean;
  onNodeClick: (node: IGraphNode) => void;
}

export default function GraphView({
  selected,
  nodes,
  edges,
  loading,
  onNodeClick,
}: Props) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const fgRef = useRef<
    | ForceGraphMethods<NodeObject<IGraphNode>, LinkObject<IGraphEdge>>
    | undefined
  >(undefined);
  const validLinks = edges.filter(
    (l: IGraphEdge) =>
      nodes.some((n: IGraphNode) => n.id === l.source) &&
      nodes.some((n: IGraphNode) => n.id === l.target)
  );
  const graphData = {
    nodes: nodes.map((n: IGraphNode) => ({ val: 1, ...n })),
    links: validLinks.map((e: IGraphEdge) => ({
      source: e.source,
      target: e.target,
      txid: e.txid,
      value: 1,
    })),
  };

  return (
    <>
      {loading && (
        <Box position="absolute" top={2} right={2} zIndex={10}>
          <Spinner size={{ base: "md", sm: "xl" }} />
        </Box>
      )}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(n) => `${n.id}`}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node: IGraphNode) => onNodeClick(node)}
        onNodeDragEnd={() => fgRef.current && fgRef.current.zoomToFit(400)}
        // width={800}
        height={isMobile ? 400 : 600}
        nodeCanvasObjectMode={() => "after"}
        nodeColor={(node) => (node.id === selected ? "orange" : "blue")}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;

          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = label === selected ? "red" : "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(label, node.x!, node.y! + 8);
        }}
      />
    </>
  );
}
