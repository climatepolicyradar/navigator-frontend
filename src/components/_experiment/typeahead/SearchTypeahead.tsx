import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { useState } from "react";

import { AdvancedFilterQueryBuilder } from "@/components/_experiment/typeahead/AdvancedFilterQueryBuilder";
import { SuggestedFilters } from "@/components/_experiment/typeahead/SuggestedFilters";
import { SearchHistoryItem } from "@/hooks/useSearchHistory";
import { TFilterClause, TFilterFieldOptions } from "@/types";
import { selectedFiltersToGroups } from "@/utils/_experiment/filterQueryBuilderUtils";
import { TIncludedFilterKey } from "@/utils/_experiment/shadowSearchFilterConfig";
import { getSuggestedFilterMatches } from "@/utils/_experiment/suggestedFilterMatching";
import { TSelectedFilters, hasAnyFilters as checkHasAnyFilters, hasAnyMatches } from "@/utils/_experiment/suggestedFilterUtils";

export interface ISearchTypeaheadProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  /** Current selected filters (included dimensions only needed for suggestions). */
  selectedFilters: TSelectedFilters;
  /** Add one value to an included filter key (topics, geos, years, documentTypes). */
  onAddFilter: (key: TIncludedFilterKey, value: string) => void;
  onApplyAll: (matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) => void;
  onSearchOnly: () => void;
  onApplyAdvancedFilters?: (clauses: TFilterClause[]) => void;
  filterOptions?: TFilterFieldOptions;
  placeholder?: string;
  /** When provided, a History button is shown in the search bar that opens recent searches. */
  history?: {
    items: SearchHistoryItem[];
    clearHistory: () => void;
    onSelectItem: (item: SearchHistoryItem) => void;
  };
}

export const SearchTypeahead = ({
  searchTerm,
  onSearchTermChange,
  selectedFilters,
  onAddFilter,
  onApplyAll,
  onSearchOnly,
  onApplyAdvancedFilters,
  filterOptions,
  placeholder = "Search",
  history: historyConfig,
}: ISearchTypeaheadProps) => {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [isHistoryPopoverOpen, setIsHistoryPopoverOpen] = useState(false);
  const trimmedSearchTerm = searchTerm.trim();
  const suggestedMatchesForInput = getSuggestedFilterMatches(trimmedSearchTerm, filterOptions);
  const hasSuggestedMatches = trimmedSearchTerm.length > 0 && hasAnyMatches(suggestedMatchesForInput);

  // Initial state for the builder derived from current applied filters so that
  // removing a filter from the sidebar is reflected when the user opens Advanced.
  const initialGroupsFromCurrentFilters = selectedFiltersToGroups(selectedFilters);

  const closeAdvancedFiltersAndApply = (clauses: TFilterClause[]) => {
    onApplyAdvancedFilters?.(clauses);
    setIsAdvancedFiltersOpen(false);
  };

  const closeAdvancedFiltersOnEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsAdvancedFiltersOpen(false);
    }
  };

  return (
    <div className="border border-border-lighter bg-white p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-stretch gap-0 rounded border border-border-lighter bg-surface-light">
          <div className="relative min-w-0 flex-1">
            <Input
              placeholder={placeholder}
              onChange={(e) => {
                onSearchTermChange(e.target.value);
              }}
              className="h-[44px] w-full rounded-l border-0 bg-transparent px-4 pr-10 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand focus-visible:ring-inset"
              value={searchTerm}
            />
            {searchTerm.length > 0 && (
              <Button
                type="button"
                onClick={() => onSearchTermChange("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center border border-border-lighter bg-surface-light text-xs font-medium text-text-secondary hover:bg-surface-ui"
              >
                x
              </Button>
            )}
          </div>
          {historyConfig !== undefined && (
            <BasePopover.Root open={isHistoryPopoverOpen} onOpenChange={(open) => setIsHistoryPopoverOpen(open)}>
              <BasePopover.Trigger
                render={(props) => (
                  <Button
                    {...props}
                    type="button"
                    className="h-[44px] shrink-0 rounded-r border-l border-border-lighter bg-surface-light px-3 py-2 text-sm font-medium text-text-tertiary transition hover:bg-surface-medium hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand focus-visible:ring-inset"
                  >
                    History
                  </Button>
                )}
              />
              <BasePopover.Portal>
                <BasePopover.Positioner positionMethod="fixed" sideOffset={8} className="z-50">
                  <BasePopover.Popup className="min-w-[220px] max-w-[360px] rounded border border-border-lighter bg-white p-4 shadow-md focus-visible:outline-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Recent searches</p>
                      {historyConfig.items.length > 0 && (
                        <button
                          type="button"
                          onClick={historyConfig.clearHistory}
                          className="text-xs text-text-tertiary hover:text-text-secondary underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {historyConfig.items.length === 0 ? (
                      <p className="text-xs text-text-tertiary">No recent searches.</p>
                    ) : (
                      <>
                        <p className="text-[10px] text-text-tertiary mb-2">Newest at top</p>
                        <ul className="space-y-1.5 max-h-[280px] overflow-y-auto">
                          {historyConfig.items.map((historyItem, index) => {
                            const isNewest = index === 0 && historyConfig.items.length > 1;
                            const isOldest = index === historyConfig.items.length - 1 && historyConfig.items.length > 1;
                            return (
                              <li key={`${historyItem.term}-${index}`}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    historyConfig.onSelectItem(historyItem);
                                    setIsHistoryPopoverOpen(false);
                                  }}
                                  className="w-full text-left inline-flex items-center gap-1.5 rounded border border-border-lighter bg-surface-light px-2 py-1.5 text-xs text-text-primary hover:bg-surface-medium"
                                >
                                  {isNewest && (
                                    <span className="shrink-0 rounded bg-text-brand/10 px-1 text-[10px] font-medium text-text-brand">Newest</span>
                                  )}
                                  {isOldest && !isNewest && (
                                    <span className="shrink-0 rounded bg-surface-medium px-1 text-[10px] text-text-tertiary">Oldest</span>
                                  )}
                                  <span className="truncate">{historyItem.term}</span>
                                  {historyItem.filters && checkHasAnyFilters(historyItem.filters) && (
                                    <span className="shrink-0 rounded bg-surface-medium px-1 text-[10px] text-text-tertiary">filters</span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </BasePopover.Popup>
                </BasePopover.Positioner>
              </BasePopover.Portal>
            </BasePopover.Root>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsAdvancedFiltersOpen(true)}
          className="text-sm text-text-tertiary hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand focus-visible:ring-inset rounded"
        >
          Advanced Search
        </button>
      </div>

      {isAdvancedFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" onKeyDown={closeAdvancedFiltersOnEscape}>
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" onClick={() => setIsAdvancedFiltersOpen(false)} />
          <div className="relative flex max-h-[90vh] min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-start justify-end p-2 pr-10">
              <button
                type="button"
                aria-label="Close advanced filters"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand"
                onClick={() => setIsAdvancedFiltersOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <AdvancedFilterQueryBuilder
                key={isAdvancedFiltersOpen ? `open-${JSON.stringify(selectedFilters)}` : "closed"}
                initialGroups={initialGroupsFromCurrentFilters}
                onApply={closeAdvancedFiltersAndApply}
                fieldOptions={filterOptions}
                className="max-w-none"
              />
            </div>
          </div>
        </div>
      )}

      {trimmedSearchTerm.length > 0 && (
        <>
          <SuggestedFilters
            searchTerm={trimmedSearchTerm}
            matches={suggestedMatchesForInput}
            selectedTopics={selectedFilters.topics}
            selectedGeos={selectedFilters.geos}
            selectedYears={selectedFilters.years}
            selectedDocumentTypes={selectedFilters.documentTypes}
            onSelectConcept={(selectedValue) => onAddFilter("topics", selectedValue)}
            onSelectGeo={(selectedValue) => onAddFilter("geos", selectedValue)}
            onSelectYear={(selectedValue) => onAddFilter("years", selectedValue)}
            onSelectDocumentType={(selectedValue) => onAddFilter("documentTypes", selectedValue)}
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {hasSuggestedMatches && (
              <>
                <Button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    onApplyAll({
                      concepts: suggestedMatchesForInput.matchedConcepts,
                      geos: suggestedMatchesForInput.matchedGeos,
                      years: suggestedMatchesForInput.matchedYears,
                      documentTypes: suggestedMatchesForInput.matchedDocumentTypes,
                    })
                  }
                  className="inline-flex items-center border border-border-lighter bg-text-brand px-4 py-2 text-xs font-semibold text-white hover:bg-text-brand/90"
                >
                  Apply all filters
                </Button>
                <span className="text-xs text-text-tertiary">or</span>
              </>
            )}
            <Button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onSearchOnly}
              className="inline-flex items-center border border-border-lighter bg-white px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-light"
            >
              Search &ldquo;{searchTerm}&rdquo; only
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
