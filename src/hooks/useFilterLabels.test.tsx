import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { configureDocumentsFilters } from "@/api/search";
import { DEFAULT_FEATURES } from "@/constants/features";
import { SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { EnvConfigContext } from "@/context/EnvConfig";
import { TFeatures, TNestedSearchLabel, TThemeConfig } from "@/types";

import { useFilterLabels } from "./useFilterLabels";

const mockLoadTaxonomy = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useLabelSearch", () => ({ loadTaxonomy: mockLoadTaxonomy }));

const label = (id: string, count = 1, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id,
  type: id.split("::")[0],
  value: id.split("::")[1],
  alternative_labels: [],
  count,
  children,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  // @ts-expect-error - partial EnvConfig value is fine for this test
  <EnvConfigContext.Provider value={{}}>{children}</EnvConfigContext.Provider>
);

const renderUseFilterLabels = (features: TFeatures, themeConfig: TThemeConfig) =>
  renderHook(() => useFilterLabels({ features, themeConfig }), { wrapper });

describe("useFilterLabels", () => {
  beforeEach(() => {
    mockLoadTaxonomy.mockReset().mockResolvedValue([]);
  });

  it("asks for the label trees the theme configures", async () => {
    const searchLabelPatterns = ["domain::*", "category::Law/**"];
    renderUseFilterLabels(DEFAULT_FEATURES, { ...DEFAULT_THEME_CONFIG, searchLabelPatterns });
    await waitFor(() => expect(mockLoadTaxonomy).toHaveBeenCalled());
    expect(mockLoadTaxonomy.mock.calls[0][1].patterns).toEqual(searchLabelPatterns);
  });

  it("asks for the level below a country only where subdivisions are offered", async () => {
    const searchLabelPatterns = ["region::*/country::*"];
    renderUseFilterLabels({ ...DEFAULT_FEATURES, subdivisions: true }, { ...DEFAULT_THEME_CONFIG, searchLabelPatterns });
    await waitFor(() => expect(mockLoadTaxonomy).toHaveBeenCalled());
    expect(mockLoadTaxonomy.mock.calls[0][1].patterns).toEqual([...searchLabelPatterns, SUBDIVISION_LABEL_PATTERN]);
  });

  it("counts against the documents a search of this app would return", async () => {
    const themeConfig = { ...DEFAULT_THEME_CONFIG, searchCategories: ["Law" as const], searchExcludeLabels: ["author_type::Non-Party"] };
    renderUseFilterLabels(DEFAULT_FEATURES, themeConfig);
    await waitFor(() => expect(mockLoadTaxonomy).toHaveBeenCalled());
    expect(mockLoadTaxonomy.mock.calls[0][1].filters).toEqual(
      configureDocumentsFilters(undefined, themeConfig.searchCategories, themeConfig.searchExcludeLabels)
    );
  });

  it("drops labels no document in this app carries", async () => {
    mockLoadTaxonomy.mockResolvedValue([label("concept::Q1", 4), label("concept::Q2", 0)]);
    const { result } = renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.filters.map((filter) => filter.id)).toEqual(["concept::Q1"]);
  });

  it("is not loaded until the taxonomy has resolved", async () => {
    let resolveTaxonomy: (labels: TNestedSearchLabel[]) => void = () => {};
    mockLoadTaxonomy.mockReturnValue(new Promise((resolve) => (resolveTaxonomy = resolve)));
    const { result } = renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);
    expect(result.current.loaded).toBe(false);
    resolveTaxonomy([label("concept::Q1", 2)]);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.filters).toEqual([label("concept::Q1", 2)]);
  });
});
