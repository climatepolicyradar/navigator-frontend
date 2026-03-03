import { LucideCog } from "lucide-react";
import { Suspense, use, useMemo } from "react";

import { TQueryGroup } from "../queryBuilder/QueryBuilder";

interface DocumentLabel {
  id: string;
  value: string;
  type: string;
}

interface DocumentLabelRelationship {
  type: string;
  value: DocumentLabel;
  timestamp: string | null;
}

interface DocumentItem {
  url: string | null;
}

interface SearchDocument {
  id: string;
  title: string;
  description: string | null;
  labels: DocumentLabelRelationship[];
  items: DocumentItem[];
}

export interface SearchDocumentsResponse {
  total_results: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: SearchDocument[];
}

interface SearchDocumentsParams {
  query?: string;
  filters?: string;
  limit?: number;
  offset?: number;
}

const SEARCH_DOCUMENTS_BASE_URL = "https://api.climatepolicyradar.org/search/documents";

export function fetchSearchDocuments(params: SearchDocumentsParams = {}): Promise<SearchDocumentsResponse> {
  const url = new URL(SEARCH_DOCUMENTS_BASE_URL);

  if (params.query) url.searchParams.set("query", params.query);
  if (params.filters) url.searchParams.set("filters", params.filters);
  if (params.limit !== undefined) url.searchParams.set("limit", String(params.limit));
  if (params.offset !== undefined) url.searchParams.set("offset", String(params.offset));

  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Search API error: ${res.status}`);
    return res.json() as Promise<SearchDocumentsResponse>;
  });
}

export function SearchResults({ promise, onSelectLabel }: { promise: Promise<SearchDocumentsResponse>; onSelectLabel?: (label: string) => void }) {
  const data = use(promise);

  return (
    <div>
      <p className="text-sm text-text-secondary mb-4">
        {data.total_results ?? 0} results — page {data.page} of {data.total_pages ?? 1}
      </p>
      <ul className="space-y-4">
        {data.results.map((doc) => (
          <li key={doc.id} className="border border-gray-200 rounded-md p-4">
            <h3 className="font-semibold">{doc.title}</h3>
            {doc.description && <p className="text-sm text-text-secondary mt-1">{doc.description}</p>}
            {doc.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {doc.labels.map((label, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 rounded px-2 py-0.5 cursor-pointer hover:bg-gray-200"
                    onClick={() => onSelectLabel?.(label.value.value)}
                  >
                    {label.value.value}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
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
  onSelectLabel,
}: {
  selectedLabels?: string[];
  query?: string;
  filters?: TQueryGroup;
  onSelectLabel?: (label: string) => void;
}) {
  const searchPromise = useMemo(() => {
    if (!query && (!filters || !filtersDoesNotContainEmptyRule(filters))) return null;

    return fetchSearchDocuments({
      query,
      // limit: 10,
      // offset: 0,
      filters: filtersDoesNotContainEmptyRule(filters) ? JSON.stringify(filters) : undefined,
    });
  }, [query, filters]);

  return (
    <>
      <div className="w-3/4 m-auto">
        {/* {!query && (!selectedLabels || selectedLabels.length === 0) && <p className="text-sm text-text-secondary">Enter a search to see results.</p>} */}
        {searchPromise && (
          <Suspense
            fallback={
              <p className="text-sm text-text-secondary flex gap-2 items-center">
                <LucideCog className="animate-spin" /> Loading results…
              </p>
            }
          >
            <SearchResults promise={searchPromise} onSelectLabel={onSelectLabel} />
          </Suspense>
        )}
      </div>
    </>
  );
}
