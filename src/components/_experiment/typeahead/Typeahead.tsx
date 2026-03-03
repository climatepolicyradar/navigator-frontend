import { useContext, useMemo } from "react";

import { TopicsContext } from "@/context/TopicsContext";
import useConfig from "@/hooks/useConfig";
import useShadowSearch, { UseShadowSearchReturn } from "@/hooks/useShadowSearch";
import { TFilterFieldOptions } from "@/types";
import { buildFilterFieldOptions } from "@/utils/_experiment/buildFilterFieldOptions";

import { ActiveFiltersSidebar } from "./ActiveFiltersSidebar";
import { SearchTypeahead } from "./SearchTypeahead";
import { ShadowSearchResults } from "./ShadowSearchResults";

export interface TypeaheadProps {
  // When provided, use this state instead of internal useShadowSearch (shared with IntelliSearch). */
  shadowSearch?: UseShadowSearchReturn;
  // Required when shadowSearch is provided. Filter options for the shared state.
  filterOptions?: TFilterFieldOptions;
}

export function Typeahead({ shadowSearch: injectedShadowSearch, filterOptions: injectedFilterOptions }: TypeaheadProps = {}) {
  const topicsData = useContext(TopicsContext);
  const configQuery = useConfig();
  const { data: configData } = configQuery;
  const internalFilterOptions = useMemo(
    () =>
      buildFilterFieldOptions({
        topics: topicsData?.topics,
        regions: configData?.regions,
        countries: configData?.countries,
        corpusTypes: configData?.corpus_types,
      }),
    [topicsData?.topics, configData?.regions, configData?.countries, configData?.corpus_types]
  );

  const internalShadowSearch = useShadowSearch({ filterOptions: internalFilterOptions });
  const shadowSearch = injectedShadowSearch ?? internalShadowSearch;
  const filterOptions = injectedFilterOptions ?? internalFilterOptions;

  const { search, searchHistory, filters: filtersState, actions } = shadowSearch;
  const { term: searchTerm, setTerm: setSearchTerm, rawTerm: rawSearchTerm, matches: rawMatches, showStringOnlyResults } = search;
  const { history: recentSearches, clearHistory } = searchHistory;
  const { value: filters, hasAny: hasAnyFilters } = filtersState;
  const removeFilter = actions.remove;
  const addFilter = actions.add;
  const applyHistoryItem = actions.applyHistoryItem;

  return (
    <section className="bg-surface-light py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">Experimental</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">Search</h1>
        </header>
        <div className="grid gap-8 md:grid-cols-12 items-start">
          <ActiveFiltersSidebar filters={filters} onRemove={removeFilter} onClearAll={filtersState.clearAll} hasAnyFilters={hasAnyFilters} />

          <main className="md:col-span-8 space-y-6">
            <SearchTypeahead
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedFilters={filters}
              onAddFilter={addFilter}
              onApplyAll={actions.applyAll}
              onSearchOnly={actions.searchOnly}
              onApplyAdvancedFilters={actions.applyAdvanced}
              filterOptions={filterOptions}
              history={{
                items: recentSearches,
                clearHistory,
                onSelectItem: applyHistoryItem,
              }}
            />

            <ShadowSearchResults
              rawSearchTerm={rawSearchTerm}
              hasAnyFilters={hasAnyFilters}
              showStringOnlyResults={showStringOnlyResults}
              rawMatches={rawMatches}
              filters={filters}
              onAddFilter={addFilter}
            />
          </main>
        </div>
      </div>
    </section>
  );
}
