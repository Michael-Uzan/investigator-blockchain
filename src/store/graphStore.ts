import { observable } from "@legendapp/state";
import type { GraphNode, GraphEdge } from "../types";

export const graphStore$ = observable({
  nodes: [] as GraphNode[],
  edges: [] as GraphEdge[],
  selected: null as GraphNode | null,

  // Computed helpers
  hasSelected: () => !!graphStore$.selected.get(),

  // Actions
  addNode: (node: GraphNode) => {
    const nodes: GraphNode[] = graphStore$.nodes.get();
    const map = new Map(nodes.map((n) => [n.id, n]));
    map.set(node.id, { ...map.get(node.id), ...node });
    graphStore$.nodes.set(Array.from(map.values()));
  },

  addNodes: (newNodes: GraphNode[]) => {
    newNodes.forEach((n) => graphStore$.addNode(n));
  },

  addEdges: (newEdges: GraphEdge[]) => {
    const edges = graphStore$.edges.get();
    const key = (e: GraphEdge) => `${e.source}->${e.target}@${e.txid}`;
    const existing = new Set(edges.map(key));
    graphStore$.edges.set([
      ...edges,
      ...newEdges.filter((e) => !existing.has(key(e))),
    ]);
  },

  setSelected: (node: GraphNode | null) => {
    console.log("🚀 ~ node:", node);
    graphStore$.selected.set(node);
  },

  clear: () => {
    graphStore$.nodes.set([]);
    graphStore$.edges.set([]);
    graphStore$.selected.set(null);
  },
});
