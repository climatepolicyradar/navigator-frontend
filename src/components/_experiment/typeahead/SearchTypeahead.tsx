import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { Popover } from "@base-ui/react/popover";
import { useState } from "react";

import { AdvancedFilterQueryBuilder, type FilterClause } from "@/components/_experiment/typeahead/AdvancedFilterQueryBuilder";
import { SuggestedFilters, getSuggestedFilterMatches } from "@/components/_experiment/typeahead/SuggestedFilters";
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
  /** Apply advanced filter clauses as active filters and close the advanced panel. */
  onApplyAdvancedFilters?: (clauses: FilterClause[]) => void;
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
  placeholder = "Search",
}: ISearchTypeaheadProps) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const trimmedSearch = searchTerm.trim();
  const matches = getSuggestedFilterMatches(trimmedSearch);
  const hasMatches = trimmedSearch.length > 0 && hasAnyMatches(matches);

  const handleApplyAdvanced = (clauses: FilterClause[]) => {
    onApplyAdvancedFilters?.(clauses);
    setAdvancedOpen(false);
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
              onClick={() => onSearchTermChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center border border-border-lighter bg-surface-light text-xs font-medium text-text-secondary hover:bg-surface-ui"
            >
              x
            </Button>
          )}
        </div>
        <Popover.Root open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <Popover.Trigger className="shrink-0 rounded-r border-l border-border-lighter px-3 py-2 text-sm font-medium text-text-tertiary transition hover:bg-surface-ui hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand focus-visible:ring-inset">
            Advanced
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner positionMethod="fixed" side="bottom" sideOffset={8} align="end" className="z-50">
              <Popover.Popup className="rounded-lg border border-gray-200 bg-white p-4 shadow-xl focus:outline-none">
                <AdvancedFilterQueryBuilder onApply={handleApplyAdvanced} />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

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
