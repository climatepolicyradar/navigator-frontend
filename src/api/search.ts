import { ID_SEPARATOR } from "@/constants/chars";
import { SORT_PARAMS_LOOKUP } from "@/constants/sort";
import themeConfig from "@/themes/config";
import {
  GeographyTypeV2,
  ISearchDocumentsResponse,
  TApiGeographyLabelCount,
  TSearchQueryGroup,
  TSearchQueryRule,
  TSortValue,
  TThemeConfig,
} from "@/types";
import { DATE_RANGE_MIN_YEAR, hasPublishedDateRule } from "@/utils/_experiment/dateRangeFilters";
import { deflateFilters } from "@/utils/filters/deflate";

export const getSearchApiStatus = (error: unknown): number | undefined => {
  return error instanceof Error ? (error as Error & { status?: number }).status : undefined;
};

interface ISearchDocumentsParams {
  /** API gateway base URL, from `useEnvConfig().API_URL` at the call site. */
  apiUrl: string;
  query?: string;
  filters?: TSearchQueryGroup;
  page_size?: string;
  page_token?: string;
  sort?: TSortValue;
  themeConfig?: TThemeConfig;
  signal?: AbortSignal;
}

// Fraction of query terms a document must match, so extra words narrow the results
export const SEARCH_DOCUMENTS_MIN_SHOULD_MATCH = 0.7;

interface ISearchApiRequest {
  apiUrl: string;
  path: string;
  filters?: TSearchQueryGroup;
  searchParams?: Record<string, string | string[] | undefined>;
  signal?: AbortSignal;
}

/**
 * GET one search API endpoint, returning its parsed body.
 *
 * Deflating `filters` lives here so no endpoint can send a filter tree without the
 * `encoding` that tells the API how to read it. An array value is repeated, an
 * undefined one omitted, so callers express an absent parameter as undefined.
 */
const searchApiGet = async <T>({ apiUrl, path, filters, searchParams, signal }: ISearchApiRequest): Promise<T> => {
  const url = new URL(`${apiUrl.replace(/\/$/, "")}${path}`);

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) value.forEach((item) => url.searchParams.append(key, item));
    else url.searchParams.set(key, value);
  });

  if (filters) {
    url.searchParams.set("filters", deflateFilters(filters));
    url.searchParams.set("encoding", "deflate");
  }

  const res = await fetch(url, { signal });
  if (!res.ok)
    throw Object.assign(new Error(`Search API error: ${res.status}`), {
      status: res.status,
    });

  return res.json() as Promise<T>;
};

const endOfDay = (): string => {
  const date = new Date();
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

/**
 * Add default filters exclusive of search parameters to ensure they are always applied.
 *
 * The theme config is the running app's own, so a caller cannot scope a request to a
 * theme this deployment does not serve. `config` overrides it for tests only.
 */
export function configureDocumentsFilters(filters?: TSearchQueryGroup, config: TThemeConfig = themeConfig): TSearchQueryGroup {
  const { searchCategories = [], searchExcludeLabels = [] } = config;
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
        value: endOfDay(),
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
    filtersWithConditionals.push({
      op: "not_contains",
      field: "labels.value.id",
      value: id,
    });
  });
  if (filters) {
    filtersWithConditionals.push(filters);
  }

  return {
    op: "and",
    filters: filtersWithConditionals,
  };
}

export const fetchSearchDocuments = (params: ISearchDocumentsParams): Promise<ISearchDocumentsResponse> =>
  searchApiGet<ISearchDocumentsResponse>({
    apiUrl: params.apiUrl,
    path: "/search/documents",
    filters: configureDocumentsFilters(params.filters, params.themeConfig),
    signal: params.signal,
    searchParams: {
      bolding: "true",
      query: params.query || undefined,
      msm: params.query ? String(SEARCH_DOCUMENTS_MIN_SHOULD_MATCH) : undefined,
      page_size: params.page_size,
      page_token: params.page_token,
      order_by: SORT_PARAMS_LOOKUP[params.sort ?? "relevance"],
    },
  });

const PRINCIPAL_DOCUMENTS_FILTER: TSearchQueryRule = {
  field: "labels.value.id",
  op: "contains",
  value: "status::Principal",
};

export const fetchSearchPrincipalDocuments = (params: ISearchDocumentsParams): Promise<ISearchDocumentsResponse> => {
  const filters: (TSearchQueryGroup | TSearchQueryRule)[] = [PRINCIPAL_DOCUMENTS_FILTER];
  if (params.filters) filters.push(params.filters);

  return fetchSearchDocuments({
    ...params,
    filters: {
      op: "and",
      filters,
    },
  });
};

interface IGeographiesAggregateParams {
  /** API gateway base URL, from `useEnvConfig().API_URL` at the call site. */
  apiUrl: string;
  /** Geography types to count. Omit for every type. */
  geographyTypes?: GeographyTypeV2[];
  themeConfig?: TThemeConfig;
  signal?: AbortSignal;
}

interface IGeographiesAggregateResponse {
  data: {
    count: number;
    value: { id: string; value: string; type: string };
  }[];
}

/**
 * Count documents per geography label, scoped to this app.
 *
 * Only geographies the app has documents for come back, so a filter built from
 * this cannot offer a value that returns no results (@see FUS-842).
 *
 * The app-level filters are the ones `fetchSearchDocuments` applies, so the
 * counts describe the same document set a search would return (@see FUS-475).
 */
export const fetchGeographiesAggregate = async (params: IGeographiesAggregateParams): Promise<TApiGeographyLabelCount[]> => {
  const body = await searchApiGet<IGeographiesAggregateResponse>({
    apiUrl: params.apiUrl,
    path: "/search/geographies:aggregate",
    filters: configureDocumentsFilters(undefined, params.themeConfig),
    signal: params.signal,
    searchParams: { "labels.value.type": params.geographyTypes },
  });

  return body.data.map(({ count, value }) => ({
    id: value.id,
    name: value.value,
    type: value.type,
    count,
  }));
};

export type TSitemapDocument = {
  slug: string;
  last_updated_date: string | null;
};

interface ISitemapDocumentsParams {
  /** API gateway base URL, from `useEnvConfig().API_URL` at the call site. */
  apiUrl: string;
  themeConfig?: TThemeConfig;
  signal?: AbortSignal;
}

interface ISitemapDocumentsResponse {
  data: TSitemapDocument[];
}

/**
 * Every principal document this app can serve, as a slug and a last-updated date.
 *
 * Unpaginated: the endpoint answers from attributes with an unranked query, so one
 * call replaces the paging that made the old sitemap too slow to build (@see FUS-913).
 *
 * The app-level filters are the ones `fetchSearchDocuments` applies, so the sitemap
 * lists the documents a search on this app would find - and nothing it would 404 on.
 */
export const fetchSitemapDocuments = async (params: ISitemapDocumentsParams): Promise<TSitemapDocument[]> => {
  const { data } = await searchApiGet<ISitemapDocumentsResponse>({
    apiUrl: params.apiUrl,
    path: "/search/documents:sitemap",
    filters: configureDocumentsFilters({ op: "and", filters: [PRINCIPAL_DOCUMENTS_FILTER] }, params.themeConfig),
    signal: params.signal,
  });

  return data;
};

export type TTaxonomyNode = {
  id: string;
  type: string;
  value: string;
  alternative_labels: string[];
  count: number;
  children: TTaxonomyNode[];
};

interface ILabelsTaxonomyParams {
  /** API gateway base URL, from `useEnvConfig().API_URL` at the call site. */
  apiUrl: string;
  /** Glob patterns over label paths, `/` between levels, `**` for any number of levels. */
  include: string[];
  themeConfig?: TThemeConfig;
  signal?: AbortSignal;
}

interface ILabelsTaxonomyResponse {
  data: TTaxonomyNode[];
}

/**
 * The label trees matching `include`, counted over the documents this app serves.
 *
 * Ancestors of a match come back with it. Unlike `fetchGeographiesAggregate`, a
 * label the app has no documents for comes back with `count: 0` rather than being
 * left out, so callers that only want labels with data check the count themselves.
 */
export const fetchLabelsTaxonomy = async (params: ILabelsTaxonomyParams): Promise<TTaxonomyNode[]> => {
  const { data } = await searchApiGet<ILabelsTaxonomyResponse>({
    apiUrl: params.apiUrl,
    path: "/search/labels:taxonomy",
    filters: configureDocumentsFilters(undefined, params.themeConfig),
    signal: params.signal,
    searchParams: { include: params.include },
  });

  return data;
};
