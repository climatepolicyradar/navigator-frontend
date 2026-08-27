import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

import { getFilterPathLabels, getLabelPathSignature } from "./filterPaths";

export const filterHasSelectedChildren = (checkedLabelPaths: TFilterPathLabel[][], ancestorPath: TFilterPathLabel[], label: TNestedSearchLabel) => {
  const pathLabels = getFilterPathLabels(label, ancestorPath);
  const pathSignature = getLabelPathSignature(pathLabels);

  return checkedLabelPaths.some(
    (checkedLabelPath) => checkedLabelPath.length > pathLabels.length && getLabelPathSignature(checkedLabelPath).startsWith(pathSignature)
  );
};
