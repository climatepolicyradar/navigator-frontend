import { render } from "@testing-library/react";
import { Suspense } from "react";
import { vi } from "vitest";

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

import { fetchSearchDocuments } from "@/api/search";
import { createGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { upsertPublishedDateRangeRules } from "@/utils/_experiment/dateRangeFilters";

import { SearchContainer } from "./SearchResults";

describe("SearchContainer", () => {
  afterEach(() => vi.clearAllMocks());

  it("triggers a search when only a date filter is applied with no text query", () => {
    const filtersWithDate = upsertPublishedDateRangeRules(createGroup(), "2020:2025");

    render(
      <Suspense fallback={null}>
        <SearchContainer filters={filtersWithDate} />
      </Suspense>
    );

    expect(fetchSearchDocuments).toHaveBeenCalled();
  });
});
