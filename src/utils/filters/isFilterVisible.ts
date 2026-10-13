import { TFilterPathLabel } from "@/types";
import { getLabelPathSignature } from "@/utils/filters/filterPaths";

export const isFilterVisible = (pathLabels: TFilterPathLabel[], matchingLabelPathSignatures: string[], isFiltered: boolean): boolean => {
  if (!isFiltered) return true;

  const labelPathSignature = getLabelPathSignature(pathLabels);
  return matchingLabelPathSignatures.some(
    (signature) =>
      signature === labelPathSignature || signature.startsWith(labelPathSignature + "/") || labelPathSignature.startsWith(signature + "/")
  );
};
