// Passage search against the v2 API. Mirrors the conventions in `./search.ts`:
// native fetch, `NEXT_PUBLIC_API_URL` with a public fallback, and throwing on a
// non-2xx so react-query can surface the error.

import { ISearchPassagesParams, ISearchPassagesResponse, TSearchQueryGroup } from "@/types";

function searchPassagesUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org").replace(/\/$/, "");
  return `${origin}/search/passages`;
}

function configurePassagesFilters(documents: string[]): TSearchQueryGroup {
  return {
    op: "or",
    filters: documents.map((documentId) => ({ field: "document_id", op: "contains", value: documentId })),
  };
}

export async function fetchSearchPassages({
  query,
  documents,
  pageSize,
  pageToken,
  signal,
}: ISearchPassagesParams): Promise<ISearchPassagesResponse> {
  const url = new URL(searchPassagesUrl());

  url.searchParams.set("query", query);
  url.searchParams.set("filters", JSON.stringify(configurePassagesFilters(documents)));
  if (pageSize !== undefined) url.searchParams.set("page_size", String(pageSize));
  if (pageToken !== undefined) url.searchParams.set("page_token", String(pageToken));

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Passage search API error: ${res.status}`);
  return res.json() as Promise<ISearchPassagesResponse>;
}
