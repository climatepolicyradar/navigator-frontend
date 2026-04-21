import { TQueryGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";

interface DocumentLabel {
  id: string;
  value: string;
  type: string;
}

interface DocumentLabelRelationship {
  count: number | null;
  type: string;
  value: DocumentLabel;
  timestamp: string | null;
}

export interface DocumentRelationship {
  type: string;
  value: SearchDocument;
}

interface DocumentItem {
  url: string | null;
}

export interface SearchDocument {
  id: string;
  title: string;
  description: string | null;
  labels: DocumentLabelRelationship[];
  documents: DocumentRelationship[];
  items: DocumentItem[];
  attributes: Record<string, string | number | boolean>;
}

export interface IAggregationLabel {
  count: number;
  value: {
    id: string;
    type: string;
    value: string;
  };
}

export interface SearchDocumentsResponse {
  total_size: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: SearchDocument[];
  aggregations?: {
    labels: IAggregationLabel[];
  };
}

export const SEARCH_DOCUMENT_SORT_KEYS = ["relevance", "recent", "oldest", "title_asc", "title_desc"] as const;

export type SearchDocumentsSortKey = (typeof SEARCH_DOCUMENT_SORT_KEYS)[number];

export function orderByParamFromSortKey(key: SearchDocumentsSortKey): string {
  const map: Record<SearchDocumentsSortKey, string> = {
    relevance: "relevance desc",
    recent: "attributes.published_date desc",
    oldest: "attributes.published_date asc",
    title_asc: "title asc",
    title_desc: "title desc",
  };
  return map[key];
}

function isSearchDocumentsSortKey(raw: string): raw is SearchDocumentsSortKey {
  return (SEARCH_DOCUMENT_SORT_KEYS as readonly string[]).includes(raw);
}

export function normaliseSearchDocumentsSortKey(raw: string | null | undefined): SearchDocumentsSortKey {
  return raw && isSearchDocumentsSortKey(raw) ? raw : "relevance";
}

interface SearchDocumentsParams {
  query?: string;
  filters?: TQueryGroup;
  page_size?: string;
  page_token?: string;
  includeDocumentsInSearch?: boolean;
  sort?: SearchDocumentsSortKey;
}

/**
 * Same API origin as `useLabelSearch` / `loadLabels` (`NEXT_PUBLIC_API_URL`).
 * Defaults to production; set e.g. `http://localhost:8000` for local search API.
 */
function searchDocumentsUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org").replace(/\/$/, "");
  return `${origin}/search/documents`;
}

function configureDocumentsFilters(filters: TQueryGroup | undefined, includeDocumentsInSearch: boolean): TQueryGroup {
  // including documents in search is the default search, otherwise default to only principal documents
  // principal will have to be added as a parent group with AND to ensure there are no conflicts if a user has built an advanced filtering ruleset
  if (!includeDocumentsInSearch) {
    const documentsFilter: TQueryGroup = {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "principal",
        },
      ],
    };
    if (filters) {
      filters = {
        op: "and",
        filters: [filters, documentsFilter],
      };
    } else {
      filters = documentsFilter;
    }
  }

  return filters;
}

export async function fetchSearchDocuments(params: SearchDocumentsParams = {}): Promise<SearchDocumentsResponse> {
  const url = new URL(searchDocumentsUrl());
  const filters = configureDocumentsFilters(params.filters, params.includeDocumentsInSearch ?? false);

  if (params.query) url.searchParams.set("query", params.query);
  if (filters) url.searchParams.set("filters", JSON.stringify(filters));
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);
  const sortKey = params.sort ?? "relevance";
  url.searchParams.set("order_by", orderByParamFromSortKey(sortKey));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  return res.json() as Promise<SearchDocumentsResponse>;
}
