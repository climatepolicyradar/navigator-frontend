import { DEFAULT_FEATURES } from "@/constants/features";
import { TFamilyPageBlock } from "@/types";

import { getFamilyBlocks } from "./getFamilyBlocks";

describe("getFamilyBlocks", () => {
  const familyBlocks: TFamilyPageBlock[] = ["summary", "documents", "metadata", "topics", "collections", "note"];

  it("makes no changes if debug is off", () => {
    expect(getFamilyBlocks(familyBlocks, DEFAULT_FEATURES)).toEqual(familyBlocks);
  });

  it("appends the debug block if debug is on", () => {
    expect(getFamilyBlocks(familyBlocks, { ...DEFAULT_FEATURES, debug: true })).toEqual([...familyBlocks, "debug"]);
  });
});
