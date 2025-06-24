import { screen } from "@testing-library/react";

import { renderWithQueryClient } from "tests/mocks/renderWithQueryClient";

import Instructions from "@/cclw/components/Instructions";

describe("Instructions: ", () => {
  it("displays the correct aggregated statistics for the number of documents available per category", () => {
    renderWithQueryClient(<Instructions />);
    expect(screen.getByRole("link", { name: "2 laws" })).toBeDefined();
    expect(screen.getByRole("link", { name: "3 policies" })).toBeDefined();
    expect(screen.getByRole("link", { name: "4 UNFCCC submissions" })).toBeDefined();
  });
});
