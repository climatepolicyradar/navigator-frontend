import { TFamilyPageBlock, TFeatures } from "@/types";

export const getFamilyBlocks = (familyBlocks: TFamilyPageBlock[], features: TFeatures): TFamilyPageBlock[] => {
  const updatedFamilyBlocks = [...familyBlocks];

  if (features.debug) {
    updatedFamilyBlocks.push("debug");
  }

  return updatedFamilyBlocks;
};
