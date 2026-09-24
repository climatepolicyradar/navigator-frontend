import { renderHook } from "@testing-library/react";

import { DEFAULT_FEATURES } from "@/constants/features";
import { FeaturesContext } from "@/context/FeaturesContext";
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
  it("resolves the parent country breadcrumb when the family has a subdivision", () => {
    const family = {
      ...baseFamily,
      geographies: [
        { id: "country::USA", type: "country", value: "United States" },
        { id: "subdivision::US-OR", type: "subdivision", value: "Oregon" },
      ],
    };

    const { result } = renderHook(() => useFamilyPageHeaderData(family), {
      wrapper: ({ children }) => <FeaturesContext.Provider value={{ ...DEFAULT_FEATURES, subdivisions: true }}>{children}</FeaturesContext.Provider>,
    });

    expect(result.current.breadcrumbParentGeography).toEqual({ label: "United States", href: "/geographies/united-states-of-america" });
  });

  it("omits the breadcrumbs when the family has no country", () => {
    const family = {
      ...baseFamily,
      geographies: [{ id: "subdivision::US-OR", type: "subdivision", value: "Oregon" }],
    };

    const { result } = renderHook(() => useFamilyPageHeaderData(family));

    expect(result.current.breadcrumbGeography).toBeNull();
    expect(result.current.breadcrumbParentGeography).toBeNull();
  });
});
