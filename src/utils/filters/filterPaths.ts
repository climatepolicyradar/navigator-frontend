import sortBy from "lodash/sortBy";

import { SEARCH_FILTER_GROUPS } from "@/constants/filters";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

export const getFilterPathLabel = (nestedSearchLabel: TNestedSearchLabel): TFilterPathLabel => ({
  id: nestedSearchLabel.id,
  type: nestedSearchLabel.type,
  value: nestedSearchLabel.value,
});

// Includes a label's virtual parentPath (e.g. a flattened geography's region), which isn't reflected in the render tree
export const getFilterPathLabels = (label: TNestedSearchLabel, ancestorPath: TFilterPathLabel[]): TFilterPathLabel[] => [
  getFilterPathLabel(label),
  ...(label.parentPath ?? []),
  ...ancestorPath,
];

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
      const groupIndex = SEARCH_FILTER_GROUPS.findIndex((group) => group.rootLabelTypes.includes(rootLabel.type));
      return groupIndex !== -1 ? groupIndex : 99; // Ungrouped root labels go last
    },
    // Sort by alphabetical path
    getLabelPathSignature
  );
