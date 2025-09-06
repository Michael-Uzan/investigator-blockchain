import { observable } from "@legendapp/state";
import type { IGraphEdge, IGraphNode } from "../types/IGraph";

export const graphStore$ = observable({
  nodes: [] as IGraphNode[],
  edges: [] as IGraphEdge[],
  selected: null as IGraphNode | null,

  // Computed helpers
  hasSelected: () => !!graphStore$.selected.get(),

  // Actions
  addNode: (node: IGraphNode) => {
    const nodes: IGraphNode[] = graphStore$.nodes.get();
    const map = new Map(nodes.map((n) => [n.id, n]));
    map.set(node.id, { ...map.get(node.id), ...node });
    graphStore$.nodes.set(Array.from(map.values()));
  },

  addNodes: (newNodes: IGraphNode[]) => {
    newNodes.forEach((n) => graphStore$.addNode(n));
  },

  addEdges: (newEdges: IGraphEdge[]) => {
    const edges = graphStore$.edges.get();
    const key = (e: IGraphEdge) => `${e.source}->${e.target}@${e.txid}`;
    const existing = new Set(edges.map(key));
    graphStore$.edges.set([
      ...edges,
      ...newEdges.filter((e) => !existing.has(key(e))),
    ]);
  },

  setSelected: (node: IGraphNode | null) => {
    graphStore$.selected.set(node);
  },

  clear: () => {
    graphStore$.nodes.set([]);
    graphStore$.edges.set([]);
    graphStore$.selected.set(null);
  },
});
