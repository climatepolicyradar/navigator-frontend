import { TBlock } from "@/types";

export const scrollToBlock =
  <BlockId extends string = TBlock>(blockId: BlockId) =>
  () => {
    const element = document.getElementById("section-" + blockId);
    element?.scrollIntoView({ behavior: "smooth" });
  };
