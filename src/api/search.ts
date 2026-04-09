import { TQueryGroup } from "@/components/_experiment/queryBuilder/QueryBuilder";

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

interface SearchDocumentsParams {
  query?: string;
  filters?: TQueryGroup;
  page_size?: string;
  page_token?: string;
  documents_only?: boolean;
}

const SEARCH_DOCUMENTS_BASE_URL = "https://api.climatepolicyradar.org/search/documents";

export async function fetchSearchDocuments(params: SearchDocumentsParams = {}): Promise<SearchDocumentsResponse> {
  const url = new URL(SEARCH_DOCUMENTS_BASE_URL);
  let filters = params.filters;

  // if principal_only is set, we add a filter
  // principal will have to be added as a parent group with AND to ensure if someone has chosen OR in the advanced filters
  const documentsFilter: TQueryGroup = {
    op: "and",
    filters: [
      {
        field: "labels.value.id",
        op: params.documents_only ? "not_contains" : "contains", // only this needs to change
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

  if (params.query) url.searchParams.set("query", params.query);
  if (filters) url.searchParams.set("filters", JSON.stringify(filters));
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  return res.json() as Promise<SearchDocumentsResponse>;
}
