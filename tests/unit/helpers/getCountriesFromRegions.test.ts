import { describe, it, expect } from "vitest";

import { getCountriesFromRegions } from "@/helpers/getCountriesFromRegions";

describe("getCountriesFromRegions", () => {
  const country1 = { id: 1, display_value: "Country 1", value: "Country 1", type: "country", parent_id: 1, slug: "country-1" };
  const country2 = { id: 2, display_value: "Country 2", value: "Country 2", type: "country", parent_id: 2, slug: "country-2" };

  it("returns all countries when no regions are selected", () => {
    const countries = getCountriesFromRegions({ regions: [], countries: [country1, country2], selectedRegions: [] });

    expect(countries).toEqual([country1, country2]);
  });

  it("returns countries filtered by region when region is passed in", () => {
    const region = { id: 2, display_value: "Region 1", value: "Region 1", type: "region", parent_id: null, slug: "region-1" };

    const countries = getCountriesFromRegions({ regions: [region], countries: [country1, country2], selectedRegions: ["region-1"] });

    expect(countries).toEqual([country2]);
  });
});
