import type { IGraphEdge, IGraphNode } from "../types/IGraph";
import { graphStore$ } from "./graphStore";

describe("graphStore$", () => {
  const nodeA: IGraphNode = { id: "A" };
  const nodeB: IGraphNode = { id: "B" };
  const edgeAB: IGraphEdge = { source: "A", target: "B", txid: "1" };
  const edgeBA: IGraphEdge = { source: "B", target: "A", txid: "1" };

  beforeEach(() => {
    graphStore$.clear();
  });

  it("starts with empty state", () => {
    expect(graphStore$.nodes.get()).toEqual([]);
    expect(graphStore$.edges.get()).toEqual([]);
    expect(graphStore$.selected.get()).toBeNull();
  });

  it("adds a single node", () => {
    graphStore$.addNode(nodeA);
    expect(graphStore$.nodes.get()).toEqual([nodeA]);
  });

  it("merges node data if same id is added", () => {
    graphStore$.addNode(nodeA);
    graphStore$.addNode({ id: "A" });
    expect(graphStore$.nodes.get()).toEqual([{ id: "A" }]);
  });

  it("adds multiple nodes", () => {
    graphStore$.addNodes([nodeA, nodeB]);
    expect(graphStore$.nodes.get()).toEqual(
      expect.arrayContaining([nodeA, nodeB])
    );
  });

  it("adds different edges", () => {
    graphStore$.addEdges([edgeAB, edgeBA]);
    expect(graphStore$.edges.get()).toEqual(
      expect.arrayContaining([edgeAB, edgeBA])
    );
  });

  it("sets and clears selected node", () => {
    graphStore$.setSelected(nodeA);
    expect(graphStore$.selected.get()).toEqual(nodeA);
    expect(graphStore$.hasSelected()).toBe(true);

    graphStore$.clear();
    expect(graphStore$.selected.get()).toBeNull();
    expect(graphStore$.hasSelected()).toBe(false);
  });

  it("clear resets state", () => {
    graphStore$.addNodes([nodeA]);
    graphStore$.addEdges([edgeAB]);
    graphStore$.setSelected(nodeB);

    graphStore$.clear();
    expect(graphStore$.nodes.get()).toEqual([]);
    expect(graphStore$.edges.get()).toEqual([]);
    expect(graphStore$.selected.get()).toBeNull();
  });
});
