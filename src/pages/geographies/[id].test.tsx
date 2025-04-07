import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import CountryPage from "./[id]";

vi.mock("next/router", () => ({
  useRouter: () => {
    return {
      route: "/geographies/[id]",
      pathname: "/geographies/united-states-of-america",
      query: {
        id: "united-states-of-america",
      },
      asPath: "/geographies/united-states-of-america",
    };
  },
}));

vi.mock("react-query", () => ({
  useQuery: vi.fn(() => ({
    data: {},
    isLoading: false,
    error: null,
  })),
}));

vi.mock("next/dynamic", () => {
  return { default: () => "cpr" };
});

describe("CountryPage", () => {
  it("displays alert with Sabin tracker link on us geography page", async () => {
    const usa_props = {
      geography: { name: "United States of America", geography_slug: "united-states-of-america", legislative_process: "", political_groups: "" },
      summary: { family_counts: [] },
      targets: [],
      theme: "cpr",
      themeConfig: {
        documentCategories: ["All"],
        metadata: [
          {
            key: "geography",
            title: "{text} climate laws and policies",
          },
        ],
      },
    };

    // @ts-ignore
    render(<CountryPage {...usa_props} />);
    expect(screen.getByRole("heading", { name: "United States of America", level: 1 })).toBeDefined();
    expect(screen.getByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).toBeDefined();

    let link = screen.getByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link.getAttribute("href")).toBe("https://climate.law.columbia.edu/content/climate-backtracker");
  });
});
