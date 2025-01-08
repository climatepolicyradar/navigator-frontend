import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Instructions from "@cclw/components/Instructions";

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

describe("Instructions: ", () => {
  it("displays the correct aggregated statistics for the number of documents available per category", () => {
    render(<Instructions />);

    expect(screen.getByRole("link", { name: "2 laws" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3 policies" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "4 UNFCCC submissions" })).toBeInTheDocument();
  });
});
