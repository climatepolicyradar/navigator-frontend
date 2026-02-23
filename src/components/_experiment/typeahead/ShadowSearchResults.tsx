import Link from "next/link";

import { SuggestedFilters } from "@/components/_experiment/typeahead/SuggestedFilters";
import { recordClickedDocument } from "@/utils/_experiment/clickedDocumentsCookie";
import { TIncludedFilterKey } from "@/utils/_experiment/shadowSearchFilterConfig";
import { TSuggestedFilterMatches } from "@/utils/_experiment/suggestedFilterMatching";
import { SelectedFilters, hasAnyMatches } from "@/utils/_experiment/suggestedFilterUtils";

const PLACEHOLDER_TITLES = ["Apple", "Banana", "Cherry", "Dragonfruit", "Elderberry", "Fig", "Grape", "Honeydew", "Kiwi", "Lemon"];

function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Placeholder card for a single search result. Links to a detail page with title + lorem ipsum.
 */
function ResultCardPlaceholder({ title }: { title: string }) {
  const slug = titleToSlug(title);
  const href = `/_search/result/${slug}`;

  return (
    <Link href={href} className="block" onClick={() => recordClickedDocument(slug)}>
      <article className="rounded-lg border border-border-lighter bg-white p-4 shadow-sm transition hover:border-border-light">
        <h3 className="mb-2 text-sm font-semibold text-text-primary">{title}</h3>
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-surface-light/80" />
          <div className="h-3 w-4/5 rounded bg-surface-light/80" />
          <div className="h-3 w-2/3 rounded bg-surface-light/60" />
        </div>
      </article>
    </Link>
  );
}

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
        <div className="border border-border-lighter bg-white p-4 space-y-4">
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
          <div className="grid grid-cols-1 gap-3">
            {PLACEHOLDER_TITLES.map((title, i) => (
              <ResultCardPlaceholder key={i} title={title} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showStringOnlyResults) {
    return (
      <div className="space-y-3">
        <div className="border border-border-lighter bg-white p-4 space-y-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
          <p className="text-sm text-text-primary">
            Showing results for <span className="font-semibold">&ldquo;{rawSearchTerm}&rdquo;</span>
          </p>
          {hasAnyMatches(rawMatches) && (
            <>
              <p className="text-xs text-text-secondary">To get more precise results, try applying filters based on your search.</p>
              <div className="bg-surface-light p-3">
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
          <div className="grid grid-cols-1 gap-3">
            {PLACEHOLDER_TITLES.map((title, i) => (
              <ResultCardPlaceholder key={i} title={title} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border border-border-lighter bg-white p-4 space-y-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
        <p className="text-xs text-text-tertiary">Search results will appear here.</p>
        <div className="grid grid-cols-1 gap-3">
          {PLACEHOLDER_TITLES.map((title, i) => (
            <ResultCardPlaceholder key={i} title={title} />
          ))}
        </div>
      </div>
    </div>
  );
}
