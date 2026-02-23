import { TSelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";

/**
 * Filter condition for the search API (PR #115).
 * @see https://github.com/climatepolicyradar/search/pull/115
 */
export interface ISearchApiFilterCondition {
  field: "labels.label.id";
  operator: "contains" | "not_contains";
  value: string[];
}

/**
 * Filter group for the search API; conditions are combined with the group operator.
 */
export interface ISearchApiFilterGroup {
  operator: "and" | "or";
  conditions: ISearchApiFilterCondition[];
}

/**
 * Document shape returned by GET /search/documents.
 */
export interface ISearchApiDocumentLabel {
  id: string;
  title: string;
  type: string;
}

export interface ISearchApiDocumentLabelRelationship {
  type: string;
  label: ISearchApiDocumentLabel;
  timestamp?: string;
}

export interface ISearchApiDocument {
  id: string;
  title: string;
  description: string | null;
  labels: ISearchApiDocumentLabelRelationship[];
}

export interface ISearchApiDocumentsResponse {
  total_results: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: ISearchApiDocument[];
}

const LABEL_FIELD = "labels.label.id" as const;

/**
 * Build the structured `filters` payload for GET /search/documents from shadow search state.
 * One AND group: each non-empty included dimension → one "contains" condition (OR within values);
 * each non-empty excluded dimension → one "not_contains" condition.
 */
export function selectedFiltersToSearchApiFilters(filters: TSelectedFilters): string | undefined {
  const conditions: ISearchApiFilterCondition[] = [];

  if (filters.topics.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "contains", value: [...filters.topics] });
  }
  if (filters.geos.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "contains", value: [...filters.geos] });
  }
  if (filters.years.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "contains", value: [...filters.years] });
  }
  if (filters.documentTypes.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "contains", value: [...filters.documentTypes] });
  }
  if (filters.topicsExcluded.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "not_contains", value: [...filters.topicsExcluded] });
  }
  if (filters.geosExcluded.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "not_contains", value: [...filters.geosExcluded] });
  }
  if (filters.yearsExcluded.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "not_contains", value: [...filters.yearsExcluded] });
  }
  if (filters.documentTypesExcluded.length > 0) {
    conditions.push({ field: LABEL_FIELD, operator: "not_contains", value: [...filters.documentTypesExcluded] });
  }

  if (conditions.length === 0) return undefined;

  const filterGroups: ISearchApiFilterGroup[] = [{ operator: "and", conditions }];
  return JSON.stringify(filterGroups);
}

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

/**
 * Fetch documents from the search API (GET /search/documents) with optional query and label filters.
 */
export async function fetchSearchDocuments(
  baseUrl: string,
  params: {
    query?: string | null;
    filters?: string | null;
    limit?: number;
    offset?: number;
  }
): Promise<ISearchApiDocumentsResponse> {
  const { query, filters, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = params;
  const searchParams = new URLSearchParams();
  if (query !== undefined && query !== null && query.trim() !== "") {
    searchParams.set("query", query.trim());
  }
  if (filters !== undefined && filters !== null && filters !== "") {
    searchParams.set("filters", filters);
  }
  searchParams.set("limit", String(limit));
  searchParams.set("offset", String(offset));

  const url = `${baseUrl.replace(/\/$/, "")}/search/documents?${searchParams.toString()}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Search API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<ISearchApiDocumentsResponse>;
}
