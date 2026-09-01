import startCase from "lodash/startCase";

import { LABEL_DISPLAY_REPLACEMENTS } from "@/constants/labels";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { firstCase } from "@/utils/text/firstCase";

export const getLabelDisplay = (label: TNestedSearchLabel, ancestorPath: TFilterPathLabel[] = []) => {
  const parentLabelId = ancestorPath[0]?.id ?? null;
  const displayReplacement = LABEL_DISPLAY_REPLACEMENTS.find(
    (replacement) =>
      label.id.toLowerCase().includes(replacement.idMatch.toLowerCase()) &&
      (!("parentId" in replacement) || parentLabelId.toLowerCase() === replacement.parentId.toLowerCase())
  );

  return {
    type: startCase(displayReplacement?.type || label.type),
    name: firstCase(displayReplacement?.name || label.value),
  };
};
