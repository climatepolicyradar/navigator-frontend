import { TCheckboxState, TFilterPathLabel } from "@/types";

import { getLabelPathSignature } from "./filterPaths";

export const getFilterStatus = (pathLabels: TFilterPathLabel[], checkedLabelPaths: TFilterPathLabel[][]): TCheckboxState => {
  const labelSignature = getLabelPathSignature(pathLabels);
  const checkedSignatures = checkedLabelPaths.map(getLabelPathSignature);

  let filterStatus: TCheckboxState = false;

  for (const checkedSignature of checkedSignatures) {
    if (labelSignature === checkedSignature) return true;
    if (checkedSignature.startsWith(labelSignature)) filterStatus = "indeterminate";
  }

  return filterStatus;
};
