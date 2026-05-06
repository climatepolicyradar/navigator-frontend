import { isFilterGroupEmpty, TQueryGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { DATE_RANGE_MIN_YEAR, hasPublishedDateRule } from "@/utils/_experiment/dateRangeFilters";
import { stripEmptyValueRules } from "@/utils/filters/advancedFilters";

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

export const SEARCH_DOCUMENT_SORT_PARAMS: Record<SearchDocumentsSortKey, string> = {
  relevance: "relevance desc",
  recent: "attributes.published_date desc",
  oldest: "attributes.published_date asc",
  title_asc: "title asc",
  title_desc: "title desc",
};

function isSearchDocumentsSortKey(raw: string): raw is SearchDocumentsSortKey {
  return (SEARCH_DOCUMENT_SORT_KEYS as readonly string[]).includes(raw);
}

export function normaliseSearchDocumentsSortKey(raw: string | null | undefined): SearchDocumentsSortKey {
  // Converts the raw URL `sort` query value to a known sort key (invalid to
  // `relevance`).
  return raw && isSearchDocumentsSortKey(raw) ? raw : "relevance";
}

interface SearchDocumentsParams {
  query?: string;
  filters?: TQueryGroup;
  page_size?: string;
  page_token?: string;
  includeDocumentsInSearch?: boolean;
  sort?: SearchDocumentsSortKey;
  excludeMergedDocuments?: boolean;
}

function searchDocumentsUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org").replace(/\/$/, "");
  return `${origin}/search/documents`;
}

function configureDocumentsFilters(
  filters: TQueryGroup | undefined,
  includeDocumentsInSearch: boolean,
  excludeMergedDocuments: boolean
): TQueryGroup {
  const excludeMergedDocumentsFilter: TQueryGroup = {
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
  const publishedStatusFilter: TQueryGroup = {
    op: "and",
    filters: [
      {
        field: "attributes.status",
        op: "contains",
        value: "published",
      },
    ],
  };
  const publishedDateBoundsFilter: TQueryGroup = {
    op: "and",
    filters: [
      {
        field: "attributes.published_date",
        key: "published_date",
        op: "gte",
        value: `${DATE_RANGE_MIN_YEAR}-01-01T00:00:00.000Z`,
      },
      {
        field: "attributes.published_date",
        key: "published_date",
        op: "lte",
        value: new Date().toISOString(),
      },
    ],
  };

  // Always constrain document searches to published documents. Add default date
  // bounds only when the user has not provided any published_date rule.
  const filtersWithConditionals: TQueryGroup[] = [publishedStatusFilter];
  if (!hasPublishedDateRule(filters)) {
    filtersWithConditionals.push(publishedDateBoundsFilter);
  }
  if (filters) {
    filtersWithConditionals.push(filters);
  }

  if (excludeMergedDocuments) {
    filtersWithConditionals.push(excludeMergedDocumentsFilter);
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
  const url = new URL(searchDocumentsUrl());
  let userFilters = params.filters;
  if (userFilters) {
    const stripped = stripEmptyValueRules(userFilters);
    userFilters = isFilterGroupEmpty(stripped) ? undefined : stripped;
  }
  const filters = configureDocumentsFilters(userFilters, params.includeDocumentsInSearch ?? false, params.excludeMergedDocuments ?? true);

  // This enables `bolding` in vespa AKA highlighting, which highlights the matched terms in the results.
  url.searchParams.set("bolding", "true");

  if (params.query) url.searchParams.set("query", params.query);
  if (filters) url.searchParams.set("filters", JSON.stringify(filters));
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);
  const sortKey = params.sort ?? "relevance";
  url.searchParams.set("order_by", SEARCH_DOCUMENT_SORT_PARAMS[sortKey]);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  return res.json() as Promise<SearchDocumentsResponse>;
}
