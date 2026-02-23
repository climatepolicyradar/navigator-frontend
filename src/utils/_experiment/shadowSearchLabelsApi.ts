/**
 * GET /search/labels – label search for shadow search filter options.
 * API requires query (min 1 char); matches on label title prefix in the index.
 * Use label.title when building /search/documents filters (index uses labels_title_attribute).
 */

export interface ISearchApiLabel {
  id: string;
  title: string;
  type: string;
}

export interface ISearchApiLabelsResponse {
  total_results: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: ISearchApiLabel[];
}

/**
 * Fetch labels from the search API (GET /search/labels).
 * Query is required (min length 1); results are prefix-matched on label title.
 *
 * @param baseUrl - Base URL for the concepts/search API (e.g. CONCEPTS_API_URL)
 * @param query - Search string; must have at least one character
 * @returns Labels returned by the API
 */
export async function fetchSearchLabels(baseUrl: string, query: string): Promise<ISearchApiLabelsResponse> {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return { total_results: 0, page: 0, page_size: 0, total_pages: 0, next_page: null, previous_page: null, results: [] };
  }
  const searchParams = new URLSearchParams({ query: trimmed });
  const url = `${baseUrl.replace(/\/$/, "")}/search/labels?${searchParams.toString()}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Search labels API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<ISearchApiLabelsResponse>;
}
