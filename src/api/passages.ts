// Passage search against the v2 API. Mirrors the conventions in `./search.ts`:
// native fetch, `NEXT_PUBLIC_API_URL` with a public fallback, and throwing on a
// non-2xx so react-query can surface the error.

import { ISearchPassagesParams, ISearchPassagesResponse, TSearchQueryGroup } from "@/types";

const searchPassagesUrl = (): string => {
  const origin = (process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org").replace(/\/$/, "");
  return `${origin}/search/passages`;
};

// The scope the passages are searched within. Enumerating member `document_id`s is what lets a
// subset of a family's documents be searched, but a family can report no members at all (every
// member deleted), and an empty `or` group reads to the API as "no constraint" rather than "match
// nothing" - the search then escapes to the whole corpus. Passages carry their family's
// `principal_id`, so it stands in as a single-value scope for the whole family when there is no
// member to enumerate.
const configurePassagesScope = (documents: string[], principalId?: string): TSearchQueryGroup => {
  if (documents.length > 0) {
    return {
      op: "or",
      filters: documents.map((documentId) => ({ field: "document_id", op: "contains", value: documentId })),
    };
  }

  if (principalId) {
    return { op: "or", filters: [{ field: "principal_id", op: "contains", value: principalId }] };
  }

  throw new Error("Passage search needs a document or a principal to scope to");
};

const configurePassagesFilters = (documents: string[], principalId?: string, filters?: TSearchQueryGroup): TSearchQueryGroup => {
  const filtersWithConditionals: TSearchQueryGroup[] = [configurePassagesScope(documents, principalId)];

  if (filters) filtersWithConditionals.push(filters);

  return {
    op: "and",
    filters: filtersWithConditionals,
  };
};

export const fetchSearchPassages = async ({
  query,
  documents,
  principalId,
  filters,
  pageSize,
  pageToken,
  signal,
  sort,
}: ISearchPassagesParams): Promise<ISearchPassagesResponse> => {
  const url = new URL(searchPassagesUrl());

  url.searchParams.set("bolding", "true");
  url.searchParams.set("query", query);
  url.searchParams.set("filters", JSON.stringify(configurePassagesFilters(documents, principalId, filters)));
  if (pageSize !== undefined) url.searchParams.set("page_size", String(pageSize));
  if (pageToken !== undefined) url.searchParams.set("page_token", String(pageToken));
  const sortKey = sort ?? "relevance desc";
  url.searchParams.set("order_by", sortKey);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Passage search API error: ${res.status}`);
  return res.json() as Promise<ISearchPassagesResponse>;
};
