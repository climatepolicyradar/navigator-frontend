import { TFilterPathLabel, TSearchQueryGroup, TSearchQueryRule } from "@/types";

import { DEFAULT_SEARCH_QUERY_GROUP, filterPathsToQueryGroup } from "./filterPathsToQueryGroup";

/**
 * RULES:
 * 1. all TFilterPathLabel are represented in the output by a TSearchQueryRule
 * 2. TFilterPathLabel that are children of another TFilterPathLabel are surrounded by an AND
 * 3. sibling TFilterPathLabel with the same type are surrounded by an OR, except type "concept" which is surrounded by an AND
 * 4. sibling TFilterPathLabel with different types are surrounded by an AND, except the types that share a category:
 *    "country" + "region", and "document_type" + "entity_type", which are surrounded by an OR
 * 5. nested TFilterPathLabel are separated from each other by at least one TSearchQueryGroup
 */

type TFilterTestCase = {
  name: string;
  filterPathLabels: TFilterPathLabel[][];
  searchQueryGroup: TSearchQueryGroup;
};

// Dumb constructors for the expected shapes: no logic, so the table never asserts against the
// implementation's own decisions (whether to wrap a lone rule in a group is behaviour under test)
const label = (type: string, value: string): TFilterPathLabel => ({ id: [type, value].join("::"), type, value });
const and = (...filters: (TSearchQueryGroup | TSearchQueryRule)[]): TSearchQueryGroup => ({ op: "and", filters });
const or = (...filters: (TSearchQueryGroup | TSearchQueryRule)[]): TSearchQueryGroup => ({ op: "or", filters });
const id_contains = (value: string): TSearchQueryRule => ({ field: "labels.value.id", op: "contains", value });
const id_contains_checked = (value: string): TSearchQueryRule => ({ field: "labels.value.id", op: "contains", value, checked: true });

export const FILTER_TEST_CASES: TFilterTestCase[] = [
  {
    name: "no filters",
    filterPathLabels: [],
    searchQueryGroup: DEFAULT_SEARCH_QUERY_GROUP,
  },
  {
    name: "one first level filter",
    filterPathLabels: [[label("category", "Multilateral Climate Fund project")]],
    searchQueryGroup: or(id_contains_checked("category::Multilateral Climate Fund project")),
  },
  {
    name: "multiple first level filters",
    filterPathLabels: [[label("category", "Multilateral Climate Fund project")], [label("category", "UN submission")]],
    searchQueryGroup: or(id_contains_checked("category::Multilateral Climate Fund project"), id_contains_checked("category::UN submission")),
  },
  {
    name: "multiple first level concept filters",
    filterPathLabels: [[label("concept", "Adaptation")], [label("concept", "Mitigation")]],
    searchQueryGroup: and(id_contains_checked("concept::Adaptation"), id_contains_checked("concept::Mitigation")),
  },
  {
    name: "one second level filter",
    filterPathLabels: [[label("un_convention", "UNCCD"), label("category", "UN submission")]],
    searchQueryGroup: and(id_contains("category::UN submission"), or(id_contains_checked("un_convention::UNCCD"))),
  },
  {
    name: "one second level filter and its parent",
    filterPathLabels: [[label("category", "UN submission")], [label("un_convention", "UNCCD"), label("category", "UN submission")]],
    searchQueryGroup: and(id_contains_checked("category::UN submission"), or(id_contains_checked("un_convention::UNCCD"))),
  },
  {
    name: "multiple second level filters, siblings + same type",
    filterPathLabels: [
      [label("author_type", "Corporate"), label("category", "Report")],
      [label("author_type", "Individual"), label("category", "Report")],
    ],
    searchQueryGroup: and(
      id_contains("category::Report"),
      or(id_contains_checked("author_type::Corporate"), id_contains_checked("author_type::Individual"))
    ),
  },
  {
    name: "multiple second level filters, siblings + same type (concept)",
    filterPathLabels: [
      [label("concept", "Adaptation"), label("category", "Report")],
      [label("concept", "Mitigation"), label("category", "Report")],
    ],
    searchQueryGroup: and(
      id_contains("category::Report"),
      and(id_contains_checked("concept::Adaptation"), id_contains_checked("concept::Mitigation"))
    ),
  },
  {
    name: "multiple second level filters, siblings + different types (1+1)",
    filterPathLabels: [
      [label("author_type", "Corporate"), label("category", "Report")],
      [label("report_type", "Climate council report"), label("category", "Report")],
    ],
    searchQueryGroup: and(
      id_contains("category::Report"),
      and(id_contains_checked("author_type::Corporate"), id_contains_checked("report_type::Climate council report"))
    ),
  },
  {
    name: "multiple second level filters, siblings + different types (2+1)",
    filterPathLabels: [
      [label("author_type", "Corporate"), label("category", "Report")],
      [label("author_type", "Industry body"), label("category", "Report")],
      [label("report_type", "Climate council report"), label("category", "Report")],
    ],
    searchQueryGroup: and(
      id_contains("category::Report"),
      and(
        or(id_contains_checked("author_type::Corporate"), id_contains_checked("author_type::Industry body")),
        id_contains_checked("report_type::Climate council report")
      )
    ),
  },
  {
    name: "multiple filters, siblings + different geography types",
    filterPathLabels: [[label("country", "GBR"), label("region", "Europe & Central Asia")], [label("country", "XAB")]],
    searchQueryGroup: or(
      and(id_contains("region::Europe & Central Asia"), or(id_contains_checked("country::GBR"))),
      id_contains_checked("country::XAB")
    ),
  },
  {
    name: "multiple filters, siblings + document type and entity type",
    filterPathLabels: [
      [label("entity_type", "Nationally Determined Contribution (NDC)")],
      [label("document_type", "Submission to the Global Stocktake")],
    ],
    searchQueryGroup: or(
      id_contains_checked("entity_type::Nationally Determined Contribution (NDC)"),
      id_contains_checked("document_type::Submission to the Global Stocktake")
    ),
  },
  {
    name: "one third level filter",
    filterPathLabels: [[label("document_type", "Country Report (CR)"), label("un_convention", "UNCCD"), label("category", "UN submission")]],
    searchQueryGroup: and(
      id_contains("category::UN submission"),
      and(id_contains("un_convention::UNCCD"), or(id_contains_checked("document_type::Country Report (CR)")))
    ),
  },
  {
    name: "one third level filter and its parent",
    filterPathLabels: [
      [label("un_convention", "UNCCD"), label("category", "UN submission")],
      [label("document_type", "Country Report (CR)"), label("un_convention", "UNCCD"), label("category", "UN submission")],
    ],
    searchQueryGroup: and(
      id_contains("category::UN submission"),
      and(id_contains_checked("un_convention::UNCCD"), or(id_contains_checked("document_type::Country Report (CR)")))
    ),
  },
  {
    name: "two third level filters with different parents",
    filterPathLabels: [
      [label("document_type", "Country Report (CR)"), label("un_convention", "UNCCD"), label("category", "UN submission")],
      [label("entity_type", "Adaptation Communication (AC)"), label("un_convention", "CBD"), label("category", "UN submission")],
    ],
    searchQueryGroup: and(
      id_contains("category::UN submission"),
      or(
        and(id_contains("un_convention::UNCCD"), or(id_contains_checked("document_type::Country Report (CR)"))),
        and(id_contains("un_convention::CBD"), or(id_contains_checked("entity_type::Adaptation Communication (AC)")))
      )
    ),
  },
  {
    name: "second and third level filters with the same sibling types",
    filterPathLabels: [
      [label("jurisdiction", "Argentina"), label("category", "Litigation")],
      [label("jurisdiction", "Australian Capital Territory"), label("jurisdiction", "Australia"), label("category", "Litigation")],
    ],
    searchQueryGroup: and(
      id_contains("category::Litigation"),
      or(
        id_contains_checked("jurisdiction::Argentina"),
        and(id_contains("jurisdiction::Australia"), or(id_contains_checked("jurisdiction::Australian Capital Territory")))
      )
    ),
  },
  {
    name: "second and third level filters with different sibling types",
    filterPathLabels: [
      [label("case_category", "Adaptation (US)"), label("category", "Litigation")],
      [
        label("jurisdiction", "Massachusetts District Court (Mass. Dist. Ct.)"),
        label("jurisdiction", "United States"),
        label("category", "Litigation"),
      ],
    ],
    searchQueryGroup: and(
      id_contains("category::Litigation"),
      and(
        id_contains_checked("case_category::Adaptation (US)"),
        and(id_contains("jurisdiction::United States"), or(id_contains_checked("jurisdiction::Massachusetts District Court (Mass. Dist. Ct.)")))
      )
    ),
  },
  {
    name: "a checked root filter beside a group of same-type siblings",
    filterPathLabels: [[label("country", "XAB")], [label("test_level", "Country")], [label("test_level", "Subdivision")]],
    searchQueryGroup: and(
      or(id_contains_checked("country::XAB")),
      or(id_contains_checked("test_level::Country"), id_contains_checked("test_level::Subdivision"))
    ),
  },
];

describe("filterPathsToQueryGroup", () => {
  it.each(FILTER_TEST_CASES.map(({ name, filterPathLabels, searchQueryGroup }) => [name, filterPathLabels, searchQueryGroup]))(
    "builds a filter for %s",
    (_name, filterPathLabels, expectedFilterGroup) => {
      expect(filterPathsToQueryGroup(filterPathLabels, null, "and")).toEqual(expectedFilterGroup);
    }
  );

  describe("date range", () => {
    const dateRange: [number, number] = [2020, 2024];
    const gteFilter = { field: "attributes.published_date", key: "published_date", op: "gte", value: "2020-01-01T00:00:00.000Z" };
    const lteFilter = { field: "attributes.published_date", key: "published_date", op: "lte", value: "2024-12-31T23:59:59.999Z" };

    it("appends date filters directly when the result is an AND group", () => {
      const andCase = FILTER_TEST_CASES.find((testCase) => testCase.name === "one second level filter")!;

      expect(filterPathsToQueryGroup(andCase.filterPathLabels, dateRange, "and")).toEqual({
        op: "and",
        filters: [...(andCase.searchQueryGroup as TSearchQueryGroup).filters, gteFilter, lteFilter],
      });
    });

    it("wraps the result in a new AND group when the result is an OR group", () => {
      const orCase = FILTER_TEST_CASES.find((testCase) => testCase.name === "one first level filter")!;

      expect(filterPathsToQueryGroup(orCase.filterPathLabels, dateRange, "and")).toEqual({
        op: "and",
        filters: [orCase.searchQueryGroup, gteFilter, lteFilter],
      });
    });

    it("only includes date filters when there are no label filters", () => {
      expect(filterPathsToQueryGroup([], dateRange, "and")).toEqual({
        op: "and",
        filters: [gteFilter, lteFilter],
      });
    });
  });
});
