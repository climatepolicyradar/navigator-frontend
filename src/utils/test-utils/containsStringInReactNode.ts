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
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as ReactElement).props as { children?: ReactNode };
    if (props && props.children) {
      return containsStringInReactNode(props.children, search);
    }
  }
  return false;
}
