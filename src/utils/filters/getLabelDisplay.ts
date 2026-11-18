import startCase from "lodash/startCase";

import { LABEL_DISPLAY_REPLACEMENTS } from "@/constants/labels";
import { TFilterPathLabel } from "@/types";
import { firstCase } from "@/utils/text/firstCase";

export const getLabelDisplay = (label: TFilterPathLabel, ancestorPath: TFilterPathLabel[] = []) => {
  const parentLabelId = ancestorPath[0]?.id ?? null;
  const displayReplacement = LABEL_DISPLAY_REPLACEMENTS.find(
    (replacement) =>
      label.id.toLowerCase().includes(replacement.idMatch.toLowerCase()) &&
      (!("parentId" in replacement) || (parentLabelId !== null && parentLabelId.toLowerCase() === replacement.parentId.toLowerCase()))
  );

  return {
    type: startCase(displayReplacement?.type || label.type),
    name: firstCase(displayReplacement?.name || label.value),
    subtitle: displayReplacement?.subtitle || null,
  };
};
