import { LucideCog } from "lucide-react";
import { Suspense, use, useMemo } from "react";

interface DocumentLabel {
  id: string;
  title: string;
  type: string;
}

interface DocumentLabelRelationship {
  type: string;
  label: DocumentLabel;
  timestamp: string | null;
}

interface DocumentItem {
  url: string | null;
}

interface DocumentWithoutRelationships {
  id: string;
  title: string;
  description: string | null;
  labels: DocumentLabelRelationship[];
  items: DocumentItem[];
}

interface DocumentDocumentRelationship {
  type: string;
  document: DocumentWithoutRelationships;
  timestamp: string | null;
}

interface SearchDocument {
  id: string;
  title: string;
  description: string | null;
  labels: DocumentLabelRelationship[];
  items: DocumentItem[];
  relationships: DocumentDocumentRelationship[];
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

interface SearchFilterGroup {
  operator: "and" | "or";
  conditions: {
    field: string;
    operator: "contains" | "not_contains";
    value: string[];
  }[];
}

interface SearchDocumentsParams {
  query?: string;
  filters?: SearchFilterGroup[];
  limit?: number;
  offset?: number;
}

const SEARCH_DOCUMENTS_BASE_URL = "https://api.climatepolicyradar.org/search/documents";

/*
  filters param uses the following structure:
  [{ operator: and, conditions: [{ labels.label.id, operator: contains, value: [Romania] }] }]
  where operator: and/or
  field: labels.label.id
  condition operator: contains/not_contain
  value: array of label ids
*/

function generateSearchFilters(selectedLabels: string[]): SearchFilterGroup[] {
  if (selectedLabels.length === 0) return [];

  return [
    {
      operator: "or",
      conditions: [
        {
          field: "labels.label.id",
          operator: "contains",
          value: selectedLabels,
        },
      ],
    },
  ];
}

export function fetchSearchDocuments(params: SearchDocumentsParams = {}): Promise<SearchDocumentsResponse> {
  const url = new URL(SEARCH_DOCUMENTS_BASE_URL);

  if (params.query) url.searchParams.set("query", params.query);
  if (params.filters) url.searchParams.set("filters", JSON.stringify(params.filters));
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
                {doc.labels.map((rel, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 rounded px-2 py-0.5 cursor-pointer hover:bg-gray-200"
                    onClick={() => onSelectLabel?.(rel.label.title)}
                  >
                    {rel.label.title}
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

export function SearchContainer({
  selectedLabels,
  query,
  onSelectLabel,
}: {
  selectedLabels?: string[];
  query?: string;
  onSelectLabel?: (label: string) => void;
}) {
  const searchPromise = useMemo(() => {
    if (!query && (!selectedLabels || selectedLabels.length === 0)) return null;

    return fetchSearchDocuments({
      query,
      limit: 10,
      offset: 0,
      filters: selectedLabels?.length ? generateSearchFilters(selectedLabels) : undefined,
    });
  }, [query, selectedLabels]);

  return (
    <>
      <div className="w-3/4 m-auto">
        {!query && (!selectedLabels || selectedLabels.length === 0) && <p className="text-sm text-text-secondary">Enter a search to see results.</p>}
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
