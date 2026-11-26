import { QUERY_PARAMS } from "@/constants/queryParams";
import { deflateFilters } from "@/utils/filters/deflate";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

import { createLabel, getGeoSearchLink } from "./getGeoSearchLink";

const kenyaPath = [createLabel("country::KEN"), createLabel("region::SSF")];
const newSouthWalesPath = [createLabel("subdivision::AU-NSW"), createLabel("country::AUS")];

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
