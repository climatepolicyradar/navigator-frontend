import { DEFAULT_FEATURES } from "@/constants/features";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { GeographyV2, TFeatures, TSearchLabel } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

import { getGeoSearchLink } from "./getGeoSearchLink";

const geography: GeographyV2 = {
  id: "geography-id",
  type: "country",
  slug: "kenya",
  name: "Kenya",
};

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

const subdivisionGeography: GeographyV2 = {
  id: "AU-NSW",
  type: "subdivision",
  slug: "au-nsw",
  name: "New South Wales",
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

const oldSearchFeatures: TFeatures = { ...DEFAULT_FEATURES, "new-search": false };
const newSearchFeatures: TFeatures = { ...DEFAULT_FEATURES, "new-search": true };

describe("getGeoSearchLink", () => {
  it("builds a country/category query when the new-search feature flag is off", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya", [QUERY_PARAMS.category]: "laws" });
  });

  it("builds a country/category query when there is no geography label, even if the feature flag is on", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      features: newSearchFeatures,
      geography,
      geographyLabel: null,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya", [QUERY_PARAMS.category]: "laws" });
  });

  it("builds a filters query when the new-search feature flag is on and a geography label is provided", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      features: newSearchFeatures,
      geography,
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup(
      [[geographyLabel, region], [{ id: "category::Law", type: "category", value: "Law" }]],
      null,
      "and"
    );

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  it("links to /search for old search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
    });

    expect(result.href).toBe("/search");
  });

  it("links to /search for new search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: newSearchFeatures,
      geography,
      geographyLabel,
    });

    expect(result.href).toBe("/search");
  });

  it("omits the category query param for old search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya" });
  });

  it("only filters by geography for new search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: newSearchFeatures,
      geography,
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup([[geographyLabel, region]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  it("includes the category query param for old search", () => {
    const result = getGeoSearchLink({
      categoryId: "policies",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya", [QUERY_PARAMS.category]: "policies" });
  });

  it("adds the mapped category filter for new search when the category is recognised", () => {
    const result = getGeoSearchLink({
      categoryId: "policies",
      features: newSearchFeatures,
      geography,
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup(
      [[geographyLabel, region], [{ id: "category::Policy", type: "category", value: "Policy" }]],
      null,
      "and"
    );

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  it("builds a filters query from a subdivision label and its parent country for new search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: newSearchFeatures,
      geography: subdivisionGeography,
      geographyLabel: subdivisionLabel,
    });

    const expectedFilters = filterPathsToQueryGroup([[subdivisionLabel, country]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  it("adds the mapped category filter for a subdivision for new search", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      features: newSearchFeatures,
      geography: subdivisionGeography,
      geographyLabel: subdivisionLabel,
    });

    const expectedFilters = filterPathsToQueryGroup(
      [[subdivisionLabel, country], [{ id: "category::Law", type: "category", value: "Law" }]],
      null,
      "and"
    );

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  it("only filters by geography for new search when the category has no known mapping", () => {
    const result = getGeoSearchLink({
      categoryId: "unmapped-category",
      features: newSearchFeatures,
      geography,
      geographyLabel,
    });

    const expectedFilters = filterPathsToQueryGroup([[geographyLabel, region]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });
});
