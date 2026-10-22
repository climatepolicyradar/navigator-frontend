// Passage search against the v2 API. Mirrors the conventions in `./search.ts`:
// native fetch, the API gateway base URL passed in by the caller, and throwing
// on a non-2xx so react-query can surface the error.

import { SORT_PARAMS_LOOKUP } from "@/constants/sort";
import { ISearchPassagesParams, ISearchPassagesResponse, TPassagesScope } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";

export const SEARCH_PASSAGES_MIN_SHOULD_MATCH = 0.7;

const searchPassagesUrl = (apiUrl: string): string => `${apiUrl.replace(/\/$/, "")}/search/passages:within`;

const scopeDocumentIds = (scope: TPassagesScope): string[] => {
  switch (scope.kind) {
    case "documents":
      return scope.documentIds;
    case "principal":
      return [scope.principalId];
  }
};

export const fetchSearchPassages = async ({
  apiUrl,
  query,
  scope,
  filters,
  pageSize,
  pageToken,
  signal,
  sort,
}: ISearchPassagesParams): Promise<ISearchPassagesResponse> => {
  const url = new URL(searchPassagesUrl(apiUrl));
  url.searchParams.set("bolding", "true");

  if (query) {
    url.searchParams.set("query", query);
    url.searchParams.set("msm", String(SEARCH_PASSAGES_MIN_SHOULD_MATCH));
  }

  for (const documentId of scopeDocumentIds(scope)) {
    url.searchParams.append("document_id", documentId);
  }

  if (filters) {
    url.searchParams.set("filters", deflateFilters(filters));
    url.searchParams.set("encoding", "deflate");
  }

  if (pageSize !== undefined) {
    url.searchParams.set("page_size", String(pageSize));
  }

  if (pageToken !== undefined) {
    url.searchParams.set("page_token", String(pageToken));
  }

  const sortKey = sort ?? "relevance";
  url.searchParams.set("order_by", SORT_PARAMS_LOOKUP[sortKey]);
  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Passage search API error: ${res.status}`);
  }

  return res.json() as Promise<ISearchPassagesResponse>;
};
