import { LucideCog } from "lucide-react";
import React, { Fragment, Suspense, use, useEffect, useMemo } from "react";

import { fetchSearchDocuments, SearchDocument, SearchDocumentsResponse, SearchDocumentsSortKey } from "@/api/search";
import { DocumentCard } from "@/components/molecules/documentCard/DocumentCard";
import { TSearchQueryGroup } from "@/types";
import { sanitiseSearchQueryGroup } from "@/utils/filters/advancedFilters";

import styles from "./SearchResults.module.css";
import { isFilterGroupEmpty } from "../advancedFilters/AdvancedFilters";
import { EmptySearch } from "../emptySearch/EmptySearch";

// Principal = Family in old model
const isPrincipal = (result: SearchDocument): boolean => {
  return result.labels.some((label) => label.type === "status" && label.value.value === "Principal");
};

function SearchResults({
  promise,
  onTotalResultsChange,
  onResultClicked,
}: {
  promise: Promise<SearchDocumentsResponse>;
  onTotalResultsChange?: (total: number | null) => void;
  onResultClicked?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const data = use(promise);

  // notify parent of the number of results
  useEffect(() => {
    onTotalResultsChange?.(data.total_size ?? null);
  }, [data.total_size, onTotalResultsChange]);

  return (
    <div>
      <ul className="">
        {data.results.map((result) => (
          <Fragment key={result.id}>
            {isPrincipal(result) && (
              <li className={`flex flex-col ${styles["highlights"]}`}>
                <DocumentCard document={result} onClick={onResultClicked} />
              </li>
            )}
            {/* TODO: remove non-principal results */}
            {!isPrincipal(result) && (
              <li className={`flex gap-2 border border-transparent rounded-md py-2 pr-6 ${styles["highlights"]}`}>
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
  page_size,
  sort,
  onTotalResultsChange,
  onResultClicked,
}: {
  selectedLabels?: string[];
  query?: string;
  filters?: TSearchQueryGroup;
  page_token?: string;
  page_size?: string;
  sort?: SearchDocumentsSortKey;
  onTotalResultsChange?: (total: number | null) => void;
  onResultClicked?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // Drop placeholder rules (e.g. default empty label row) so date-only filters still fetch.
  const nonEmptyFilters = useMemo(() => {
    if (!filters) return undefined;
    const sanitised = sanitiseSearchQueryGroup(filters);
    return isFilterGroupEmpty(sanitised) ? undefined : sanitised;
  }, [filters]);

  const searchPromise = useMemo(() => {
    if (!query && !nonEmptyFilters) return null;

    return fetchSearchDocuments({
      query,
      page_size,
      page_token,
      filters: nonEmptyFilters,
      sort,
    });
  }, [query, nonEmptyFilters, page_token, page_size, sort]);

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
          <SearchResults promise={searchPromise} onTotalResultsChange={onTotalResultsChange} onResultClicked={onResultClicked} />
        </Suspense>
      ) : (
        <EmptySearch />
      )}
    </>
  );
}
