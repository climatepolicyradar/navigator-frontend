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

interface SearchDocumentsParams {
  query?: string;
  filters?: TQueryGroup;
  page_size?: string;
  page_token?: string;
  includeDocumentsInSearch?: boolean;
  excludeMergedDocuments?: boolean;
}

const SEARCH_DOCUMENTS_BASE_URL = "https://api.climatepolicyradar.org/search/documents";

function configureDocumentsFilters(
  filters: TQueryGroup | undefined,
  includeDocumentsInSearch: boolean,
  excludeMergedDocuments: boolean
): TQueryGroup {
  const notContainsMergedLabelFilter: TQueryGroup = {
    op: "and",
    filters: [
      {
        field: "labels.value.id",
        op: "not_contains",
        value: "status::Merged",
      },
    ],
  };
  const principalDocumentsFilter: TQueryGroup = {
    op: "and",
    filters: [
      {
        field: "labels.value.id",
        op: "contains",
        value: "status::Principal",
      },
    ],
  };

  const filtersWithConditionals: TQueryGroup[] = [];
  if (filters) {
    filtersWithConditionals.push(filters);
  }

  if (excludeMergedDocuments) {
    filtersWithConditionals.push(notContainsMergedLabelFilter);
  }

  if (!includeDocumentsInSearch) {
    filtersWithConditionals.push(principalDocumentsFilter);
  }

  return {
    op: "and",
    filters: filtersWithConditionals,
  };
}

export async function fetchSearchDocuments(params: SearchDocumentsParams = {}): Promise<SearchDocumentsResponse> {
  const url = new URL(SEARCH_DOCUMENTS_BASE_URL);
  const filters = configureDocumentsFilters(params.filters, params.includeDocumentsInSearch ?? false, params.excludeMergedDocuments ?? true);

  // This enables `bolding` in vespa AKA highlighting, which highlights the matched terms in the results.
  url.searchParams.set("bolding", "true");

  // This enables `bolding` in vespa AKA highlighting, which highlights the matched terms in the results.
  url.searchParams.set("bolding", "true");

  if (params.query) url.searchParams.set("query", params.query);
  if (filters) url.searchParams.set("filters", JSON.stringify(filters));
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  return res.json() as Promise<SearchDocumentsResponse>;
}
