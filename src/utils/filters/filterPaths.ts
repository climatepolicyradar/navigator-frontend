import sortBy from "lodash/sortBy";

import { FILTER_GROUPS } from "@/constants/filters";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

export const getFilterPathLabel = (nestedSearchLabel: TNestedSearchLabel): TFilterPathLabel => ({
  id: nestedSearchLabel.id,
  type: nestedSearchLabel.type,
  value: nestedSearchLabel.value,
});

export const getLabelPathSignature = (labelPath: TFilterPathLabel[]) =>
  labelPath
    .map((label) => label.id)
    .reverse()
    .join("/");

export const sortFilterPathLabels = (labelPaths: TFilterPathLabel[][]) =>
  sortBy(
    labelPaths,
    // Sort by group
    (labelPath) => {
      const rootLabel = labelPath[labelPath.length - 1];
      const groupIndex = FILTER_GROUPS.findIndex((group) => group.rootLabelTypes.includes(rootLabel.type));
      return groupIndex !== -1 ? groupIndex : 99; // Ungrouped root labels go last
    },
    // Sort by alphabetical path
    getLabelPathSignature
  );
