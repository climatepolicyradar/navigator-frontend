import { TFamilyPageBlock, TFeatures, TTheme } from "@/types";

export const getFamilyBlocks = (familyBlocks: TFamilyPageBlock[], features: TFeatures, theme: TTheme): TFamilyPageBlock[] => {
  let updatedFamilyBlocks = [...familyBlocks];

  if (features["new-data-model"]) {
    updatedFamilyBlocks.push("debug");
  }

  // Move topics to after summary. Not hardcoded positions in case the family block order changes
  if (theme === "cclw" && features["ab-family-topic-block"] && updatedFamilyBlocks.includes("topics")) {
    updatedFamilyBlocks = updatedFamilyBlocks.filter((block) => block !== "topics");
    const summaryIndex = updatedFamilyBlocks.findIndex((block) => block === "summary");
    updatedFamilyBlocks.splice(summaryIndex + 1, 0, "topics");
  }

  return updatedFamilyBlocks;
};
