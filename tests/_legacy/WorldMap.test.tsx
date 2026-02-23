import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import WorldMap from "@/components/map/WorldMap";
import { DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { FeatureFlagsContext } from "@/context/FeatureFlagsContext";
import { ThemeContext } from "@/context/ThemeContext";
import { TTheme } from "@/types";

// Mock the hooks
vi.mock("@/hooks/useConfig", () => ({
  default: () => ({
    data: {
      countries: [
        {
          value: "GBR",
          slug: "united-kingdom",
          display_value: "United Kingdom",
        },
        {
          value: "FRA",
          slug: "france",
          display_value: "France",
        },
        {
          value: "DEU",
          slug: "germany",
          display_value: "Germany",
        },
        {
          value: "EUR",
          slug: "european-union",
          display_value: "European Union",
        },
      ],
    },
  }),
}));

vi.mock("@/hooks/useGeographies", () => ({
  default: () => ({
    data: [
      {
        slug: "united-kingdom",
        iso_code: "GBR",
        family_counts: {
          EXECUTIVE: 5,
          LEGISLATIVE: 3,
          UNFCCC: 2,
          MCF: 1,
          REPORTS: 4,
          LITIGATION: 0,
        },
      },
      {
        slug: "france",
        iso_code: "FRA",
        family_counts: {
          EXECUTIVE: 4,
          LEGISLATIVE: 2,
          UNFCCC: 1,
          MCF: 0,
          REPORTS: 3,
          LITIGATION: 1,
        },
      },
      {
        slug: "germany",
        iso_code: "DEU",
        family_counts: {
          EXECUTIVE: 6,
          LEGISLATIVE: 4,
          UNFCCC: 3,
          MCF: 2,
          REPORTS: 5,
          LITIGATION: 2,
        },
      },
      {
        slug: "european-union",
        iso_code: "EUR",
        family_counts: {
          EXECUTIVE: 15,
          LEGISLATIVE: 9,
          UNFCCC: 6,
          MCF: 3,
          REPORTS: 12,
          LITIGATION: 3,
        },
      },
    ],
    status: "success",
  }),
}));

vi.mock("@/hooks/useMcfData", () => ({
  useMcfData: () => false,
}));

const theme: TTheme = "ccc";

const renderWorldMap = (props: { showLitigation?: boolean; showCategorySelect?: boolean; showEUCheckbox?: boolean; theme: TTheme }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: props.theme, themeConfig: DEFAULT_THEME_CONFIG, loaded: true }}>
        <FeatureFlagsContext.Provider value={DEFAULT_FEATURE_FLAGS}>
          <WorldMap {...props} />
        </FeatureFlagsContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};

describe("WorldMap", () => {
  describe("EU Checkbox visibility", () => {
    it("should hide EU checkbox when showEUCheckbox is false", () => {
      renderWorldMap({
        showLitigation: false,
        showCategorySelect: true,
        showEUCheckbox: false,
        theme: theme,
      });

      const euCheckbox = screen.queryByLabelText("Show aggregated EU data");
      expect(euCheckbox).not.toBeInTheDocument();
    });

    it("should show EU checkbox when showEUCheckbox is true", () => {
      renderWorldMap({
        showLitigation: false,
        showCategorySelect: true,
        showEUCheckbox: true,
        theme: theme,
      });

      const euCheckbox = screen.getByLabelText("Show aggregated EU data");
      expect(euCheckbox).toBeInTheDocument();
    });

    it("should hide EU checkbox by default when showEUCheckbox is not specified", () => {
      renderWorldMap({
        showLitigation: false,
        showCategorySelect: true,
        theme: theme,
      });

      const euCheckbox = screen.queryByLabelText("Show aggregated EU data");
      expect(euCheckbox).not.toBeInTheDocument();
    });
  });
});
