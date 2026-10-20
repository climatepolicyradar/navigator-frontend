import { renderHook, waitFor } from "@testing-library/react";

import { DEFAULT_FEATURES } from "@/constants/features";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TFeatures, TSearchLabel, TThemeConfig } from "@/types";

import { useFilterLabels } from "./useFilterLabels";

const mockLoadFilteredLabels = vi.hoisted(() => vi.fn());
const mockLoadLabelTaxonomy = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useLabelSearch", () => ({
  loadFilteredLabels: mockLoadFilteredLabels,
  loadLabelTaxonomy: mockLoadLabelTaxonomy,
}));

const label = (id: string): TSearchLabel => ({ id }) as TSearchLabel;

const renderUseFilterLabels = (features: TFeatures, themeConfig: TThemeConfig) => renderHook(() => useFilterLabels({ features, themeConfig }));

describe("useFilterLabels", () => {
  beforeEach(() => {
    mockLoadFilteredLabels.mockReset().mockResolvedValue([]);
    mockLoadLabelTaxonomy.mockReset().mockResolvedValue([]);
  });

  it("always requests concept, region, country and author labels for the sidebar", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);

    await waitFor(() => expect(mockLoadFilteredLabels).toHaveBeenCalled());

    expect(mockLoadFilteredLabels.mock.calls[0][0]).toEqual({
      op: "or",
      filters: [
        { field: "type", op: "contains", value: "concept" },
        { field: "type", op: "contains", value: "region" },
        { field: "type", op: "contains", value: "country" },
        { field: "type", op: "contains", value: "author" },
      ],
    });
  });

  it("additionally requests subdivision labels when the subdivisions feature is on", async () => {
    renderUseFilterLabels({ ...DEFAULT_FEATURES, subdivisions: true }, DEFAULT_THEME_CONFIG);

    await waitFor(() => expect(mockLoadFilteredLabels).toHaveBeenCalled());

    expect(mockLoadFilteredLabels.mock.calls[0][0].filters).toContainEqual({ field: "type", op: "contains", value: "subdivision" });
  });

  it("additionally requests litigation label types for themes with the Litigation search category", async () => {
    renderUseFilterLabels(DEFAULT_FEATURES, { ...DEFAULT_THEME_CONFIG, searchCategories: ["Litigation"] });

    await waitFor(() => expect(mockLoadFilteredLabels).toHaveBeenCalled());

    expect(mockLoadFilteredLabels.mock.calls[0][0].filters).toEqual(
      expect.arrayContaining([
        { field: "type", op: "contains", value: "jurisdiction" },
        { field: "type", op: "contains", value: "case_category" },
        { field: "type", op: "contains", value: "principal_law" },
      ])
    );
  });

  it("combines the filtered labels with the label taxonomy", async () => {
    mockLoadFilteredLabels.mockResolvedValue([label("concept::Q1")]);
    mockLoadLabelTaxonomy.mockResolvedValue([label("category::Law")]);

    const { result } = renderUseFilterLabels(DEFAULT_FEATURES, DEFAULT_THEME_CONFIG);

    await waitFor(() => expect(result.current).toEqual([label("concept::Q1"), label("category::Law")]));
  });
});
