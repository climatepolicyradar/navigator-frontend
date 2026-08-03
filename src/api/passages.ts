// Passage search against the v2 API. Mirrors the conventions in `./search.ts`:
// native fetch, `NEXT_PUBLIC_API_URL` with a public fallback, and throwing on a
// non-2xx so react-query can surface the error.

import { TSearchQueryGroup } from "@/types";

export interface IPassageBoundingBox {
  coordinates: { x: number; y: number }[];
}

export interface IPassagePageWithBoundingBoxes {
  number: number;
  bounding_boxes: IPassageBoundingBox[];
}

export interface ISearchPassage {
  id: string;
  text_block_id: string;
  idx: number;
  text: string;
  language: string | null;
  type: string;
  type_confidence: number;
  page_number: number;
  pages: number[];
  pages_with_bounding_boxes: IPassagePageWithBoundingBoxes[];
  concepts: unknown[];
  heading_id: string | null;
  heading_text: string | null;
  document_id: string;
  principal_id: string;
  tokens: string[];
}

export interface ISearchPassagesResponse {
  took_ms: number | null;
  total_size: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: ISearchPassage[];
}

interface ISearchPassagesParams {
  query: string;
  documents: string[];
  pageSize?: number;
  // 1-indexed page number. The API's `page` parameter is currently ignored, and its
  // `next_page` / `total_pages` fields come back null, so callers page by incrementing
  // this and comparing the running result count against `total_size`.
  pageToken?: number;
  signal?: AbortSignal;
}

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
