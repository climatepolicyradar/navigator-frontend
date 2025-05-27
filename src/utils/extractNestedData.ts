import { groupBy, sortBy, toPairs, uniqBy } from "lodash/fp";

import { TDataNode } from "@/types";

type TNodeAndDepth<T> = {
  node: T;
  nodeDepth: number;
};

// Unrolls nested nodes into a flat array of nodes + their original depth
const flattenNodesWithDepth = <T>(dataNodes: TDataNode<T>[], nodeDepth = 0): TNodeAndDepth<T>[] =>
  dataNodes.reduce(
    (reducedNodes, dataNode) => [...reducedNodes, { node: dataNode.node, nodeDepth }, ...flattenNodesWithDepth(dataNode.children, nodeDepth + 1)],
    []
  );

// Returns a 2D array of nodes grouped by their level in the dataNodes tree, highest to lowest
export const extractNestedData = <T>(dataNodes: TDataNode<T>[], uniqueByPath?: string): T[][] => {
  const nodesWithLevels = flattenNodesWithDepth<T>(dataNodes);
  const nodesByLevelObject = groupBy("nodeDepth", nodesWithLevels);
  const nodeAndLevelPairs = toPairs(nodesByLevelObject);
  const nodesByLevelArray = sortBy("0", nodeAndLevelPairs).map((level) => level[1].map((levelNode) => levelNode.node));

  if (!uniqueByPath) return nodesByLevelArray;

  return nodesByLevelArray.map((level) => uniqBy(uniqueByPath, level));
};
