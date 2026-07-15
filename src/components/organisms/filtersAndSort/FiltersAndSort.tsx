import uniqBy from "lodash/uniqBy";
import { parseAsJson, useQueryState } from "nuqs";
import { Fragment, useMemo } from "react";

import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { SearchFiltersDrawer } from "@/components/molecules/searchFiltersDrawer/SearchFiltersDrawer";
import { SearchFiltersPopover } from "@/components/molecules/searchFiltersPopover/SearchFiltersPopover";
import { FILTER_GROUPS } from "@/constants/filters";
import { FiltersContext, TToggleFilterCallback } from "@/context/FiltersContext";
import { FilterGroupSchema } from "@/schemas";
import { TSearchLabel, TSearchQueryGroup } from "@/types";
import { getLabelPathSignature, sortFilterPathLabels } from "@/utils/filters/filterPaths";
import { groupSearchLabels } from "@/utils/filters/groupSearchLabels";
import { nestSearchLabels } from "@/utils/filters/nestSearchLabels";
import { DEFAULT_SEARCH_QUERY_GROUP, filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";
import { queryGroupToFilterPaths } from "@/utils/search/queryGroupToFilterPaths";

interface IProps {
  labels: TSearchLabel[];
}

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
        {filterGroups.map((group) => {
          const SearchFilters = group.container === "drawer" ? SearchFiltersDrawer : SearchFiltersPopover;

          return (
            <Fragment key={group.title}>
              {group.afterPartition && <div className="w-px h-full mx-3 bg-border-normal" />}
              <SearchFilters filterGroup={group} />
            </Fragment>
          );
        })}
      </div>
      <AppliedFilters showClearAll />
    </FiltersContext>
  );
};
