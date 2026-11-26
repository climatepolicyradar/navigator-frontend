import { screen } from "@testing-library/react";

import Instructions from "@/cclw/components/Instructions";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import { TNestedSearchLabel } from "@/types";

const mockLoadTaxonomy = vi.hoisted(() => vi.fn());
vi.mock("@/api/taxonomy", () => ({ loadTaxonomy: mockLoadTaxonomy }));

const category = (value: string, count: number): TNestedSearchLabel => ({
  id: `category::${value}`,
  type: "category",
  value,
  alternative_labels: [],
  count,
  children: [],
});

describe("Instructions: ", () => {
  it("displays the number of principal documents available per category, rounded down to the nearest hundred", async () => {
    mockLoadTaxonomy.mockResolvedValue([category("Law", 2176), category("Policy", 5298), category("UN submission", 2712)]);

    renderWithAppContext(Instructions, { pageProps: { envConfig: { API_URL: "https://api.example.test" } } });

    expect(await screen.findByRole("link", { name: "2100+ laws" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "5200+ policies" })).toBeInTheDocument();
  });
});
