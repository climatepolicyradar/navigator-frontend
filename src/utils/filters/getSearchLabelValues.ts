import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";
import { getLabelDisplay } from "@/utils/filters/getLabelDisplay";

// Uses a nested label list to contextualise calls to getLabelDisplay which may need the parent to decide on the name
export const getSearchLabelValues = (labels: TNestedSearchLabel[], ancestorPath: TFilterPathLabel[] = []): Record<string, string> =>
  Object.fromEntries(
    labels.flatMap((label) => {
      const { name } = getLabelDisplay(label, ancestorPath);
      const childAncestorPath = [getFilterPathLabel(label), ...ancestorPath];
      return [[label.id, name], ...Object.entries(getSearchLabelValues(label.children, childAncestorPath))];
    })
  );
