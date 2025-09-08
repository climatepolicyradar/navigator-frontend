import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { backendApiSearchHandler } from "@/mocks/api/backendApiHandlers";
import { configHandlers } from "@/mocks/api/configHandlers";
import { envConfig } from "@/mocks/envConfig";
import brazil from "@/mocks/geographies-api/brazil";
import unitedStates from "@/mocks/geographies-api/united-states";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import { testHandler } from "@/pages/api/geography-counts.test";

import CountryPage from "../../../src/pages/geographies/[id]";

const featureFlags = { ...DEFAULT_FEATURE_FLAGS };

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
      geographyV2: unitedStates,
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
        features: { litigation: false },
      },
      featureFlags: featureFlags,
      envConfig,
    };

    // @ts-ignore
    renderWithAppContext(CountryPage, usa_props);
    expect(screen.getByRole("heading", { name: "United States", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link.getAttribute("href")).toBe("https://climate.law.columbia.edu/content/climate-backtracker");
  });

  it.each(["cpr", "cclw"])("does not display alert with Sabin tracker link on non-us geography pages for %s", async (theme) => {
    const props = {
      geographyV2: brazil,
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
        features: { litigation: false },
      },
      featureFlags: featureFlags,
      envConfig,
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
      geographyV2: unitedStates,
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
        features: { litigation: false },
      },
      featureFlags: featureFlags,
      envConfig,
    };

    // @ts-ignore
    renderWithAppContext(CountryPage, usa_props);
    expect(screen.getByRole("heading", { name: "United States", level: 1 })).toBeInTheDocument();
    expect(screen.queryByText(/To see developments in the Trump-Vance administration's climate rollback, visit the/)).not.toBeInTheDocument();

    const link = screen.queryByRole("link", { name: "Sabin Center's Climate Backtracker" });
    expect(link).not.toBeInTheDocument();
  });
});
