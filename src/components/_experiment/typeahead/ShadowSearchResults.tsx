import { SuggestedFilters } from "@/components/_experiment/typeahead/SuggestedFilters";
import { TIncludedFilterKey } from "@/utils/_experiment/shadowSearchFilterConfig";
import { TSuggestedFilterMatches } from "@/utils/_experiment/suggestedFilterMatching";
import { SelectedFilters, hasAnyMatches } from "@/utils/_experiment/suggestedFilterUtils";

export interface ShadowSearchResultsProps {
  /** Committed search term (what results are shown for). */
  rawSearchTerm: string;
  /** Whether any filters are applied. */
  hasAnyFilters: boolean;
  /** True when showing string-only results (no filters). */
  showStringOnlyResults: boolean;
  /** Suggested filter matches for the raw term (for string-only suggestions). */
  rawMatches: TSuggestedFilterMatches;
  /** Current selected filters (for SuggestedFilters and display). */
  filters: SelectedFilters;
  /** Add one value to an included filter (e.g. from suggested filters). */
  onAddFilter: (key: TIncludedFilterKey, value: string) => void;
}

/**
 * Results panel for shadow search: shows either filter-based results, string-only results
 * (with optional suggested filters), or placeholder. Three branches kept in one component
 * for readability and testability.
 */
export function ShadowSearchResults({
  rawSearchTerm,
  hasAnyFilters,
  showStringOnlyResults,
  rawMatches,
  filters,
  onAddFilter,
}: ShadowSearchResultsProps) {
  if (!rawSearchTerm && !hasAnyFilters) return null;

  if (hasAnyFilters) {
    return (
      <div className="space-y-3">
        <div className="border border-border-lighter bg-white p-4 space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
          <div className="space-y-2 text-xs text-text-secondary">
            {rawSearchTerm ? (
              <>
                <p>
                  Showing results for <span className="font-semibold">&ldquo;{rawSearchTerm}&rdquo;</span> within your applied filters.
                </p>
                <p>Adjust or clear the filters on the left to change these results.</p>
              </>
            ) : (
              <p>Your search has been converted into the filters on the left. Adjust or clear the filters to change these results.</p>
            )}
          </div>
          <p className="text-xs text-text-tertiary">Search results will appear here.</p>
        </div>
      </div>
    );
  }

  if (showStringOnlyResults) {
    return (
      <div className="space-y-3">
        <div className="border border-border-lighter bg-white p-4 space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
          <p className="text-sm text-text-primary">
            Showing results for <span className="font-semibold">&ldquo;{rawSearchTerm}&rdquo;</span>
          </p>
          {hasAnyMatches(rawMatches) && (
            <>
              <p className="text-xs text-text-secondary">To get more precise results, try applying filters based on your search.</p>
              <div className="mt-3 bg-surface-light p-3">
                <SuggestedFilters
                  searchTerm={rawSearchTerm}
                  matches={rawMatches}
                  selectedTopics={filters.topics}
                  selectedGeos={filters.geos}
                  selectedYears={filters.years}
                  selectedDocumentTypes={filters.documentTypes}
                  onSelectConcept={(selectedValue) => onAddFilter("topics", selectedValue)}
                  onSelectGeo={(selectedValue) => onAddFilter("geos", selectedValue)}
                  onSelectYear={(selectedValue) => onAddFilter("years", selectedValue)}
                  onSelectDocumentType={(selectedValue) => onAddFilter("documentTypes", selectedValue)}
                  showHeader={false}
                  showEmptyCopy={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border border-border-lighter bg-white p-4 space-y-3">
        <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
        <p className="text-xs text-text-tertiary">Search results will appear here.</p>
      </div>
    </div>
  );
}
