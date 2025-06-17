import { describe, it, expect, vi, beforeEach } from "vitest";

import { ApiClient } from "@/api/http-common";
import { getCountriesFromRegions } from "@/helpers/getCountriesFromRegions";

vi.mock("@/api/http-common", () => ({
  ApiClient: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
  })),
}));

describe("getCountriesFromRegions", () => {
  const country1 = { id: 1, display_value: "Country 1", value: "Country 1", type: "country", parent_id: 1, slug: "country-1" };
  const country2 = { id: 2, display_value: "Country 2", value: "Country 2", type: "country", parent_id: 2, slug: "country-2" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all countries when no regions are selected", async () => {
    const mockGet = vi.fn().mockResolvedValue({ data: [country1, country2] });
    (ApiClient as any).mockImplementation(() => ({ get: mockGet }));

    const countries = await getCountriesFromRegions({ regions: [], countries: [country1, country2], selectedRegions: [] });

    expect(countries).toEqual([country1, country2]);
  });

  it("returns countries filtered by region when region is passed in", async () => {
    const region = { id: 2, display_value: "Region 1", value: "Region 1", type: "region", parent_id: null, slug: "region-1" };

    const countries = await getCountriesFromRegions({ regions: [region], countries: [country1, country2], selectedRegions: ["region-1"] });

    expect(countries).toEqual([country2]);
  });
});
