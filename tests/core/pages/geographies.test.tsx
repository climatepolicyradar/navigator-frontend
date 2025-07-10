import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";

import CountryPage from "../../../src/pages/geographies/[id]";

// this mock is needed for any tests of pages that use dynamic imports
vi.mock("next/dynamic", () => ({
  default: () => {
    // Return a dummy component
    return function DummyComponent({ children }) {
      return <div>{children}</div>;
    };
  },
}));

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
    renderWithAppContext(CountryPage, usa_props);
    expect(screen.getByRole("heading", { name: "United States of America", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).toBeInTheDocument();

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
    renderWithAppContext(CountryPage, props);
    expect(screen.getByRole("heading", { name: "Brazil", level: 1 })).toBeInTheDocument();
    expect(screen.queryByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).not.toBeInTheDocument();

    const link = screen.queryByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link).not.toBeInTheDocument();
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
    renderWithAppContext(CountryPage, usa_props);
    expect(screen.getByRole("heading", { name: "United States of America", level: 1 })).toBeInTheDocument();
    expect(screen.queryByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).not.toBeInTheDocument();

    const link = screen.queryByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link).not.toBeInTheDocument();
  });
});
