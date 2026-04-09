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
  filters?: string;
  page_size?: string;
  page_token?: string;
}

const SEARCH_DOCUMENTS_BASE_URL = "https://api.climatepolicyradar.org/search/documents";

export async function fetchSearchDocuments(params: SearchDocumentsParams = {}): Promise<SearchDocumentsResponse> {
  const url = new URL(SEARCH_DOCUMENTS_BASE_URL);

  if (params.query) url.searchParams.set("query", params.query);
  if (params.filters) url.searchParams.set("filters", params.filters);
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  return res.json() as Promise<SearchDocumentsResponse>;
}
