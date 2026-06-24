import { useMemo, useState } from "react";

import { CategorySpecificFilters } from "@/components/_experiment/categorySpecificFilters/CategorySpecificFilters";
import { FILTER_GROUPS } from "@/constants/filters";
import { FiltersContext, TToggleFilterCallback } from "@/context/FiltersContext";
import { TFilterPathLabel, TSearchLabel, TSearchQueryGroup } from "@/types";
import { getLabelPathSignature } from "@/utils/filters/filterPaths";
import { groupSearchLabels } from "@/utils/filters/groupSearchLabels";
import { nestSearchLabels } from "@/utils/filters/nestSearchLabels";
import { buildFilterGroup } from "@/utils/search/buildFilterGroup";

interface IProps {
  labels: TSearchLabel[];
  onFiltersChange: (group: TSearchQueryGroup) => void;
}

/**
 * TODO:
 * - Renders the filter buttons and their respective modals/popovers
 * - Renders the sort button and its popover
 * - Renders active filters below
 * - Encapsulates the logic for filters <-> URL
 */

export const FiltersAndSort = ({ labels, onFiltersChange }: IProps) => {
  // const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));

  const filterGroups = useMemo(() => groupSearchLabels(nestSearchLabels(labels), FILTER_GROUPS), [labels]);

  // TODO: query -> filters as a memoised function, wrapping a new fn to turn URL into label paths

  // --- TEMP ----------

  const [checkedLabelPaths, setCheckedLabelPaths] = useState<TFilterPathLabel[][]>([]);

  const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {
    setCheckedLabelPaths((existingCheckedLabelPaths) => {
      const updatedCheckedLabelPaths = checked
        ? [...existingCheckedLabelPaths, labelPath]
        : existingCheckedLabelPaths.filter((labels) => getLabelPathSignature(labels) !== getLabelPathSignature(labelPath));

      onFiltersChange(updatedCheckedLabelPaths.length > 0 ? buildFilterGroup(updatedCheckedLabelPaths) : null);
      return updatedCheckedLabelPaths;
    });
  };

  const clearFilters = () => {
    setCheckedLabelPaths([]);
    onFiltersChange(null);
  };

  // -------------------

  /**
   * TODO:
   * Blanks what is in the URL
   */
  // const clearFilters = () => {};

  /**
   * TODO:
   * Does nothing if there is actually no diff
   * Reconstructs the URL param
   * Sets the URL param
   */
  // const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {};

  return (
    <FiltersContext value={{ checkedLabelPaths, clearFilters, toggleFilter }}>
      <div className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2 flex flex-wrap gap-1">
        {filterGroups.map((group) => (
          <>
            {group.afterPartition && <div className="w-px h-full mx-3 bg-border-normal" />}
            <CategorySpecificFilters key={group.title} filterGroup={group} />
          </>
        ))}
      </div>
    </FiltersContext>
  );
};
