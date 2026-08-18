import { LucideSearch } from "lucide-react";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { Fragment, ReactNode, SubmitEventHandler, useMemo, useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { SearchFiltersDrawer } from "@/components/molecules/searchFiltersDrawer/SearchFiltersDrawer";
import { SearchFiltersPopover } from "@/components/molecules/searchFiltersPopover/SearchFiltersPopover";
import { Sort } from "@/components/molecules/sort/Sort";
import { FiltersContext, TToggleFilterCallback } from "@/context/FiltersContext";
import { FilterGroupSchema } from "@/schemas";
import { TFiltersGroupConfig, TSearchLabel, TSearchQueryGroup, TSortOptionConfig } from "@/types";
import { sortFilterPathLabels } from "@/utils/filters/filterPaths";
import { getSearchLabelValues } from "@/utils/filters/getSearchLabelValues";
import { groupSearchLabels } from "@/utils/filters/groupSearchLabels";
import { nestSearchLabels } from "@/utils/filters/nestSearchLabels";
import { updateCheckedLabelPaths } from "@/utils/filters/updateCheckedLabelPaths";
import { DEFAULT_SEARCH_QUERY_GROUP, filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";
import { queryGroupToFilterPaths } from "@/utils/search/queryGroupToFilterPaths";

interface IProps {
  filterGroups: TFiltersGroupConfig[];
  filterParamKey: string;
  labels: TSearchLabel[];
  queryParamKey: string;
  resetPageOnSort?: boolean;
  sortOptions: TSortOptionConfig[];
  sortParamKey: string;
  text?: ReactNode;
}

export const SearchControls = ({
  filterGroups,
  filterParamKey,
  labels,
  queryParamKey,
  resetPageOnSort = false,
  sortOptions,
  sortParamKey,
  text,
}: IProps) => {
  const [queryParam, setQueryParam] = useQueryState(queryParamKey, parseAsString.withDefault(""));
  const [filterParam, setFilterParam] = useQueryState(
    filterParamKey,
    parseAsJson<TSearchQueryGroup>(FilterGroupSchema).withDefault(DEFAULT_SEARCH_QUERY_GROUP)
  );
  const [sortParam, setSortParam] = useQueryState(sortParamKey, parseAsString.withDefault(sortOptions[0]?.paramValue || ""));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentPage, setCurrentPage] = useQueryState("page_token", parseAsString.withDefault("1"));

  const [searchInput, setSearchInput] = useState(queryParam);

  const labelValues = useMemo(() => getSearchLabelValues(labels), [labels]);
  const checkedLabelPaths = useMemo(() => sortFilterPathLabels(queryGroupToFilterPaths(filterParam)), [filterParam]);
  const filterGroupsWithLabels = useMemo(() => groupSearchLabels(nestSearchLabels(labels), filterGroups), [filterGroups, labels]);

  const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {
    const updatedCheckedLabelPaths = updateCheckedLabelPaths(checkedLabelPaths, labelPath, checked);
    setFilterParam(filterPathsToQueryGroup(updatedCheckedLabelPaths));
  };

  const clearFilters = () => {
    setFilterParam(null);
  };

  const onSort = (sortValue: string) => {
    setSortParam(sortValue);
    if (resetPageOnSort) setCurrentPage("1");
  };

  const onQuerySubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setQueryParam(searchInput.trim());
  };

  return (
    <FiltersContext value={{ checkedLabelPaths, clearFilters, labelValues, toggleFilter }}>
      <form onSubmit={onQuerySubmit} className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2">
        <Input
          containerClasses="px-4 py-3 bg-bg-flat border border-border-normal rounded-lg placeholder-text-tertiary"
          inputClasses="py-0 text-sm! text-text-primary font-medium leading-5"
          icon={<LucideSearch size={16} />}
          clearable
          onChange={(event) => setSearchInput(event.target.value)}
          onClear={() => {
            setSearchInput("");
            setQueryParam("");
          }}
          value={searchInput}
        />
      </form>
      <div className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2 flex flex-wrap gap-1 justify-between">
        <div className="flex gap-1">
          {filterGroupsWithLabels.map((group) => {
            const SearchFilters = group.container === "drawer" ? SearchFiltersDrawer : SearchFiltersPopover;

            return (
              <Fragment key={group.title}>
                {group.afterPartition && <div className="w-px h-full mx-3 bg-border-normal" />}
                <SearchFilters filterGroup={group} />
              </Fragment>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {text}
          <Sort sortOptions={sortOptions} value={sortParam} onChange={onSort} />
        </div>
      </div>
      <AppliedFilters showClearAll />
    </FiltersContext>
  );
};
