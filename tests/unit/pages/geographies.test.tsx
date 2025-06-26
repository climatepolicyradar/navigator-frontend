import { render, screen } from "@testing-library/react";

import CountryPage from "../../../src/pages/geographies/[id]";

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

vi.mock("react", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useContext: () => ({
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
    }),
  };
});

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
  it.each(["cpr", "cclw"])("displays alert with Sabin tracker link on us geography page for %s", async (theme) => {
    const usa_props = {
      geography: { name: "United States of America", geography_slug: "united-states-of-america", legislative_process: "", political_groups: "" },
      summary: { family_counts: [] },
      targets: [],
      theme: theme,
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

    const link = screen.getByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link.getAttribute("href")).toBe("https://climate.law.columbia.edu/content/climate-backtracker");
  });

  it.each(["cpr", "cclw"])("does not display alert with Sabin tracker link on non-us geography pages for %s", async (theme) => {
    const props = {
      geography: { name: "Brazil", geography_slug: "brazil", legislative_process: "", political_groups: "" },
      summary: { family_counts: [] },
      targets: [],
      theme: theme,
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
    render(<CountryPage {...props} />);
    expect(screen.getByRole("heading", { name: "Brazil", level: 1 })).toBeDefined();
    expect(screen.queryByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).toBeNull();

    const link = screen.queryByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link).toBeNull();
  });

  it("does not display alert with Sabin tracker link on the mcf theme", async () => {
    const usa_props = {
      geography: { name: "United States of America", geography_slug: "united-states-of-america", legislative_process: "", political_groups: "" },
      summary: { family_counts: [] },
      targets: [],
      theme: "mcf",
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
    expect(screen.queryByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).toBeNull();

    const link = screen.queryByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link).toBeNull();
  });
});
