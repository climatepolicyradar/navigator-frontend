// Passage search against the v2 API. Mirrors the conventions in `./search.ts`:
// native fetch, `NEXT_PUBLIC_API_URL` with a public fallback, and throwing on a
// non-2xx so react-query can surface the error.

export interface PassageBoundingBox {
  coordinates: { x: number; y: number }[];
}

export interface PassagePageWithBoundingBoxes {
  number: number;
  bounding_boxes: PassageBoundingBox[];
}

export interface SearchPassage {
  id: string;
  text_block_id: string;
  idx: number;
  text: string;
  language: string | null;
  type: string;
  type_confidence: number;
  page_number: number;
  pages: number[];
  pages_with_bounding_boxes: PassagePageWithBoundingBoxes[];
  concepts: unknown[];
  heading_id: string | null;
  heading_text: string | null;
  document_id: string;
  principal_id: string;
  tokens: string[];
}

export interface SearchPassagesResponse {
  took_ms: number | null;
  total_size: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: SearchPassage[];
}

// The passages endpoint has its own field vocabulary (`document_id` today, topics to
// follow), so it cannot reuse TSearchQueryGroup, whose fields are typed to the
// documents endpoint.
interface IPassageFilterRule {
  field: "document_id";
  op: "contains";
  value: string;
}

interface IPassageFilterGroup {
  op: "and" | "or";
  filters: (IPassageFilterGroup | IPassageFilterRule)[];
}

interface SearchPassagesParams {
  query: string;
  documentId: string;
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

// Passage search is always scoped to a single document.
function configurePassagesFilters(documentId: string): IPassageFilterGroup {
  return {
    op: "and",
    filters: [{ field: "document_id", op: "contains", value: documentId }],
  };
}

export async function fetchSearchPassages({ query, documentId, pageSize, pageToken, signal }: SearchPassagesParams): Promise<SearchPassagesResponse> {
  const url = new URL(searchPassagesUrl());

  url.searchParams.set("query", query);
  url.searchParams.set("filters", JSON.stringify(configurePassagesFilters(documentId)));
  if (pageSize !== undefined) url.searchParams.set("page_size", String(pageSize));
  if (pageToken !== undefined) url.searchParams.set("page_token", String(pageToken));

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Passage search API error: ${res.status}`);
  return res.json() as Promise<SearchPassagesResponse>;
}
