import { QUERY_PARAMS } from "@/constants/queryParams";
import { deflateFilters } from "@/utils/filters/deflate";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

import { createLabel, getGeographyPath, getGeoSearchLink } from "./getGeoSearchLink";

const kenyaPath = [createLabel("country::KEN"), createLabel("region::SSF")];
const newSouthWalesPath = [createLabel("subdivision::AU-NSW"), createLabel("country::AUS")];

describe("getGeographyPath", () => {
  const label = (id: string, value: string) => ({ id, type: id.split("::")[0], value });

  it("scopes a subdivision under its country", () => {
    expect(getGeographyPath(label("subdivision::GB-SCT", "Scotland"), label("country::GBR", "United Kingdom"))).toEqual([
      createLabel("subdivision::GB-SCT"),
      createLabel("country::GBR"),
    ]);
  });

  it("scopes a country under its region", () => {
    expect(getGeographyPath(label("country::GBR", "United Kingdom"), label("region::ECS", "Europe & Central Asia"))).toEqual([
      createLabel("country::GBR"),
      createLabel("region::ECS"),
    ]);
  });

  it("is just the geography when it has no parent", () => {
    expect(getGeographyPath(label("country::GBR", "United Kingdom"), null)).toEqual([createLabel("country::GBR")]);
  });
});

describe("getGeoSearchLink", () => {
  it("builds a filters query from a geography path and the mapped category", () => {
    const result = getGeoSearchLink({ categoryId: "laws", geographyPath: kenyaPath });

    const expectedFilters = filterPathsToQueryGroup([kenyaPath, [createLabel("category::Law")]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("links to /search", () => {
    expect(getGeoSearchLink({ categoryId: "All", geographyPath: kenyaPath }).href).toBe("/search");
  });

  it("only filters by geography", () => {
    const result = getGeoSearchLink({ categoryId: "All", geographyPath: kenyaPath });

    const expectedFilters = filterPathsToQueryGroup([kenyaPath], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("adds the mapped category filter for a subdivision", () => {
    const result = getGeoSearchLink({ categoryId: "laws", geographyPath: newSouthWalesPath });

    const expectedFilters = filterPathsToQueryGroup([newSouthWalesPath, [createLabel("category::Law")]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("only filters by geography when the category has no known mapping", () => {
    const result = getGeoSearchLink({ categoryId: "unmapped-category", geographyPath: kenyaPath });

    const expectedFilters = filterPathsToQueryGroup([kenyaPath], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });
});
