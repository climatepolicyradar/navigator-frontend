import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { useState } from "react";

import { AdvancedFilterQueryBuilder } from "@/components/_experiment/typeahead/AdvancedFilterQueryBuilder";
import { SuggestedFilters, getSuggestedFilterMatches } from "@/components/_experiment/typeahead/SuggestedFilters";
import { TFilterClause, TFilterFieldOptions, TFilterGroup } from "@/types";
import { hasAnyMatches } from "@/utils/_experiment/suggestedFilterUtils";

export interface ISearchTypeaheadProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedTopics: string[];
  selectedGeos: string[];
  selectedYears: string[];
  selectedDocumentTypes: string[];
  onSelectConcept: (concept: string) => void;
  onSelectGeo: (geo: string) => void;
  onSelectYear: (year: string) => void;
  onSelectDocumentType: (documentType: string) => void;
  onApplyAll: (matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) => void;
  onSearchOnly: () => void;
  onApplyAdvancedFilters?: (clauses: TFilterClause[]) => void;
  filterOptions?: TFilterFieldOptions;
  placeholder?: string;
}

export const SearchTypeahead = ({
  searchTerm,
  onSearchTermChange,
  selectedTopics,
  selectedGeos,
  selectedYears,
  selectedDocumentTypes,
  onSelectConcept,
  onSelectGeo,
  onSelectYear,
  onSelectDocumentType,
  onApplyAll,
  onSearchOnly,
  onApplyAdvancedFilters,
  filterOptions,
  placeholder = "Search",
}: ISearchTypeaheadProps) => {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [lastAppliedGroups, setLastAppliedGroups] = useState<TFilterGroup[]>([]);
  const trimmedSearch = searchTerm.trim();
  const matches = getSuggestedFilterMatches(trimmedSearch, filterOptions);
  const hasMatches = trimmedSearch.length > 0 && hasAnyMatches(matches);

  const handleApplyAdvanced = (clauses: TFilterClause[]) => {
    onApplyAdvancedFilters?.(clauses);
    setIsAdvancedFiltersOpen(false);
  };

  const handleApplyWithGroups = (groups: TFilterGroup[]) => {
    setLastAppliedGroups(groups);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsAdvancedFiltersOpen(false);
    }
  };

  return (
    <div className="border border-border-lighter bg-white p-4 space-y-4">
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
        <Button
          type="button"
          onClick={() => setIsAdvancedFiltersOpen(true)}
          className="shrink-0 rounded-r border-l border-border-lighter px-3 py-2 text-sm font-medium text-text-tertiary transition hover:bg-surface-ui hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand focus-visible:ring-inset"
        >
          Advanced
        </Button>
      </div>

      {isAdvancedFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" onKeyDown={handleModalKeyDown}>
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
                key={isAdvancedFiltersOpen ? `open-${lastAppliedGroups.length}` : "closed"}
                initialGroups={lastAppliedGroups}
                onApply={handleApplyAdvanced}
                onApplyWithGroups={handleApplyWithGroups}
                fieldOptions={filterOptions}
                className="max-w-none"
              />
            </div>
          </div>
        </div>
      )}

      {trimmedSearch.length > 0 && (
        <>
          <SuggestedFilters
            searchTerm={trimmedSearch}
            matches={matches}
            selectedTopics={selectedTopics}
            selectedGeos={selectedGeos}
            selectedYears={selectedYears}
            selectedDocumentTypes={selectedDocumentTypes}
            onSelectConcept={onSelectConcept}
            onSelectGeo={onSelectGeo}
            onSelectYear={onSelectYear}
            onSelectDocumentType={onSelectDocumentType}
          />

          {hasMatches && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  onApplyAll({
                    concepts: matches.matchedConcepts,
                    geos: matches.matchedGeos,
                    years: matches.matchedYears,
                    documentTypes: matches.matchedDocumentTypes,
                  })
                }
                className="inline-flex items-center border border-border-lighter bg-text-brand px-4 py-2 text-xs font-semibold text-white hover:bg-text-brand/90"
              >
                Apply all filters
              </Button>
              <span className="text-xs text-text-tertiary">or</span>
              <Button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onSearchOnly}
                className="inline-flex items-center border border-border-lighter bg-white px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-light"
              >
                Search &ldquo;{searchTerm}&rdquo; only
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
