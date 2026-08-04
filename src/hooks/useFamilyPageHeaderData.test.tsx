import { renderHook } from "@testing-library/react";

import { TFamilyPublic } from "@/types";

import { useFamilyPageHeaderData } from "./useFamilyPageHeaderData";

const baseFamily: TFamilyPublic = {
  import_id: "test.family.1.0",
  title: "Test Family",
  summary: "Summary",
  slug: "test-family",
  geographies: [],
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

describe("useFamilyPageHeaderData", () => {
  it("resolves the parent country breadcrumb when the subdivision is present in the subdivisions list", () => {
    const family = {
      ...baseFamily,
      geographies: [
        {
          code: "USA",
          name: "United States",
          slug: "united-states-of-america",
        },
        {
          code: "USA-OR",
          name: "Oregon",
          slug: "us-or",
        },
      ],
    };

    const { result } = renderHook(() => useFamilyPageHeaderData(family));

    expect(result.current.breadcrumbParentGeography).toEqual({ label: "United States", href: "/geographies/united-states-of-america" });
  });

  it("does not throw and omits the parent breadcrumb when the subdivision's code cannot be matched by exact string equality", () => {
    // getSubdivisionName() matches case-insensitively (so the subdivision's name still resolves and it
    // stays in geographiesDisplayData), but the strict `sub.code === subdivision.code` lookup below does
    // not - reproducing the same "found the name, but the exact record lookup misses" shape as when an
    // upstream `/geographies/subdivisions/{country}` fetch fails and the subdivision record is absent.
    const family = {
      ...baseFamily,
      geographies: [
        {
          code: "USA",
          name: "United States",
          slug: "united-states-of-america",
        },
        {
          code: "usa-or",
          name: "Oregon",
          slug: "us-or",
        },
      ],
    };

    expect(() => renderHook(() => useFamilyPageHeaderData(family))).not.toThrow();

    const { result } = renderHook(() => useFamilyPageHeaderData(baseFamily));
    expect(result.current.breadcrumbParentGeography).toBeNull();
  });
});
