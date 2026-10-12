import { TFilterPathLabel } from "@/types";

import { getLabelPathSignature } from "./filterPaths";
import { isFilterVisible } from "./isFilterVisible";

const createPathLabel = (value: string): TFilterPathLabel => ({
  id: `test::${value}`,
  type: "test",
  value,
});

describe("isFilterVisible", () => {
  const pathLabels: TFilterPathLabel[] = [createPathLabel("self"), createPathLabel("parent")];

  it("returns true when isFiltered is true", () => {
    expect(isFilterVisible(pathLabels, [], true)).toBe(true);
  });

  it("returns true when the filter matches", () => {
    const matchingLabelPathSignatures = [getLabelPathSignature([createPathLabel("self"), createPathLabel("parent")])];
    expect(isFilterVisible(pathLabels, matchingLabelPathSignatures, false)).toBe(true);
  });

  it("returns true when a child filter matches", () => {
    const matchingLabelPathSignatures = [getLabelPathSignature([createPathLabel("child"), createPathLabel("self"), createPathLabel("parent")])];
    expect(isFilterVisible(pathLabels, matchingLabelPathSignatures, false)).toBe(true);
  });

  it("returns true when an ancestor filter matches", () => {
    const matchingLabelPathSignatures = [getLabelPathSignature([createPathLabel("parent")])];
    expect(isFilterVisible(pathLabels, matchingLabelPathSignatures, false)).toBe(true);
  });

  it("returns false with no direct, ancestor, or child match", () => {
    const matchingLabelPathSignatures = [
      getLabelPathSignature([createPathLabel("peer"), createPathLabel("parent")]),
      getLabelPathSignature([createPathLabel("selfish"), createPathLabel("parent")]),
      getLabelPathSignature([createPathLabel("other")]),
    ];
    expect(isFilterVisible(pathLabels, matchingLabelPathSignatures, false)).toBe(false);
  });
});
