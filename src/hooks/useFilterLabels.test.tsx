import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { configureDocumentsFilters } from "@/api/search";
import { DEFAULT_FEATURES } from "@/constants/features";
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

  it("requests the subtrees the filter groups are rooted on", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);
    await waitFor(() => expect(mockLoadTaxonomy).toHaveBeenCalled());
    expect(mockLoadTaxonomy.mock.calls[0][1].types).toEqual(["domain", "region", "concept"]);
  });

  it("asks for the theme's categories by id rather than for every category", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, { ...DEFAULT_THEME_CONFIG, searchCategories: ["Law", "Policy"] });
    await waitFor(() => expect(mockLoadTaxonomy).toHaveBeenCalled());
    expect(mockLoadTaxonomy.mock.calls[0][1].ids).toEqual(["category::Law", "category::Policy"]);
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

  it("drops subdivisions when the subdivisions feature is off", async () => {
    mockLoadTaxonomy.mockResolvedValue([label("region::ECS", 0, [label("country::AUT", 2, [label("subdivision::AT-3", 1)])])]);
    const { result } = renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.filters[0].children[0].children).toEqual([]);
  });

  it("drops a country whose only documents are held by hidden subdivisions", async () => {
    mockLoadTaxonomy.mockResolvedValue([
      label("region::ECS", 0, [label("country::AUT", 0, [label("subdivision::AT-3", 7)])]),
      label("concept::Q1", 3),
    ]);
    const { result } = renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.filters.map((filter) => filter.id)).toEqual(["concept::Q1"]);
  });

  it("keeps subdivisions when the subdivisions feature is on", async () => {
    mockLoadTaxonomy.mockResolvedValue([label("region::ECS", 0, [label("country::AUT", 2, [label("subdivision::AT-3", 1)])])]);
    const { result } = renderUseFilterLabels({ ...DEFAULT_FEATURES, subdivisions: true }, DEFAULT_THEME_CONFIG);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.filters[0].children[0].children.map((child) => child.id)).toEqual(["subdivision::AT-3"]);
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
