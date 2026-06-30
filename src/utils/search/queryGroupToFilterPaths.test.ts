import { FILTER_TEST_CASES } from "./filterPathsToQueryGroup.test";
import { queryGroupToFilterPaths } from "./queryGroupToFilterPaths";

describe("queryGroupToFilterPaths", () => {
  it.each(FILTER_TEST_CASES.map(({ name, filterPathLabels, searchQueryGroup }) => [name, searchQueryGroup, filterPathLabels]))(
    "builds a query group for %s",
    (_name, searchQueryGroup, expectedPathLabels) => {
      expect(queryGroupToFilterPaths(searchQueryGroup)).toEqual(expectedPathLabels);
    }
  );
});
