import uniqBy from "lodash/uniqBy";

import { TCheckboxState, TFilterPathLabel } from "@/types";
import { getLabelPathSignature, sortFilterPathLabels } from "@/utils/filters/filterPaths";

export const updateCheckedLabelPaths = (
  checkedLabelPaths: TFilterPathLabel[][],
  labelPath: TFilterPathLabel[],
  checked: TCheckboxState
): TFilterPathLabel[][] => {
  let updatedCheckedLabelPaths = [...checkedLabelPaths];

  // Indeterminate is treated as unchecked
  if (checked === true) {
    const labelPathSignature = getLabelPathSignature(labelPath);
    updatedCheckedLabelPaths = [
      // Removes any child filters below the filter being checked
      ...checkedLabelPaths.filter((labels) => !(labels.length > labelPath.length && getLabelPathSignature(labels).startsWith(labelPathSignature))),
      labelPath,
    ];
  } else {
    updatedCheckedLabelPaths = checkedLabelPaths.filter((labels) => getLabelPathSignature(labels) !== getLabelPathSignature(labelPath));
  }

  // Ensure no duplicates and order matches the filter presentation (currently alphabetical)
  return sortFilterPathLabels(uniqBy(updatedCheckedLabelPaths, getLabelPathSignature));
};
