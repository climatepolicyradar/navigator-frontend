import preloadAll from "jest-next-dynamic";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Hero } from "@cclw/components/Hero";

const mockHandleSearchInput = jest.fn();
const mockSearchInput = "mockSearchInput";

jest.mock("next/router", () => ({
  useRouter() {
    return { asPath: "", query: "" };
  },
}));

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: {
      organisations: {
        org1: {
          total: 2,
          count_by_category: {
            Executive: 1,
            Legislative: 1,
            UNFCCC: 1,
            MCF: 0,
          },
        },
        org2: {
          total: 2,
          count_by_category: {
            Executive: 2,
            Legislative: 1,
            UNFCCC: 3,
            MCF: 0,
          },
        },
      },
    },
    isLoading: false,
    error: null,
  })),
}));

beforeAll(async () => {
  await preloadAll();
});

describe("Hero: ", () => {
  it("displays the correct aggregated statistics for the number of documents available per category", () => {
    render(<Hero handleSearchInput={mockHandleSearchInput} searchInput={mockSearchInput} />);

    expect(screen.getByRole("heading", { level: 1, name: "Climate Change Laws of the World" }));
    expect(screen.queryByText("Loading document stats...")).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: "2 laws" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3 policies" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "4 UNFCCC submissions" })).toBeInTheDocument();
  });
});
