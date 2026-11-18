import { TFilterPathLabel } from "@/types";

import { getSearchSortDefault } from "./getSearchSortDefault";

const categoryLabel: TFilterPathLabel = {
  id: "category::Legislative",
  type: "category",
  value: "Legislative",
};

const conceptLabel: TFilterPathLabel = {
  id: "concept::Adaptation",
  type: "concept",
  value: "Adaptation",
};

describe("getSearchSortDefault", () => {
  it("returns recent when no filters are checked and no query is present", () => {
    expect(getSearchSortDefault([], "")).toBe("recent");
  });

  it("returns recent when unrelated filters are checked and no query is present", () => {
    expect(getSearchSortDefault([[categoryLabel]], "")).toBe("recent");
  });

  it("returns relevance when a query is present", () => {
    expect(getSearchSortDefault([], "flooding")).toBe("relevance");
  });

  it("returns relevance when a topic filter is checked", () => {
    expect(getSearchSortDefault([[categoryLabel], [conceptLabel]], "")).toBe("relevance");
  });
});
