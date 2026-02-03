import { TFamilyPageBlock, TFeatures, TTheme } from "@/types";

export const getFamilyBlocks = (familyBlocks: TFamilyPageBlock[], features: TFeatures, theme: TTheme): TFamilyPageBlock[] => {
  let updatedFamilyBlocks = [...familyBlocks];
  if (theme !== "cclw" || !features["ab-family-topic-block"]) return updatedFamilyBlocks;

  // Move topics to after summary. Not hardcoded positions in case the family block order changes
  if (updatedFamilyBlocks.includes("topics")) {
    updatedFamilyBlocks = updatedFamilyBlocks.filter((block) => block !== "topics");
    const summaryIndex = updatedFamilyBlocks.findIndex((block) => block === "summary");
    updatedFamilyBlocks.splice(summaryIndex + 1, 0, "topics");
  }

  return updatedFamilyBlocks;
};
