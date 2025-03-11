import { TDataNode } from "@/types";
import { removeDuplicates } from "@/utils/removeDuplicates";

export function extractNestedData<T>(response: TDataNode<T>[], levels: number, filterProp: string): { level1: T[]; level2: T[] } {
  let level1 = [];
  let level2Nested = [];
  let level2 = [];
  let data = response;
  if (data) {
    level1 = data.map((item) => {
      return item.node;
    });
    if (levels === 2) {
      level2Nested = data.map((item) => {
        return [...level2Nested, ...item.children];
      });

      level2 = level2Nested.flat().map((item) => item.node);
    }
    if (filterProp.length) {
      level1 = removeDuplicates(level1, filterProp);
      level2 = removeDuplicates(level2, filterProp);
    }

    return { level1, level2 };
  }
}
