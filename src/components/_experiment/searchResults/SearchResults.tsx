import { LucideCog, LucideFileText } from "lucide-react";
import React, { Fragment, Suspense, use, useEffect, useMemo } from "react";

import { fetchSearchDocuments, SearchDocument, SearchDocumentsResponse, IAggregationLabel, SearchDocumentsSortKey } from "@/api/search";

import { DocumentSearchResult } from "./DocumentSearchResult";
import { PrincipalSearchResult } from "./PrincipalSearchResult";
import styles from "./SearchResults.module.css";
import { TQueryGroup } from "../advancedFilters/AdvancedFilters";
import { EmptySearch } from "../emptySearch/EmptySearch";

// Principal = Family in old model
const isPrincipal = (result: SearchDocument): boolean => {
  return result.labels.some((label) => label.type === "status" && label.value.value === "Principal");
};

export function SearchResults({
  data,
  onClick,
}: {
  data: SearchDocumentsResponse;
  onClick?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div>
      <ul className="space-y-4">
        {data.results.map((result) => (
          <Fragment key={result.id}>
            {isPrincipal(result) && (
              <li className={`flex flex-col ${styles["highlights"]}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onClick(result, e);
                  }}
                  className="group text-left w-full p-6 border border-transparent-regular rounded-md hover:bg-neutral-50"
                >
                  <PrincipalSearchResult result={result} />
                </button>
              </li>
            )}
            {!isPrincipal(result) && (
              <li className={`flex gap-2 border border-transparent rounded-md py-2 pr-6 ${styles["highlights"]}`}>
                <LucideFileText width={20} height={20} className="text-neutral-500 shrink-0 mt-1" />
                <div className="flex flex-col">
                  <DocumentSearchResult result={result} />
                </div>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

function SearchResultsWithAggregations({
  promise,
  onAggregationsChange,
  onTotalResultsChange,
  onResultClicked,
}: {
  promise: Promise<SearchDocumentsResponse>;
  onAggregationsChange?: (labels: IAggregationLabel[] | undefined) => void;
  onTotalResultsChange?: (total: number | null) => void;
  onResultClicked?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const data = use(promise);
  const labels = data.aggregations?.labels;

  /**
   * Pushing aggregations during render forced the parent to re-render on every
   * child render and fought cleared aggregation state. Sync after commit only.
   */
  useEffect(() => {
    onAggregationsChange?.(labels);
  }, [labels, onAggregationsChange]);

  // notify parent of the number of results
  useEffect(() => {
    onTotalResultsChange?.(data.total_size ?? null);
  }, [data.total_size, onTotalResultsChange]);

  return <SearchResults data={data} onClick={onResultClicked} />;
}

// If any of the values are empty strings, the filters are considered invalid and will not be sent to the API
const filtersDoesNotContainEmptyRule = (filters: TQueryGroup): boolean => {
  if (!filters || !filters.filters || filters.filters.length === 0) return false;

  for (const filter of filters.filters) {
    if ("value" in filter && filter.value.trim() === "") {
      return false;
    }
  }
  return true;
};

export function SearchContainer({
  query,
  filters,
  page_token,
  page_size,
  includeDocumentsInSearch,
  sort,
  excludeMergedDocuments,
  onAggregationsChange,
  onTotalResultsChange,
  onResultClicked,
}: {
  selectedLabels?: string[];
  query?: string;
  filters?: TQueryGroup;
  page_token?: string;
  page_size?: string;
  includeDocumentsInSearch?: boolean;
  sort?: SearchDocumentsSortKey;
  excludeMergedDocuments?: boolean;
  onAggregationsChange?: (labels: IAggregationLabel[] | undefined) => void;
  onTotalResultsChange?: (total: number | null) => void;
  onResultClicked?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const filtersCheckedForEmpty = filtersDoesNotContainEmptyRule(filters) ? filters : undefined;

  const searchPromise = useMemo(() => {
    if (!query && !filtersCheckedForEmpty) return null;

    return fetchSearchDocuments({
      query,
      page_size,
      page_token,
      includeDocumentsInSearch,
      excludeMergedDocuments,
      filters: filtersCheckedForEmpty,
      sort,
    });
  }, [query, filtersCheckedForEmpty, page_token, page_size, includeDocumentsInSearch, sort, excludeMergedDocuments]);

  return (
    <>
      {searchPromise ? (
        <Suspense
          fallback={
            <p className="text-sm text-text-secondary flex gap-2 items-center">
              <LucideCog className="animate-spin" /> Loading results…
            </p>
          }
        >
          <SearchResultsWithAggregations
            promise={searchPromise}
            onAggregationsChange={onAggregationsChange}
            onTotalResultsChange={onTotalResultsChange}
            onResultClicked={onResultClicked}
          />
        </Suspense>
      ) : (
        <EmptySearch />
      )}
    </>
  );
}
