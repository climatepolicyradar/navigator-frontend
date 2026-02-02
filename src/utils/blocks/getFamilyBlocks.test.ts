import { TFamilyPageBlock, TFeatures, TTheme } from "@/types";

import { getFamilyBlocks } from "./getFamilyBlocks";

describe("getFamilyBlocks", () => {
  const familyBlocks: TFamilyPageBlock[] = ["summary", "documents", "metadata", "topics", "collections", "targets", "note"];
  const features = {
    "ab-family-topic-block": false,
  } as TFeatures;

  it("makes no changes if not CCLW", () => {
    const otherThemes: TTheme[] = ["cpr", "ccc", "mcf"];

    otherThemes.forEach((theme) => {
      expect(getFamilyBlocks(familyBlocks, features, theme)).toEqual(familyBlocks);
    });
  });

  it("makes no changes if no A/B test for topic block order", () => {
    expect(getFamilyBlocks(familyBlocks, features, "cclw")).toEqual(familyBlocks);
  });

  it("reorders topics block if A/B test for topic block order", () => {
    const featuresWithABTest = {
      ...features,
      "ab-family-topic-block": true,
    };

    expect(getFamilyBlocks(familyBlocks, featuresWithABTest, "cclw")).toEqual([
      "summary",
      "topics",
      "documents",
      "metadata",
      "collections",
      "targets",
      "note",
    ]);
  });
});
