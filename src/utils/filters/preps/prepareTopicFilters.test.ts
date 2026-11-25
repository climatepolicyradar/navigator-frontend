import { describe, expect, it } from "vitest";

import { TNestedSearchLabel } from "@/types";
import { prepareTopicFilters } from "@/utils/filters/preps/prepareTopicFilters";

const label = (id: string, count: number, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id,
  type: id.split("::")[0],
  value: id.split("::")[1],
  alternative_labels: [],
  count,
  children,
});

describe("prepareTopicFilters", () => {
  it("drops an uncounted parent but keeps its counted children", () => {
    const hydrocarbon = label("concept::Q1484", 0, [label("concept::Q1", 5), label("concept::Q2", 0)]);
    expect(prepareTopicFilters([])([hydrocarbon]).map((topic) => topic.id)).toEqual(["concept::Q1"]);
  });
});
