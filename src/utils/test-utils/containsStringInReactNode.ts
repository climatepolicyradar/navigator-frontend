import { ReactElement, ReactNode } from "react";

export function containsStringInReactNode(node: ReactNode, search: string): boolean {
  if (typeof node === "string") {
    return node.includes(search);
  }
  if (typeof node === "number") {
    return node.toString().includes(search);
  }
  if (Array.isArray(node)) {
    return node.some((child) => containsStringInReactNode(child, search));
  }
  if (node && typeof node === "object" && "props" in node && (node as ReactElement).props && (node as ReactElement).props.children) {
    return containsStringInReactNode((node as ReactElement).props.children, search);
  }
  return false;
}
