import uniqBy from "lodash/uniqBy";
import { parseAsJson, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

import { createGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { CategorySpecificFilters } from "@/components/_experiment/categorySpecificFilters/CategorySpecificFilters";
import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { FILTER_GROUPS } from "@/constants/filters";
import { FiltersContext, TToggleFilterCallback } from "@/context/FiltersContext";
import { FilterGroupSchema } from "@/schemas";
import { TFilterPathLabel, TSearchLabel, TSearchQueryGroup } from "@/types";
import { getLabelPathSignature, sortFilterPathLabels } from "@/utils/filters/filterPaths";
import { groupSearchLabels } from "@/utils/filters/groupSearchLabels";
import { nestSearchLabels } from "@/utils/filters/nestSearchLabels";
import { buildFilterGroup } from "@/utils/search/buildFilterGroup";

interface IProps {
  labels: TSearchLabel[];
}

/**
 * TODO:
 * - Renders the filter buttons and their respective modals/popovers
 * - Renders the sort button and its popover
 * - Renders active filters below
 * - Encapsulates the logic for filters <-> URL
 */

export const FiltersAndSort = ({ labels }: IProps) => {
  // TODO does this all make sense?
  const [filterParam, setFilterParam] = useQueryState("filters", parseAsJson<TSearchQueryGroup>(FilterGroupSchema).withDefault(createGroup()));

  // TODO: query -> filters as a memoised function, wrapping a new fn to turn URL into label paths
  const [checkedLabelPaths, setCheckedLabelPaths] = useState<TFilterPathLabel[][]>([]);

  const filterGroups = useMemo(() => groupSearchLabels(nestSearchLabels(labels), FILTER_GROUPS), [labels]);

  const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {
    const updatedCheckedLabelPaths = sortFilterPathLabels(
      checked
        ? uniqBy([...checkedLabelPaths, labelPath], getLabelPathSignature)
        : checkedLabelPaths.filter((labels) => getLabelPathSignature(labels) !== getLabelPathSignature(labelPath))
    );

    setFilterParam(buildFilterGroup(updatedCheckedLabelPaths));
    setCheckedLabelPaths(updatedCheckedLabelPaths); // TODO remove
  };

  const clearFilters = () => {
    setFilterParam(null);
    setCheckedLabelPaths([]); // TODO remove
  };

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
      <AppliedFilters />
    </FiltersContext>
  );
};
