import { TSearchQueryGroup } from "@/types";

import {
  flattenLevelToBaseQuery,
  levelIdParamKey,
  levelParamKeys,
  searchLevelFromParams,
  searchLevelUrlKeys,
  searchPropertiesFromParams,
  seedPassageLevel,
} from "./searchLevels";

const conceptRule = { field: "labels.value.id", op: "contains", value: "concept::Q786", checked: true } as const;
const countryRule = { field: "labels.value.id", op: "contains", value: "country::LVA", checked: true } as const;
const mixedFilters: TSearchQueryGroup = { op: "and", filters: [conceptRule, countryRule] };

describe("levelParamKeys", () => {
  it("uses the page's own params for the base level", () => {
    expect(levelParamKeys("base")).toEqual({ documents: "docs", filters: "filters", pageToken: "page_token", query: "q", sort: "sort" });
  });

  it("namespaces the base params for a nested level", () => {
    expect(levelParamKeys("principal")).toEqual({
      documents: "principal_docs",
      filters: "principal_filters",
      pageToken: "principal_page_token",
      query: "principal_q",
      sort: "principal_sort",
    });
    expect(levelParamKeys("document")).toEqual({
      documents: "document_docs",
      filters: "document_filters",
      pageToken: "document_page_token",
      query: "document_q",
      sort: "document_sort",
    });
  });
});

describe("searchLevelUrlKeys", () => {
  it("maps the level group onto the params that level owns", () => {
    expect(searchLevelUrlKeys("base")).toEqual({ documents: "docs", filters: "filters", query: "q", sort: "sort" });
    expect(searchLevelUrlKeys("principal")).toEqual({
      documents: "principal_docs",
      filters: "principal_filters",
      query: "principal_q",
      sort: "principal_sort",
    });
  });

  it("names a nested level's identity param after the level", () => {
    expect(levelIdParamKey("principal")).toBe("principal");
    expect(levelIdParamKey("document")).toBe("document");
  });
});

describe("seedPassageLevel", () => {
  it("carries the query and only the concept filters", () => {
    expect(seedPassageLevel({ query: "flood risk", filters: mixedFilters })).toEqual({
      documents: null,
      filters: { op: "or", filters: [conceptRule] },
      query: "flood risk",
      sort: null,
    });
  });

  it("carries sort only when the caller passes one", () => {
    expect(seedPassageLevel({ sort: "idx asc" }).sort).toBe("idx asc");
    expect(seedPassageLevel({}).sort).toBeNull();
  });

  it("leaves nothing behind when there is no search to carry", () => {
    expect(seedPassageLevel({ query: "", filters: { op: "and", filters: [countryRule] } })).toEqual({
      documents: null,
      filters: null,
      query: null,
      sort: null,
    });
  });
});

describe("flattenLevelToBaseQuery", () => {
  it("serialises a level onto the base params", () => {
    expect(flattenLevelToBaseQuery({ documents: ["CCLW.document.1.1", "CCLW.document.1.2"], filters: mixedFilters, query: "flood risk" })).toEqual({
      docs: "CCLW.document.1.1,CCLW.document.1.2",
      filters: JSON.stringify(mixedFilters),
      q: "flood risk",
    });
  });

  it("nulls the params it has no value for, so nothing is inherited", () => {
    expect(flattenLevelToBaseQuery({ documents: [], filters: null, query: "" })).toEqual({ docs: null, filters: null, q: null });
  });
});

describe("searchLevelFromParams", () => {
  const level = (pathname: string, search: string) => searchLevelFromParams(pathname, new URLSearchParams(search));

  it("reads the deepest open level from the params", () => {
    expect(level("/_search", "")).toBe("base");
    expect(level("/_search", "q=flood+risk")).toBe("base");
    expect(level("/_search", "principal=CCLW.family.1.0")).toBe("principal");
    expect(level("/_search", "principal=CCLW.family.1.0&document=CCLW.document.1.2")).toBe("document");
  });

  it("is unset away from the results page, so pages with no levels are not read as the results page", () => {
    expect(level("/document/a-climate-law", "")).toBeUndefined();
    // A topic drawer opened on a family page is not a search level
    expect(level("/document/a-climate-law", "topic=Q786")).toBeUndefined();
  });
});

describe("searchPropertiesFromParams", () => {
  const properties = (pathname: string, search: string) => searchPropertiesFromParams(pathname, new URLSearchParams(search));
  const filtersParam = (filters: TSearchQueryGroup) => `filters=${encodeURIComponent(JSON.stringify(filters))}`;

  it("has nothing to say away from the results page", () => {
    expect(properties("/document/a-climate-law", "q=flooding")).toEqual({});
  });

  it("reports the query and the filters as values rather than encoded JSON", () => {
    expect(properties("/_search", `q=flooding&${filtersParam(mixedFilters)}`)).toEqual({
      search_query: "flooding",
      filters_applied: ["concept::Q786", "country::LVA"],
      filters_count: 2,
      filter_types: ["concept", "country"],
    });
  });

  it("counts the labels a selection sits under, which the filter controls write unchecked", () => {
    const topicWithinCategory: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "category::Law" },
        { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "topic::adaptation", checked: true }] },
      ],
    };

    expect(properties("/_search", filtersParam(topicWithinCategory))).toEqual({
      filters_applied: ["topic::adaptation", "category::Law"],
      filters_count: 2,
      filter_types: ["topic", "category"],
    });
  });

  it("counts an unfiltered search as zero, so filtered and unfiltered searches are comparable", () => {
    expect(properties("/_search", "q=flooding")).toEqual({ search_query: "flooding", filters_count: 0 });
  });

  it("omits the sort and the page while they are the defaults, so a value means the user chose it", () => {
    expect(properties("/_search", "q=flooding&page_token=1")).toEqual({ search_query: "flooding", filters_count: 0 });
    expect(properties("/_search", "q=flooding&sort=recent&page_token=3")).toEqual({
      search_query: "flooding",
      sort: "recent",
      page: 3,
      filters_count: 0,
    });
  });

  it("describes the drawer the user is in rather than the results behind it", () => {
    expect(
      properties("/_search", `q=flooding&${filtersParam(mixedFilters)}&principal=CCLW.family.1.0&principal_q=defences&principal_sort=recent`)
    ).toEqual({
      search_query: "defences",
      sort: "recent",
      filters_count: 0,
    });
  });

  it("reads a date filter as a year range", () => {
    const dateFilters: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "attributes.published_date", key: "published_date", op: "gte", value: "2015-06-01T00:00:00.000Z" },
        { field: "attributes.published_date", key: "published_date", op: "lte", value: "2024-06-01T00:00:00.000Z" },
      ],
    };

    expect(properties("/_search", filtersParam(dateFilters))).toEqual({ date_range: [2015, 2024], filters_count: 0 });
  });

  it("treats an empty filter group as no filters, which is the state the results page starts in", () => {
    expect(properties("/_search", `q=flooding&${filtersParam({ op: "and", filters: [] })}`)).toEqual({ search_query: "flooding", filters_count: 0 });
  });

  it("treats a filters value it cannot read as no filters, so a hand edited URL does not break the page view", () => {
    expect(properties("/_search", "q=flooding&filters=not-json")).toEqual({ search_query: "flooding", filters_count: 0 });
    expect(properties("/_search", `q=flooding&filters=${encodeURIComponent('{"op":"maybe"}')}`)).toEqual({
      search_query: "flooding",
      filters_count: 0,
    });
  });
});
