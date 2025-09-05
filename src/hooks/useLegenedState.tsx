import { useState } from "react";
import type { ApiLog, GraphEdge, GraphNode } from "../types";

let globalLog: ApiLog[] = []; // tiny global store for service helpers to call

export function addLogEntry(entry: ApiLog) {
  globalLog = [entry, ...globalLog].slice(0, 200);
}

export function useLegendState() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [logStateVersion, setLogStateVersion] = useState(0);

  function pushLogUpdate() {
    setLogStateVersion((v) => v + 1);
  }

  function addNodes(newNodes: GraphNode[]) {
    setNodes((prev) => {
      const map = new Map(prev.map((n) => [n.id, n]));
      newNodes.forEach((n) =>
        map.set(n.id, { ...map.get(n.id), ...n } as GraphNode)
      );
      return Array.from(map.values());
    });
  }

  function addEdges(newEdges: GraphEdge[]) {
    setEdges((prev) => {
      const key = (e: GraphEdge) => `${e.source}->${e.target}@${e.txid}`;
      const existing = new Set(prev.map(key));
      return [...prev, ...newEdges.filter((e) => !existing.has(key(e)))];
    });
  }

  function clear() {
    setNodes([]);
    setEdges([]);
    setSelected(null);
  }

  return {
    nodes,
    edges,
    selected,
    setSelected,
    addNodes,
    addEdges,
    clear,
    getApiLog: () => globalLog,
    pushLogUpdate,
  };
}

// export { addLogEntry };
