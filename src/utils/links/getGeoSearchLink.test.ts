import { DEFAULT_FEATURES } from "@/constants/features";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { GeographyV2, TFeatures, TSearchLabel, TThemeConfig } from "@/types";
import { deflateFilters, inflateFilters } from "@/utils/filters/deflate";
import { getLabelPathSignature } from "@/utils/filters/filterPaths";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";
import { queryGroupToFilterPaths } from "@/utils/search/queryGroupToFilterPaths";

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

// The geography filter renders countries under a group root, which the link has to match
const geographyGroup = { id: "group::geography", type: "group", value: "geography" };
const geographyPath = [geographyLabel, region, geographyGroup];

const oldSearchFeatures: TFeatures = { ...DEFAULT_FEATURES, "new-search": false };
const newSearchFeatures: TFeatures = { ...DEFAULT_FEATURES, "new-search": true };

const themeConfigWithNewSearch: TThemeConfig = {
  ...DEFAULT_THEME_CONFIG,
  features: { ...DEFAULT_THEME_CONFIG.features, "new-search": true },
};

const themeConfigWithoutNewSearch: TThemeConfig = {
  ...DEFAULT_THEME_CONFIG,
  features: { ...DEFAULT_THEME_CONFIG.features, "new-search": false },
};

describe("getGeoSearchLink", () => {
  it("builds a country/category query when the new-search feature flag is off", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya", [QUERY_PARAMS.category]: "laws" });
  });

  it("builds a country/category query when there is no geography label, even if the feature flag is on", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      features: newSearchFeatures,
      geography,
      geographyLabel: null,
      themeConfig: themeConfigWithNewSearch,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya", [QUERY_PARAMS.category]: "laws" });
  });

  it("builds a filters query when the new-search feature flag is on and a geography label is provided", () => {
    const result = getGeoSearchLink({
      categoryId: "laws",
      features: newSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    const expectedFilters = filterPathsToQueryGroup([geographyPath, [{ id: "category::Law", type: "category", value: "Law" }]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  it("links to /search for old search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithoutNewSearch,
    });

    expect(result.href).toBe("/search");
  });

  it("links to /search when new search is on and the theme config also has new-search enabled", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: newSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    expect(result.href).toBe("/search");
  });

  it("links to /_search when new search is on but the theme config has new-search disabled (shadow page)", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: newSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithoutNewSearch,
    });

    expect(result.href).toBe("/_search");
  });

  it("omits the category query param for old search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya" });
  });

  it("only filters by geography for new search", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: newSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    const expectedFilters = filterPathsToQueryGroup([geographyPath], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  it("includes the category query param for old search", () => {
    const result = getGeoSearchLink({
      categoryId: "policies",
      features: oldSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    expect(result.query).toEqual({ [QUERY_PARAMS.country]: "kenya", [QUERY_PARAMS.category]: "policies" });
  });

  it("adds the mapped category filter for new search when the category is recognised", () => {
    const result = getGeoSearchLink({
      categoryId: "policies",
      features: newSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    const expectedFilters = filterPathsToQueryGroup([geographyPath, [{ id: "category::Policy", type: "category", value: "Policy" }]], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });

  /*
    The geography panel renders countries beneath a group root, so a path without it matches no
    checkbox: the filter applies to the results but the boxes read as unticked.
  */
  it("roots the geography path where the filter panel renders it", () => {
    const result = getGeoSearchLink({
      categoryId: "All",
      features: newSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    const filters = JSON.parse(inflateFilters(result.query[QUERY_PARAMS.filters] as string));
    const checkedPaths = queryGroupToFilterPaths(filters).filterPathLabels;

    expect(checkedPaths.map(getLabelPathSignature)).toEqual(["group::geography/region::Africa/country::Kenya"]);
  });

  it("only filters by geography for new search when the category has no known mapping", () => {
    const result = getGeoSearchLink({
      categoryId: "unmapped-category",
      features: newSearchFeatures,
      geography,
      geographyLabel,
      themeConfig: themeConfigWithNewSearch,
    });

    const expectedFilters = filterPathsToQueryGroup([geographyPath], null, "and");

    expect(result.query).toEqual({ [QUERY_PARAMS.filters]: deflateFilters(expectedFilters) });
  });
});
