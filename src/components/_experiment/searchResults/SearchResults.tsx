import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect, useMemo } from "react";

import { fetchSearchDocuments, getSearchApiStatus, SearchDocument, SearchDocumentsResponse, SearchDocumentsSortKey } from "@/api/search";
import Loader from "@/components/Loader";
import { DocumentCard } from "@/components/molecules/documentCard/DocumentCard";
import { TSearchQueryGroup } from "@/types";
import { sanitiseSearchQueryGroup } from "@/utils/filters/advancedFilters";

import { isFilterGroupEmpty } from "../advancedFilters/AdvancedFilters";
import { EmptySearch } from "../emptySearch/EmptySearch";

export const SEARCH_RESULTS_PAGE_SIZE = 10;

// Principal = Family in old model
const isPrincipal = (result: SearchDocument): boolean => {
  return result.labels.some((label) => label.type === "status" && label.value.value === "Principal");
};

export const shouldRetrySearch = (failureCount: number, error: unknown): boolean => {
  return (getSearchApiStatus(error) ?? 500) >= 500 && failureCount < 3;
};

const searchErrorMessage = (error: unknown): string => {
  if (getSearchApiStatus(error) === 414) {
    return "This search has too many filters for us to run. Remove some filters and try again.";
  }
  return "Something went wrong with your search. Please try again.";
};

function SearchResults({
  data,
  onResultClicked,
}: {
  data: SearchDocumentsResponse;
  onResultClicked?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div data-cy="search-results">
      <ul className="flex flex-col gap-4 highlights">
        {data.results.map((result) => (
          <Fragment key={result.id}>
            {isPrincipal(result) && (
              <li>
                <DocumentCard document={result} onClick={onResultClicked} />
              </li>
            )}
            {/* TODO: remove non-principal results */}
            {!isPrincipal(result) && (
              <li className={`flex gap-2 border border-transparent rounded-md py-2 pr-6 highlights`}>
                <p>Shouldn't be showing a non-principle doc here</p>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

export function SearchContainer({
  query,
  filters,
  page_token,
  sort,
  onTotalResultsChange,
  onSearchingChange,
  onResultClicked,
}: {
  selectedLabels?: string[];
  query?: string;
  filters?: TSearchQueryGroup;
  page_token?: string;
  sort?: SearchDocumentsSortKey;
  onTotalResultsChange?: (total: number | null) => void;
  onSearchingChange?: (isSearching: boolean) => void;
  onResultClicked?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // Drop placeholder rules (e.g. default empty label row) so date-only filters still fetch.
  const nonEmptyFilters = useMemo(() => {
    if (!filters) return undefined;
    const sanitised = sanitiseSearchQueryGroup(filters);
    return isFilterGroupEmpty(sanitised) ? undefined : sanitised;
  }, [filters]);

  const hasSearch = !!query || !!nonEmptyFilters;

  const { data, error, isError, isPending } = useQuery({
    queryKey: ["searchDocuments", query, nonEmptyFilters, page_token, sort],
    queryFn: ({ signal }) =>
      fetchSearchDocuments({
        query,
        page_size: SEARCH_RESULTS_PAGE_SIZE.toString(),
        page_token,
        filters: nonEmptyFilters,
        sort,
        signal,
      }),
    enabled: hasSearch,
    retry: shouldRetrySearch,
    // A term's results do not change within a session.
    refetchOnWindowFocus: false,
  });

  const isSearching = hasSearch && isPending;

  // callback to parent if needed
  const totalResults = isError ? null : (data?.total_size ?? null);
  useEffect(() => {
    onTotalResultsChange?.(totalResults);
  }, [totalResults, onTotalResultsChange]);

  useEffect(() => {
    onSearchingChange?.(isSearching);
  }, [isSearching, onSearchingChange]);

  if (!hasSearch) return <EmptySearch />;

  if (isSearching) {
    return (
      <div className="flex justify-center" data-cy="search-loading">
        <Loader />
      </div>
    );
  }

  if (isError) return <p className="py-10 text-center text-sm text-text-secondary">{searchErrorMessage(error)}</p>;

  return <SearchResults data={data} onResultClicked={onResultClicked} />;
}
