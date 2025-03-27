import { render, screen } from "@testing-library/react";

import Instructions from "@/cclw/components/Instructions";

vi.mock("react-query", () => ({
  useQuery: vi.fn(() => ({
    data: {
      corpus_types: {
        corpus_type1: {
          corpora: [
            {
              total: 2,
              count_by_category: {
                Executive: 1,
                Legislative: 1,
                UNFCCC: 1,
                MCF: 0,
              },
            },
          ],
        },
        corpus_type2: {
          corpora: [
            {
              total: 2,
              count_by_category: {
                Executive: 2,
                Legislative: 1,
                UNFCCC: 3,
                MCF: 0,
              },
            },
          ],
        },
      },
    },
    isLoading: false,
    error: null,
  })),
}));

describe("Instructions: ", () => {
  it("displays the correct aggregated statistics for the number of documents available per category", () => {
    render(<Instructions />);
    expect(screen.getByRole("link", { name: "2 laws" })).toBeDefined();
    expect(screen.getByRole("link", { name: "3 policies" })).toBeDefined();
    expect(screen.getByRole("link", { name: "4 UNFCCC submissions" })).toBeDefined();
  });
});
