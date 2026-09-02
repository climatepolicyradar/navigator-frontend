import { TSearchQueryGroup, TSearchQueryRule } from "@/types";

import { FILTER_TEST_CASES } from "./filterPathsToQueryGroup.test";
import { queryGroupToFilterPaths } from "./queryGroupToFilterPaths";

describe("queryGroupToFilterPaths", () => {
  it.each(FILTER_TEST_CASES.map(({ name, filterPathLabels, searchQueryGroup }) => [name, searchQueryGroup, filterPathLabels]))(
    "builds a query group for %s",
    (_name, searchQueryGroup, expectedPathLabels) => {
      expect(queryGroupToFilterPaths(searchQueryGroup).filterPathLabels).toEqual(expectedPathLabels);
    }
  );

  describe("date range", () => {
    const gteFilter: TSearchQueryRule = {
      field: "attributes.published_date",
      key: "published_date",
      op: "gte",
      value: "2020-01-01T00:00:00.000Z",
    };
    const lteFilter: TSearchQueryRule = {
      field: "attributes.published_date",
      key: "published_date",
      op: "lte",
      value: "2024-12-31T23:59:59.999Z",
    };
    const currentYear = new Date().getFullYear();

    it("returns [startYear, endYear] when both gte and lte are present", () => {
      const searchQueryGroup: TSearchQueryGroup = { op: "and", filters: [gteFilter, lteFilter] };

      expect(queryGroupToFilterPaths(searchQueryGroup).dateRange).toEqual([2020, 2024]);
    });

    it("assumes the current year as the end date when only gte is present", () => {
      const searchQueryGroup: TSearchQueryGroup = { op: "and", filters: [gteFilter] };

      expect(queryGroupToFilterPaths(searchQueryGroup).dateRange).toEqual([2020, currentYear]);
    });

    it("returns null when only lte is present", () => {
      const searchQueryGroup: TSearchQueryGroup = { op: "and", filters: [lteFilter] };

      expect(queryGroupToFilterPaths(searchQueryGroup).dateRange).toBeNull();
    });

    it("returns null when neither gte nor lte are present", () => {
      const searchQueryGroup: TSearchQueryGroup = { op: "or", filters: [] };

      expect(queryGroupToFilterPaths(searchQueryGroup).dateRange).toBeNull();
    });

    it("ignores date filters that are not in the top-level AND group", () => {
      const searchQueryGroup: TSearchQueryGroup = { op: "and", filters: [{ op: "and", filters: [gteFilter, lteFilter] }] };

      expect(queryGroupToFilterPaths(searchQueryGroup).dateRange).toBeNull();
    });
  });
});
