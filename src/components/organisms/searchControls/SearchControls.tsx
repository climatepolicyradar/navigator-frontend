import { LucideSearch } from "lucide-react";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { Fragment, ReactNode, SubmitEventHandler, useMemo, useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { SearchFiltersDate } from "@/components/molecules/searchFiltersDate/SearchFiltersDate";
import { SearchFiltersDrawer } from "@/components/molecules/searchFiltersDrawer/SearchFiltersDrawer";
import { SearchFiltersPopover } from "@/components/molecules/searchFiltersPopover/SearchFiltersPopover";
import { Sort } from "@/components/molecules/sort/Sort";
import { FiltersContext, TDateRange, TToggleFilterCallback } from "@/context/FiltersContext";
import { TFilterPathLabel, TFiltersGroupConfig, TSearchLabel, TSortOptionConfig, TSortValue } from "@/types";
import { parseAsDeflatedFilters } from "@/utils/filters/deflate";
import { sortFilterPathLabels } from "@/utils/filters/filterPaths";
import { getSearchLabelValues } from "@/utils/filters/getSearchLabelValues";
import { groupSearchLabels } from "@/utils/filters/groupSearchLabels";
import { nestSearchLabels } from "@/utils/filters/nestSearchLabels";
import { updateCheckedLabelPaths } from "@/utils/filters/updateCheckedLabelPaths";
import { DEFAULT_SEARCH_QUERY_GROUP, filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";
import { queryGroupToFilterPaths } from "@/utils/search/queryGroupToFilterPaths";
import { PAGE_TOKEN_PARAM_KEY } from "@/utils/search/searchLevels";
import { formatDateShort } from "@/utils/timedate";

const SEARCH_FILTERS_LOOKUP = {
  datepicker: SearchFiltersDate,
  drawer: SearchFiltersDrawer,
  popover: SearchFiltersPopover,
};

interface IProps {
  conceptsLogic: "and" | "or";
  extraContent?: ReactNode; // Benefits from FiltersContext for rendering suggestions / zero state
  filterGroups: TFiltersGroupConfig[];
  filterParamKey: string;
  filtersSlot?: ReactNode;
  labels: TSearchLabel[];
  nameLabels?: TSearchLabel[];
  pageParamKey?: string;
  queryParamKey: string;
  resultsNode?: ReactNode;
  resultsMostRecent?: Date | null;
  sortOptions: TSortOptionConfig[];
  sortParamKey: string;
  sortDefault?: (checkedLabelPaths: TFilterPathLabel[][], query: string) => TSortValue;
}

export const SearchControls = ({
  conceptsLogic,
  extraContent = null,
  filterGroups,
  filterParamKey,
  filtersSlot,
  labels,
  nameLabels,
  pageParamKey = PAGE_TOKEN_PARAM_KEY,
  queryParamKey,
  resultsNode,
  resultsMostRecent,
  sortDefault,
  sortOptions,
  sortParamKey,
}: IProps) => {
  const [queryParam, setQueryParam] = useQueryState(queryParamKey, parseAsString.withDefault(""));
  const [filterParam, setFilterParam] = useQueryState(filterParamKey, parseAsDeflatedFilters.withDefault(DEFAULT_SEARCH_QUERY_GROUP));
  const [, setCurrentPage] = useQueryState(pageParamKey, parseAsString.withDefault("1"));

  // Default sort is dynamic
  const fromFilterParam = queryGroupToFilterPaths(filterParam);
  // Parsed against the options this control actually offers, not every sort value there is. The
  // param is shared between searches, so a value from another search has to fall back to the
  // default here; left accepted, it matches no option and the control renders blank.
  const sortValues = useMemo(() => sortOptions.map((option) => option.paramValue) as [TSortValue, ...TSortValue[]], [sortOptions]);
  const [sortParam, setSortParam] = useQueryState<TSortValue>(
    sortParamKey,
    parseAsStringLiteral(sortValues)
      .withDefault(sortDefault ? sortDefault(fromFilterParam.filterPathLabels, queryParam) : sortOptions[0].paramValue)
      .withOptions({ clearOnDefault: false })
  );

  const [searchInput, setSearchInput] = useState(queryParam);
  const [lastQueryParam, setLastQueryParam] = useState(queryParam); // Keep input in sync with query

  if (queryParam !== lastQueryParam) {
    setLastQueryParam(queryParam);
    setSearchInput(queryParam);
  }

  // Chips for already-checked filters must resolve to a name even if that label falls outside the (possibly narrower) set offered in the menu, so fall back to `nameLabels`.
  const nestedLabels = useMemo(() => nestSearchLabels(labels), [labels]);
  const nestedNameLabels = useMemo(() => {
    const extra = (nameLabels ?? []).filter((label) => !labels.some((l) => l.id === label.id));
    return nestSearchLabels([...labels, ...extra]);
  }, [labels, nameLabels]);

  const labelValues = useMemo(() => getSearchLabelValues(nestedNameLabels), [nestedNameLabels]);
  const filterGroupsWithLabels = useMemo(() => groupSearchLabels(nestedLabels, filterGroups), [filterGroups, nestedLabels]);

  const { appliedDateRange, checkedLabelPaths } = useMemo(() => {
    return {
      appliedDateRange: fromFilterParam.dateRange,
      checkedLabelPaths: sortFilterPathLabels(fromFilterParam.filterPathLabels, filterGroups),
    };
  }, [filterGroups, fromFilterParam]);

  const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {
    const updatedCheckedLabelPaths = updateCheckedLabelPaths(checkedLabelPaths, labelPath, checked, filterGroups);
    setFilterParam(filterPathsToQueryGroup(updatedCheckedLabelPaths, appliedDateRange, conceptsLogic));
    setCurrentPage("1");
  };

  const clearFilters = () => {
    setFilterParam(null);
    setCurrentPage("1");
  };

  const onSetDateRange = (dateRange: TDateRange) => {
    setFilterParam(filterPathsToQueryGroup(checkedLabelPaths, dateRange, conceptsLogic));
    setCurrentPage("1");
  };

  const onSort = (sortValue: TSortValue) => {
    setSortParam(sortValue);
    setCurrentPage("1");
  };

  const onQuerySubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setQueryParam(searchInput.trim());
    setCurrentPage("1");
  };

  return (
    <FiltersContext.Provider value={{ appliedDateRange, checkedLabelPaths, clearFilters, labelValues, setDateRange: onSetDateRange, toggleFilter }}>
      <div className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2 flex flex-col gap-y-4">
        <form onSubmit={onQuerySubmit}>
          <Input
            containerClasses="px-4 py-3 bg-bg-flat border border-border-normal rounded-lg placeholder-text-tertiary"
            inputClasses="py-0 text-sm! text-text-primary font-medium leading-5"
            icon={<LucideSearch size={16} />}
            clearable
            onChange={(event) => setSearchInput(event.target.value)}
            onClear={() => {
              setSearchInput("");
              setQueryParam("");
              setCurrentPage("1");
            }}
            value={searchInput}
          />
        </form>
        <div className="flex flex-wrap gap-1 justify-between text-sm text-text-primary font-normal leading-5">
          <div className="flex flex-wrap gap-1 items-center">
            {filtersSlot}
            {filterGroupsWithLabels.map((group) => {
              const SearchFilters = SEARCH_FILTERS_LOOKUP[group.container] ?? SearchFiltersPopover;

              return (
                <Fragment key={group.title}>
                  {group.afterPartition && <div className="w-px h-6 mx-3 bg-border-normal hidden sm:block" />}
                  <SearchFilters filterGroup={group} />
                </Fragment>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            {resultsNode && (
              <>
                {resultsNode}
                <div className="w-px h-4 mx-3 bg-border-normal" />
              </>
            )}
            {resultsMostRecent && (
              <>
                <div>
                  {/* TODO: localise this date */}
                  Most recent: {formatDateShort(resultsMostRecent, "en-GB")}
                </div>
                <div className="w-px h-4 mx-3 bg-border-normal" />
              </>
            )}
            <Sort sortOptions={sortOptions} value={sortParam} onChange={onSort} />
          </div>
        </div>
        <AppliedFilters filterGroups={filterGroups} showClearAll includeDateRange />
        {extraContent}
      </div>
    </FiltersContext.Provider>
  );
};
