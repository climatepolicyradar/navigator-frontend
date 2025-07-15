import zip from "lodash/zip";
import { ReactNode } from "react";

export const joinNodes = (nodes: ReactNode[], joinWith: ReactNode): ReactNode[] => {
  if (!nodes.length) return [];
  return zip(nodes, Array(nodes.length - 1).fill(joinWith)).flat();
};
