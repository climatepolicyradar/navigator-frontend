import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { configureDocumentsFilters, PRINCIPAL_DOCUMENTS_FILTER } from "@/api/search";
import { DEFAULT_FEATURES } from "@/constants/features";
import { SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { EnvConfigContext, TPublicEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TFeatures, TNestedSearchLabel } from "@/types";

import useSubdivisions from "./useSubdivisions";

const mockLoadTaxonomy = vi.hoisted(() => vi.fn());
vi.mock("@/api/taxonomy", () => ({ loadTaxonomy: mockLoadTaxonomy }));

const label = (id: string, value: string, count: number, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id,
  type: id.split("::")[0],
  value,
  alternative_labels: [],
  count,
  children,
});

const TAXONOMY = [
  label("region::LAC", "Latin America & Caribbean", 10, [
    label("country::MEX", "Mexico", 10, [label("subdivision::MX-TAB", "Tabasco", 4), label("subdivision::MX-CHP", "Chiapas", 0)]),
  ]),
  label("region::NAC", "North America", 5088, [
    label("country::USA", "United States", 5088, [
      label("subdivision::US-DC", "District of Columbia", 3133),
      label("subdivision::US-CA", "California", 1952),
    ]),
  ]),
];

const SUBDIVISIONS_ON: TFeatures = { ...DEFAULT_FEATURES, subdivisions: true };

const renderUseSubdivisions = (features: TFeatures = SUBDIVISIONS_ON) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <EnvConfigContext.Provider value={{ API_URL: "https://api.example.test" } as TPublicEnvConfig}>
        <FeaturesContext.Provider value={features}>{children}</FeaturesContext.Provider>
      </EnvConfigContext.Provider>
    </QueryClientProvider>
  );

  return renderHook(() => useSubdivisions(), { wrapper });
};

describe("useSubdivisions", () => {
  beforeEach(() => {
    mockLoadTaxonomy.mockReset().mockResolvedValue(TAXONOMY);
  });

  it("returns subdivisions with bare ISO-3166-2 codes, flattened out of the region and country levels", async () => {
    const { result } = renderUseSubdivisions();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { code: "MX-TAB", name: "Tabasco", type: "subdivision", count: 4 },
      { code: "US-DC", name: "District of Columbia", type: "subdivision", count: 3133 },
      { code: "US-CA", name: "California", type: "subdivision", count: 1952 },
    ]);
  });

  it("leaves out subdivisions the app has no documents for", async () => {
    const { result } = renderUseSubdivisions();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.map((subdivision) => subdivision.code)).not.toContain("MX-CHP");
  });

  it("asks the search API for the subdivision level, counted over this app's principal documents", async () => {
    const { result } = renderUseSubdivisions();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockLoadTaxonomy).toHaveBeenCalledWith("https://api.example.test", {
      patterns: [SUBDIVISION_LABEL_PATTERN],
      filters: configureDocumentsFilters({ op: "and", filters: [PRINCIPAL_DOCUMENTS_FILTER] }, undefined, SUBDIVISIONS_ON),
    });
  });

  it("does not exclude documents labelled with a subdivision while the subdivisions feature is on", async () => {
    const { result } = renderUseSubdivisions();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { filters } = mockLoadTaxonomy.mock.calls[0][1];
    expect(JSON.stringify(filters)).not.toContain(JSON.stringify({ op: "not_contains", field: "labels.value.type", value: "subdivision" }));
  });

  it("returns nothing and does not call the API while the subdivisions feature is off", async () => {
    const { result } = renderUseSubdivisions({ ...DEFAULT_FEATURES, subdivisions: false });

    // `enabled: false` never leaves the idle state, so give any stray request a tick to show up
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockLoadTaxonomy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
