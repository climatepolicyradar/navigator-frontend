import uniqBy from "lodash/uniqBy";

import { TCheckboxState, TFilterPathLabel } from "@/types";
import { getLabelPathSignature, sortFilterPathLabels } from "@/utils/filters/filterPaths";

export const updateCheckedLabelPaths = (
  checkedLabelPaths: TFilterPathLabel[][],
  labelPath: TFilterPathLabel[],
  checked: TCheckboxState
): TFilterPathLabel[][] => {
  let updatedCheckedLabelPaths = [...checkedLabelPaths];

  // indeterminate is treated as unchecked
  if (checked === true) {
    updatedCheckedLabelPaths.push(labelPath);
  } else {
    updatedCheckedLabelPaths = checkedLabelPaths.filter((labels) => getLabelPathSignature(labels) !== getLabelPathSignature(labelPath));
  }

  // Ensure no duplicates and order matches the filter presentation (currently alphabetical)
  return sortFilterPathLabels(uniqBy(updatedCheckedLabelPaths, getLabelPathSignature));
};
