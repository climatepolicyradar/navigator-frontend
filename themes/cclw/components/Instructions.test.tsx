import { screen } from "@testing-library/react";

import Instructions from "@/cclw/components/Instructions";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";

describe("Instructions: ", () => {
  it("displays the correct aggregated statistics for the number of documents available per category", async () => {
    renderWithAppContext(Instructions, {});
    expect(await screen.findByRole("link", { name: "2 laws" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3 policies" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "4 UNFCCC submissions" })).toBeInTheDocument();
  });
});
