import { SuggestedFilters } from "@/components/_experiment/typeahead/SuggestedFilters";
import { useEnvConfig } from "@/context/EnvConfig";
import { useShadowSearchDocuments } from "@/hooks/useShadowSearchDocuments";
import type { ISearchApiDocument } from "@/utils/_experiment/shadowSearchDocumentsApi";
import { TIncludedFilterKey } from "@/utils/_experiment/shadowSearchFilterConfig";
import { TSuggestedFilterMatches } from "@/utils/_experiment/suggestedFilterMatching";
import { TSelectedFilters, hasAnyMatches } from "@/utils/_experiment/suggestedFilterUtils";

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
  filters: TSelectedFilters;
  /** Add one value to an included filter (e.g. from suggested filters). */
  onAddFilter: (key: TIncludedFilterKey, value: string) => void;
}

/**
 * Renders the document list from the search API (loading, error, or results).
 */
function DocumentResultsList({
  documents,
  isLoading,
  isError,
  hasApiUrl,
}: {
  documents: ISearchApiDocument[];
  isLoading: boolean;
  isError: boolean;
  hasApiUrl: boolean;
}) {
  if (!hasApiUrl) {
    return (
      <p className="text-xs text-text-tertiary">
        Set <code className="rounded bg-surface-light px-1">CONCEPTS_API_URL</code> to load results.
      </p>
    );
  }
  if (isLoading) {
    return <p className="text-xs text-text-tertiary">Loading results…</p>;
  }
  if (isError) {
    return <p className="text-xs text-red-600">Unable to load results. Check CONCEPTS_API_URL.</p>;
  }
  if (documents.length === 0) {
    return (
      <div className="space-y-1 text-xs text-text-tertiary">
        <p>No documents match your search.</p>
        <p>
          The API matches on labels. Check the browser console for the request URL and filters sent; try the same in the{" "}
          <a
            href="https://api.climatepolicyradar.org/search/docs#/default/read_documents_search_documents_get"
            target="_blank"
            rel="noreferrer"
            className="text-text-brand underline"
          >
            API docs
          </a>{" "}
          to confirm values.
        </p>
      </div>
    );
  }
  return (
    <ul className="mt-3 list-none space-y-2 text-sm">
      {documents.map((doc) => (
        <li key={doc.id} className="border-b border-border-lighter pb-2 last:border-0">
          <span className="font-medium text-text-primary">{doc.title}</span>
          {(doc.description ?? "") !== "" && <p className="mt-0.5 text-xs text-text-secondary line-clamp-2">{doc.description}</p>}
        </li>
      ))}
    </ul>
  );
}

/**
 * Results panel for shadow search: shows either filter-based results, string-only results
 * (with optional suggested filters), or placeholder. Connects to the search API
 * (GET /search/documents) with label filters per PR #115.
 */
export function ShadowSearchResults({
  rawSearchTerm,
  hasAnyFilters,
  showStringOnlyResults,
  rawMatches,
  filters,
  onAddFilter,
}: ShadowSearchResultsProps) {
  const hasActiveSearch = rawSearchTerm !== "" || hasAnyFilters;
  const { CONCEPTS_API_URL } = useEnvConfig();
  const { data, isLoading, isError } = useShadowSearchDocuments(rawSearchTerm, filters, hasAnyFilters);
  const hasApiUrl = Boolean(CONCEPTS_API_URL?.trim());

  if (!hasActiveSearch) return null;

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
          <DocumentResultsList documents={data?.results ?? []} isLoading={isLoading} isError={isError} hasApiUrl={hasApiUrl} />
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
          <DocumentResultsList documents={data?.results ?? []} isLoading={isLoading} isError={isError} hasApiUrl={hasApiUrl} />
          {hasAnyMatches(rawMatches) && (
            <>
              <p className="mt-3 text-xs text-text-secondary">To get more precise results, try applying filters based on your search.</p>
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
        <DocumentResultsList documents={data?.results ?? []} isLoading={isLoading} isError={isError} hasApiUrl={hasApiUrl} />
      </div>
    </div>
  );
}
