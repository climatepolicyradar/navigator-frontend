import { TNestedSearchLabel } from "@/types";

import { flattenNestedLabels } from "./flattenNestedLabels";

const makeLabel = (id: string, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id,
  type: "concept",
  value: id,
  children,
});

describe("flattenNestedLabels", () => {
  it("changes nothing if the labels have no children", () => {
    const labels = [makeLabel("a"), makeLabel("b")];

    const result = flattenNestedLabels(labels);

    expect(result).toEqual(labels);
  });

  it("flattens children 1 level deep", () => {
    const labels = [makeLabel("a", [makeLabel("a1"), makeLabel("a2")]), makeLabel("b")];

    const result = flattenNestedLabels(labels);

    expect(result.map((label) => label.id)).toEqual(["a", "a1", "a2", "b"]);
  });

  it("flattens children multiple levels deep", () => {
    const labels = [makeLabel("a", [makeLabel("a1", [makeLabel("a1a"), makeLabel("a1b", [makeLabel("a1b1")])])]), makeLabel("b")];

    const result = flattenNestedLabels(labels);

    expect(result.map((label) => label.id)).toEqual(["a", "a1", "a1a", "a1b", "a1b1", "b"]);
  });
});
