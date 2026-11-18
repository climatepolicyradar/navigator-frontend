import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { EnvConfigContext } from "@/context/EnvConfig";
import { ThemeContext } from "@/context/ThemeContext";
import { envConfig } from "@/mocks/envConfig";
import { ISearchDocument, ISearchDocumentsResponse } from "@/types";

import useGetLatest, { toLatestItems } from "./useGetLatest";

const mockFetchSearchPrincipalDocuments = vi.hoisted(() => vi.fn());
vi.mock("@/api/search", () => ({
  fetchSearchPrincipalDocuments: mockFetchSearchPrincipalDocuments,
}));

const searchDocument = (attributes: ISearchDocument["attributes"]): ISearchDocument => ({
  id: "CCC.document.1.0",
  title: "Smith v. State",
  description: null,
  labels: [],
  documents: [],
  items: [],
  attributes,
});

const renderUseGetLatest = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <EnvConfigContext.Provider value={envConfig}>
        <ThemeContext.Provider value={{ theme: "ccc", themeConfig: DEFAULT_THEME_CONFIG, loaded: true }}>{children}</ThemeContext.Provider>
      </EnvConfigContext.Provider>
    </QueryClientProvider>
  );
  return renderHook(() => useGetLatest(3), { wrapper });
};

describe("useGetLatest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the most recently added principals from the search API", async () => {
    mockFetchSearchPrincipalDocuments.mockResolvedValue({
      results: [searchDocument({ deprecated_slug: "smith-v-state_1a2b", created: "2023-02-03T04:05:06.789000" })],
    } as ISearchDocumentsResponse);

    const { result } = renderUseGetLatest();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchSearchPrincipalDocuments).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: "attributes.created_at desc", page_size: "3" })
    );
    expect(result.current.data?.map((item) => item.slug)).toEqual(["smith-v-state_1a2b"]);
  });
});

describe("toLatestItems", () => {
  it("maps a search API document to a latest item linking to its document page", () => {
    const [item] = toLatestItems([searchDocument({ deprecated_slug: "smith-v-state_1a2b", created: "2023-02-03T04:05:06.789000" })]);

    expect(item).toEqual({
      title: "Smith v. State",
      slug: "smith-v-state_1a2b",
      date: "2023-02-03T04:05:06.789000",
      url: "/document/smith-v-state_1a2b",
    });
  });

  it("keeps the order the search API returned", () => {
    const items = toLatestItems([
      searchDocument({ deprecated_slug: "newest", created: "2024-01-02T00:00:00Z" }),
      searchDocument({ deprecated_slug: "older", created: "2024-01-01T00:00:00Z" }),
    ]);

    expect(items.map((item) => item.slug)).toEqual(["newest", "older"]);
  });
});
