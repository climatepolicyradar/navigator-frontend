import zip from "lodash/zip";
import { ReactNode } from "react";

export const joinNodes = (nodes: ReactNode[], joinWith: ReactNode): ReactNode[] => {
  const filteredNodes = nodes.filter((node) => node === 0 || Boolean(node));
  if (filteredNodes.length === 0) return [];

  return zip(filteredNodes, Array(filteredNodes.length - 1).fill(joinWith))
    .flat()
    .filter((node) => node !== undefined);
};
