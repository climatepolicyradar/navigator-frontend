import zip from "lodash/zip";
import { Fragment, ReactNode } from "react";

export const joinNodes = (nodes: ReactNode[], joinWith: ReactNode): ReactNode[] => {
  const filteredNodes = nodes.filter((node) => node === 0 || Boolean(node));
  if (filteredNodes.length === 0) return [];

  return zip(
    filteredNodes,
    Array(filteredNodes.length - 1)
      .fill("")
      .map((_joinNode, joinIndex) => <Fragment key={`join-${joinIndex}`}>{joinWith}</Fragment>) // Prevents a missing key React error by providing unique keys to each joinWith instance
  )
    .flat()
    .filter((node) => node !== undefined);
};
