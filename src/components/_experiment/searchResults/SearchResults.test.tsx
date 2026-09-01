import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

// `vi.mock` is hoisted above the file, so the factory cannot reach `emptyResponse` below.
vi.mock("@/api/search", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/api/search")>();
  return {
    ...mod,
    fetchSearchDocuments: vi.fn().mockResolvedValue({
      results: [],
      total_size: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
      next_page: null,
      previous_page: null,
    }),
  };
});

const emptyResponse: SearchDocumentsResponse = {
  results: [],
  total_size: 0,
  page: 1,
  page_size: 10,
  total_pages: 0,
  next_page: null,
  previous_page: null,
};

import { fetchSearchDocuments, SearchDocumentsResponse } from "@/api/search";
import { createGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { upsertPublishedDateRangeRules } from "@/utils/_experiment/dateRangeFilters";

import { SearchContainer, shouldRetrySearch } from "./SearchResults";

const searchError = (status: number) => Object.assign(new Error(`Search API error: ${status}`), { status });

// The queries set their own retry policy, so the client only supplies a provider.
const renderWith = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  const result = render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  return {
    ...result,
    rerenderWith: (next: React.ReactElement) => result.rerender(<QueryClientProvider client={queryClient}>{next}</QueryClientProvider>),
  };
};

describe("SearchContainer", () => {
  afterEach(() => vi.clearAllMocks());

  it("triggers a search when only a date filter is applied with no text query or other filters", async () => {
    const filtersWithDate = upsertPublishedDateRangeRules(createGroup(), "2020:2025");

    renderWith(<SearchContainer filters={filtersWithDate} />);

    await waitFor(() => expect(fetchSearchDocuments).toHaveBeenCalled());
  });

  it("shows a filter-specific message in the page when the request URL is too long, and clears the result count", async () => {
    vi.mocked(fetchSearchDocuments).mockRejectedValueOnce(searchError(414));
    const onTotalResultsChange = vi.fn();

    renderWith(<SearchContainer query="climate" onTotalResultsChange={onTotalResultsChange} />);

    expect(await screen.findByText(/too many filters/i)).toBeInTheDocument();
    expect(onTotalResultsChange).toHaveBeenCalledWith(null);
    // The message replaces the results rather than the app error page taking over.
    expect(screen.queryByTestId("search-loading")).not.toBeInTheDocument();
  });

  it("shows a generic message in the page for other search failures", async () => {
    vi.mocked(fetchSearchDocuments).mockRejectedValueOnce(searchError(404));

    renderWith(<SearchContainer query="climate" />);

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("shows the loader on a first search, in place of any results", async () => {
    vi.mocked(fetchSearchDocuments).mockReturnValueOnce(new Promise(() => {}));
    const onSearchingChange = vi.fn();

    renderWith(<SearchContainer query="climate" onSearchingChange={onSearchingChange} />);

    expect(await screen.findByTestId("search-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("search-results")).not.toBeInTheDocument();
    expect(onSearchingChange).toHaveBeenLastCalledWith(true);
  });

  it("replaces the previous results with the loader while the next page loads", async () => {
    vi.mocked(fetchSearchDocuments).mockResolvedValueOnce({ ...emptyResponse, total_size: 42 });
    const onTotalResultsChange = vi.fn();
    const onSearchingChange = vi.fn();

    const props = { query: "climate", onTotalResultsChange, onSearchingChange };
    const { rerenderWith } = renderWith(<SearchContainer {...props} page_token="1" />);
    await waitFor(() => expect(screen.getByTestId("search-results")).toBeInTheDocument());
    expect(onSearchingChange).toHaveBeenLastCalledWith(false);

    // A second page that never settles, so the component stays mid-fetch.
    vi.mocked(fetchSearchDocuments).mockReturnValueOnce(new Promise(() => {}));
    rerenderWith(<SearchContainer {...props} page_token="2" />);

    expect(await screen.findByTestId("search-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("search-results")).not.toBeInTheDocument();
    // The header drops the count and says "Searching…" instead, so it must not linger.
    expect(onTotalResultsChange).toHaveBeenLastCalledWith(null);
    expect(onSearchingChange).toHaveBeenLastCalledWith(true);
  });

  describe("shouldRetrySearch", () => {
    it("does not retry a client error the user has to act on", () => {
      expect(shouldRetrySearch(0, searchError(414))).toBe(false);
      expect(shouldRetrySearch(0, searchError(404))).toBe(false);
    });

    it("retries a server error and a status-less network failure up to three times", () => {
      expect(shouldRetrySearch(0, searchError(500))).toBe(true);
      expect(shouldRetrySearch(0, new TypeError("Failed to fetch"))).toBe(true);
      expect(shouldRetrySearch(3, searchError(500))).toBe(false);
    });
  });
});
