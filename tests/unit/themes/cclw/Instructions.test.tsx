import { screen } from "@testing-library/react";
import { renderWithContext } from "tests/mocks/renderWithContext";

import Instructions from "@/cclw/components/Instructions";

describe("Instructions: ", () => {
  it("displays the correct aggregated statistics for the number of documents available per category", async () => {
    renderWithContext(Instructions);
    expect(await screen.findByRole("link", { name: "2 laws" })).toBeDefined();
    expect(screen.getByRole("link", { name: "3 policies" })).toBeDefined();
    expect(screen.getByRole("link", { name: "4 UNFCCC submissions" })).toBeDefined();
  });
});
