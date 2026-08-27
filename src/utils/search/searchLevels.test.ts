import { TSearchQueryGroup } from "@/types";

import { flattenLevelToBaseQuery, levelIdParamKey, levelParamKeys, searchLevelUrlKeys, seedPassageLevel } from "./searchLevels";

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
      filters: { op: "and", filters: [conceptRule] },
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
