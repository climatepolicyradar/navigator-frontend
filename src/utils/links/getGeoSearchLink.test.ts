import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSearchLabel } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

import { getGeoSearchLink } from "./getGeoSearchLink";

const region: TSearchLabel = {
  id: "region::Africa",
  type: "region",
  value: "Africa",
  labels: [],
};

const geographyLabel: TSearchLabel = {
  id: "country::Kenya",
  type: "country",
  value: "Kenya",
  labels: [{ type: "subconcept_of", value: region, timestamp: null, passages_id: null, count: null }],
};

const country: TSearchLabel = {
  id: "country::AUS",
  type: "country",
  value: "Australia",
  labels: [],
};

const subdivisionLabel: TSearchLabel = {
  id: "subdivision::AU-NSW",
  type: "subdivision",
  value: "New South Wales",
  labels: [{ type: "subconcept_of", value: country, timestamp: null, passages_id: null, count: null }],
};

describe("getGeoSearchLink", () => {
  it("builds a filters query from a geography label, its parent region and the mapped category", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup(
      [[geographyLabel, region], [{ id: "category::Law", type: "category", value: "Law" }]],
      null,
      "and"
    );

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("links to /search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      geographyLabel,
    });

    expect(result.href).toBe("/search");
  });

  it("only filters by geography", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup([[geographyLabel, region]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("adds the mapped category filter when the category is recognised", () => {
    const result = getGeoSearchLink({
      categoryId: "policies",
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup(
      [[geographyLabel, region], [{ id: "category::Policy", type: "category", value: "Policy" }]],
      null,
      "and"
    );

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("builds a filters query from a subdivision label and its parent country", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      geographyLabel: subdivisionLabel,
    });

    const expectedFilters = filterPathsToQueryGroup([[subdivisionLabel, country]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("adds the mapped category filter for a subdivision", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      geographyLabel: subdivisionLabel,
    });

    const expectedFilters = filterPathsToQueryGroup(
      [[subdivisionLabel, country], [{ id: "category::Law", type: "category", value: "Law" }]],
      null,
      "and"
    );

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });

  it("only filters by geography when the category has no known mapping", () => {
    const result = getGeoSearchLink({
      categoryId: "unmapped-category",
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup([[geographyLabel, region]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters), [QUERY_PARAMS.sort]: "recent" });
  });
});
