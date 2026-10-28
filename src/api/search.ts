import { ID_SEPARATOR } from "@/constants/chars";
import { SORT_PARAMS_LOOKUP } from "@/constants/sort";
import { ISearchDocumentsResponse, TLabelCategoryValue, TSearchQueryGroup, TSearchQueryRule, TSortValue, TThemeConfig } from "@/types";
import { DATE_RANGE_MIN_YEAR, hasPublishedDateRule } from "@/utils/_experiment/dateRangeFilters";
import { deflateFilters } from "@/utils/filters/deflate";

export const getSearchApiStatus = (error: unknown): number | undefined => {
  return error instanceof Error ? (error as Error & { status?: number }).status : undefined;
};

interface ISearchDocumentsParams {
  /** API gateway base URL, from `useEnvConfig().API_URL` at the call site. */
  apiUrl: string;
  themeConfig: TThemeConfig;
  query?: string;
  filters?: TSearchQueryGroup;
  page_size?: string;
  page_token?: string;
  sort?: TSortValue;
  signal?: AbortSignal;
}

// Fraction of query terms a document must match, so extra words narrow the results
export const SEARCH_DOCUMENTS_MIN_SHOULD_MATCH = 0.7;

const searchDocumentsUrl = (apiUrl: string): string => `${apiUrl.replace(/\/$/, "")}/search/documents`;

// Add default filters exclusive of search parameters to ensure they are always applied
export function configureDocumentsFilters(
  filters: TSearchQueryGroup | undefined,
  searchCategories: TLabelCategoryValue[],
  searchExcludeLabels: string[] = []
): TSearchQueryGroup {
  const publishedDateBoundsFilter: TSearchQueryGroup = {
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
  const categoriesFilter: TSearchQueryGroup = {
    op: "or",
    filters: searchCategories.map((categoryValue) => ({
      op: "contains",
      field: "labels.value.id",
      value: ["category", categoryValue].join(ID_SEPARATOR),
    })),
  };

  const filtersWithConditionals: (TSearchQueryGroup | TSearchQueryRule)[] = [];

  if (!hasPublishedDateRule(filters)) {
    filtersWithConditionals.push(publishedDateBoundsFilter);
  }
  if (searchCategories.length > 0) {
    filtersWithConditionals.push(categoriesFilter);
  }
  searchExcludeLabels.forEach((id) => {
    filtersWithConditionals.push({ op: "not_contains", field: "labels.value.id", value: id });
  });
  if (filters) {
    filtersWithConditionals.push(filters);
  }

  return {
    op: "and",
    filters: filtersWithConditionals,
  };
}

export const fetchSearchDocuments = async (params: ISearchDocumentsParams): Promise<ISearchDocumentsResponse> => {
  const url = new URL(searchDocumentsUrl(params.apiUrl));
  const filters = configureDocumentsFilters(params.filters, params.themeConfig.searchCategories, params.themeConfig.searchExcludeLabels);

  // This enables `bolding` in vespa AKA highlighting, which highlights the matched terms in the results.
  url.searchParams.set("bolding", "true");
  if (params.query) {
    url.searchParams.set("query", params.query);
    url.searchParams.set("msm", String(SEARCH_DOCUMENTS_MIN_SHOULD_MATCH));
  }
  if (filters) {
    url.searchParams.set("filters", deflateFilters(filters));
    url.searchParams.set("encoding", "deflate");
  }
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);
  const sortKey = params.sort ?? "relevance";
  url.searchParams.set("order_by", SORT_PARAMS_LOOKUP[sortKey]);

  const res = await fetch(url, { signal: params.signal });
  if (!res.ok)
    throw Object.assign(new Error(`Search API error: ${res.status}`), {
      status: res.status,
    });
  return res.json() as Promise<ISearchDocumentsResponse>;
};

export const fetchSearchPrincipalDocuments = (params: ISearchDocumentsParams): Promise<ISearchDocumentsResponse> => {
  const principalDocumentsFilter: TSearchQueryRule = {
    field: "labels.value.id",
    op: "contains",
    value: "status::Principal",
  };
  const filters: (TSearchQueryGroup | TSearchQueryRule)[] = [principalDocumentsFilter];
  if (params.filters) filters.push(params.filters);

  return fetchSearchDocuments({
    ...params,
    filters: {
      op: "and",
      filters,
    },
  });
};
