import { FAMILY_NEW_STUB } from "@/stubs/familyNewStub";
import { TAttributionCategory, TFamilyPublic } from "@/types";

import { getFamilyMetadata } from "./getFamilyMetadata";

describe("getFamilyMetadata", () => {
  // Mirrors a Global Stocktake principal, which carries the same metadata shape as a UN submission
  const buildFamily = (category: TAttributionCategory): TFamilyPublic => ({
    ...FAMILY_NEW_STUB,
    attribution: { ...FAMILY_NEW_STUB.attribution, category },
    published_date: "2017-08-16T00:00:00Z",
    geographies: [{ id: "country::TLS", type: "country", value: "Timor-Leste" }],
    metadata: { author: ["Timor-Leste"], author_type: ["Party"] },
  });

  it("returns the same metadata for Global Stocktake as for UN submission", () => {
    const stocktakeLabels = getFamilyMetadata(buildFamily("Global Stocktake"), null).map((item) => item.label);

    expect(stocktakeLabels).toEqual(getFamilyMetadata(buildFamily("UN submission"), null).map((item) => item.label));
    expect(stocktakeLabels).toEqual(["Year", "Geography", "Type", "Author Type", "Author"]);
  });

  it("omits rows for Global Stocktake fields that have no data", () => {
    const family = buildFamily("Global Stocktake");
    const labels = getFamilyMetadata({ ...family, metadata: {} }, null).map((item) => item.label);

    expect(labels).not.toContain("Author");
    expect(labels).not.toContain("Author Type");
  });
});
