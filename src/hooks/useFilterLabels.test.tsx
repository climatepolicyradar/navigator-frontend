import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { DEFAULT_FEATURES } from "@/constants/features";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { EnvConfigContext } from "@/context/EnvConfig";
import { TFeatures, TSearchLabel, TThemeConfig } from "@/types";

import { useFilterLabels } from "./useFilterLabels";

const mockLoadFilteredLabels = vi.hoisted(() => vi.fn());
const mockLoadLabelTaxonomy = vi.hoisted(() => vi.fn());
const mockLoadGeographyTaxonomy = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useLabelSearch", () => ({
  loadFilteredLabels: mockLoadFilteredLabels,
  loadLabelTaxonomy: mockLoadLabelTaxonomy,
  loadGeographyTaxonomy: mockLoadGeographyTaxonomy,
}));

const label = (id: string): TSearchLabel => ({ id }) as TSearchLabel;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  // @ts-expect-error - partial EnvConfig value is fine for this test
  <EnvConfigContext.Provider value={{}}>{children}</EnvConfigContext.Provider>
);

const renderUseFilterLabels = (features: TFeatures, themeConfig: TThemeConfig) =>
  renderHook(() => useFilterLabels({ features, themeConfig }), { wrapper });

describe("useFilterLabels", () => {
  beforeEach(() => {
    mockLoadFilteredLabels.mockReset().mockResolvedValue([]);
    mockLoadLabelTaxonomy.mockReset().mockResolvedValue([]);
    mockLoadGeographyTaxonomy.mockReset().mockResolvedValue([]);
  });

  it("always requests concept and author labels for the sidebar", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);

    await waitFor(() => expect(mockLoadFilteredLabels).toHaveBeenCalled());

    expect(mockLoadFilteredLabels.mock.calls[0][1]).toEqual({
      op: "or",
      filters: [
        { field: "type", op: "contains", value: "concept" },
        { field: "type", op: "contains", value: "author" },
      ],
    });
  });

  it("requests the region and country geography taxonomy by default", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);

    await waitFor(() => expect(mockLoadGeographyTaxonomy).toHaveBeenCalled());

    expect(mockLoadGeographyTaxonomy.mock.calls[0][1]).toEqual(["region", "country"]);
  });

  it("additionally requests subdivision geography taxonomy when the subdivisions feature is on", async () => {
    renderUseFilterLabels({ ...DEFAULT_FEATURES, subdivisions: true }, DEFAULT_THEME_CONFIG);

    await waitFor(() => expect(mockLoadGeographyTaxonomy).toHaveBeenCalled());

    expect(mockLoadGeographyTaxonomy.mock.calls[0][1]).toEqual(["region", "country", "subdivision"]);
  });

  it("additionally requests litigation label types for themes with the Litigation search category", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, { ...DEFAULT_THEME_CONFIG, searchCategories: ["Litigation"] });

    await waitFor(() => expect(mockLoadFilteredLabels).toHaveBeenCalled());

    expect(mockLoadFilteredLabels.mock.calls[0][1].filters).toEqual(
      expect.arrayContaining([
        { field: "type", op: "contains", value: "jurisdiction" },
        { field: "type", op: "contains", value: "case_category" },
        { field: "type", op: "contains", value: "principal_law" },
      ])
    );
  });

  it("excludes configured searchExcludeLabels from the filter query", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, { ...DEFAULT_THEME_CONFIG, searchExcludeLabels: ["author_type::Non-Party"] });

    await waitFor(() => expect(mockLoadFilteredLabels).toHaveBeenCalled());

    expect(mockLoadFilteredLabels.mock.calls[0][1]).toEqual({
      op: "and",
      filters: [
        {
          op: "or",
          filters: [
            { field: "type", op: "contains", value: "concept" },
            { field: "type", op: "contains", value: "author" },
          ],
        },
        { field: "id", op: "not_contains", value: "author_type::Non-Party" },
      ],
    });
  });

  it("combines the filtered labels with the label taxonomy", async () => {
    mockLoadFilteredLabels.mockResolvedValue([label("concept::Q1")]);
    mockLoadLabelTaxonomy.mockResolvedValue([label("category::Law")]);

    const { result } = renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);

    await waitFor(() => expect(result.current.filters).toEqual([label("concept::Q1"), label("category::Law")]));
  });

  it("is not loaded until all filter labels have resolved", async () => {
    let resolveGeographyTaxonomy: (labels: TSearchLabel[]) => void = () => {};
    mockLoadGeographyTaxonomy.mockReturnValue(new Promise((resolve) => (resolveGeographyTaxonomy = resolve)));

    const { result } = renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);

    expect(result.current.loaded).toBe(false);

    resolveGeographyTaxonomy([label("geography::GBR")]);

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.filters).toEqual([label("geography::GBR")]);
  });
});
