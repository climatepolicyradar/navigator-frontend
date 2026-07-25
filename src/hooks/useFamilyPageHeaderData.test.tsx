import { renderHook } from "@testing-library/react";

import { TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";

import { useFamilyPageHeaderData } from "./useFamilyPageHeaderData";

const baseFamily: TFamilyPublic = {
  import_id: "test.family.1.0",
  title: "Test Family",
  summary: "Summary",
  slug: "test-family",
  geographies: ["USA", "US-OR"],
  published_date: "2020-01-01T00:00:00Z",
  last_updated_date: null,
  attribution: {
    category: "Litigation",
    corpusImageAlt: "alt",
    corpusNote: "note",
    provider: "Sabin",
    taxonomy: "Litigation",
  },
  collections: [],
  concepts: [],
  documents: [],
  events: [],
  metadata: {},
};

const countries: TGeography[] = [{ id: 1, display_value: "United States", value: "USA", type: "country", parent_id: null, slug: "united-states" }];

describe("useFamilyPageHeaderData", () => {
  it("resolves the parent country breadcrumb when the subdivision is present in the subdivisions list", () => {
    const subdivisions: TGeographySubdivision[] = [{ code: "US-OR", name: "Oregon", type: "state", country_alpha_2: "US", country_alpha_3: "USA" }];

    const { result } = renderHook(() => useFamilyPageHeaderData({ countries, family: baseFamily, subdivisions }));

    expect(result.current.breadcrumbParentGeography).toEqual({ label: "United States", href: "/geographies/united-states" });
  });

  it("does not throw and omits the parent breadcrumb when the subdivision's code cannot be matched by exact string equality", () => {
    // getSubdivisionName() matches case-insensitively (so the subdivision's name still resolves and it
    // stays in geographiesDisplayData), but the strict `sub.code === subdivision.code` lookup below does
    // not - reproducing the same "found the name, but the exact record lookup misses" shape as when an
    // upstream `/geographies/subdivisions/{country}` fetch fails and the subdivision record is absent.
    const subdivisions: TGeographySubdivision[] = [{ code: "us-or", name: "Oregon", type: "state", country_alpha_2: "US", country_alpha_3: "USA" }];

    expect(() => renderHook(() => useFamilyPageHeaderData({ countries, family: baseFamily, subdivisions }))).not.toThrow();

    const { result } = renderHook(() => useFamilyPageHeaderData({ countries, family: baseFamily, subdivisions }));
    expect(result.current.breadcrumbParentGeography).toBeNull();
  });
});
