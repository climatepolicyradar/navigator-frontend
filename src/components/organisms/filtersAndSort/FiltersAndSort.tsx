import uniqBy from "lodash/uniqBy";
import { parseAsJson, useQueryState } from "nuqs";
import { useMemo } from "react";

import { CategorySpecificFilters } from "@/components/_experiment/categorySpecificFilters/CategorySpecificFilters";
import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { FILTER_GROUPS } from "@/constants/filters";
import { FiltersContext, TToggleFilterCallback } from "@/context/FiltersContext";
import { FilterGroupSchema } from "@/schemas";
import { TSearchLabel, TSearchQueryGroup } from "@/types";
import { getLabelPathSignature, sortFilterPathLabels } from "@/utils/filters/filterPaths";
import { groupSearchLabels } from "@/utils/filters/groupSearchLabels";
import { nestSearchLabels } from "@/utils/filters/nestSearchLabels";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";
import { queryGroupToFilterPaths } from "@/utils/search/queryGroupToFilterPaths";

const DEFAULT_SEARCH_QUERY_GROUP: TSearchQueryGroup = { op: "and", filters: [{ field: "labels.value.id", op: "contains", value: "" }] };

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
  const [filterParam, setFilterParam] = useQueryState(
    "filters",
    parseAsJson<TSearchQueryGroup>(FilterGroupSchema).withDefault(DEFAULT_SEARCH_QUERY_GROUP)
  );

  const checkedLabelPaths = useMemo(() => sortFilterPathLabels(queryGroupToFilterPaths(filterParam)), [filterParam]);
  const filterGroups = useMemo(() => groupSearchLabels(nestSearchLabels(labels), FILTER_GROUPS), [labels]);

  const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {
    const updatedCheckedLabelPaths = sortFilterPathLabels(
      checked === true // indeterminate is treated as unchecked
        ? uniqBy([...checkedLabelPaths, labelPath], getLabelPathSignature)
        : checkedLabelPaths.filter((labels) => getLabelPathSignature(labels) !== getLabelPathSignature(labelPath))
    );

    setFilterParam(filterPathsToQueryGroup(updatedCheckedLabelPaths));
  };

  const clearFilters = () => {
    setFilterParam(null);
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
