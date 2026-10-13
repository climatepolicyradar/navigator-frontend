import { ID_SEPARATOR } from "@/constants/chars";
import { SORT_PARAMS_LOOKUP } from "@/constants/sort";
import { ISearchDocumentsResponse, SORT_VALUES, TLabelCategoryValue, TSearchQueryGroup, TSearchQueryRule, TSortValue, TThemeConfig } from "@/types";
import { DATE_RANGE_MIN_YEAR, hasPublishedDateRule } from "@/utils/_experiment/dateRangeFilters";

const isSearchDocumentsSortKey = (value: string): value is TSortValue => {
  return SORT_VALUES.includes(value as TSortValue);
};

export const normaliseSearchDocumentsSortKey = (raw: string | null | undefined): TSortValue => {
  // Converts the raw URL `sort` query value to a known sort key (invalid to
  // `relevance`).
  return raw && isSearchDocumentsSortKey(raw) ? raw : "relevance";
};

export const getSearchApiStatus = (error: unknown): number | undefined => {
  return error instanceof Error ? (error as Error & { status?: number }).status : undefined;
};

interface ISearchDocumentsParams {
  themeConfig: TThemeConfig;
  query?: string;
  filters?: TSearchQueryGroup;
  page_size?: string;
  page_token?: string;
  sort?: TSortValue;
  signal?: AbortSignal;
}

const searchDocumentsUrl = (): string => {
  const origin = (process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org").replace(/\/$/, "");
  return `${origin}/search/documents`;
};

// Add default filters exclusive of search parameters to ensure they are always applied
const configureDocumentsFilters = (filters: TSearchQueryGroup | undefined, searchCategories: TLabelCategoryValue[]): TSearchQueryGroup => {
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
  if (filters) {
    filtersWithConditionals.push(filters);
  }

  return {
    op: "and",
    filters: filtersWithConditionals,
  };
};

export const fetchSearchDocuments = async (params: ISearchDocumentsParams): Promise<ISearchDocumentsResponse> => {
  const url = new URL(searchDocumentsUrl());
  const filters = configureDocumentsFilters(params.filters, params.themeConfig.searchCategories);

  // This enables `bolding` in vespa AKA highlighting, which highlights the matched terms in the results.
  url.searchParams.set("bolding", "true");
  if (params.query) url.searchParams.set("query", params.query);
  if (filters) url.searchParams.set("filters", JSON.stringify(filters));
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);
  const sortKey = params.sort ?? "relevance";
  url.searchParams.set("order_by", SORT_PARAMS_LOOKUP[sortKey]);

  const res = await fetch(url, { signal: params.signal });
  if (!res.ok) throw Object.assign(new Error(`Search API error: ${res.status}`), { status: res.status });
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
