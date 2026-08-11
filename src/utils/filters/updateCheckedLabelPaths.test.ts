import { TFilterPathLabel } from "@/types";

import { sortFilterPathLabels } from "./filterPaths";
import { updateCheckedLabelPaths } from "./updateCheckedLabelPaths";

const createPathLabel = (value: string): TFilterPathLabel => ({
  id: `test::${value}`,
  type: "test",
  value,
});

describe("updateCheckedLabelPaths", () => {
  it("adds a filter when checked and none are currently checked", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [];
    const labelPath: TFilterPathLabel[] = [createPathLabel("self")];
    expect(updateCheckedLabelPaths(checkedLabelPaths, labelPath, true)).toEqual([[createPathLabel("self")]]);
  });

  it("removes the exact filter when unchecked", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("self")]];
    const labelPath: TFilterPathLabel[] = [createPathLabel("self")];
    expect(updateCheckedLabelPaths(checkedLabelPaths, labelPath, false)).toEqual([]);
  });

  it("leaves an already-checked sibling untouched when checking a filter", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("peer")]];
    const labelPath: TFilterPathLabel[] = [createPathLabel("self")];
    const expected = sortFilterPathLabels([[createPathLabel("peer")], [createPathLabel("self")]]);
    expect(updateCheckedLabelPaths(checkedLabelPaths, labelPath, true)).toEqual(expected);
  });

  it("leaves an already-checked ancestor untouched when checking a filter", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("parent")]];
    const labelPath: TFilterPathLabel[] = [createPathLabel("child"), createPathLabel("parent")];
    const expected = sortFilterPathLabels([[createPathLabel("parent")], [createPathLabel("child"), createPathLabel("parent")]]);
    expect(updateCheckedLabelPaths(checkedLabelPaths, labelPath, true)).toEqual(expected);
  });

  it("removes an already-checked child when checking its parent", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("child"), createPathLabel("parent")]];
    const labelPath: TFilterPathLabel[] = [createPathLabel("parent")];
    expect(updateCheckedLabelPaths(checkedLabelPaths, labelPath, true)).toEqual([[createPathLabel("parent")]]);
  });

  it("removes already-checked children when checking their parent", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [
      [createPathLabel("child 1"), createPathLabel("parent")],
      [createPathLabel("child 2"), createPathLabel("parent")],
    ];
    const labelPath: TFilterPathLabel[] = [createPathLabel("parent")];
    expect(updateCheckedLabelPaths(checkedLabelPaths, labelPath, true)).toEqual([[createPathLabel("parent")]]);
  });

  it("removes an already-checked grandchild when checking its grandparent", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("grandchild"), createPathLabel("child"), createPathLabel("parent")]];
    const labelPath: TFilterPathLabel[] = [createPathLabel("parent")];
    expect(updateCheckedLabelPaths(checkedLabelPaths, labelPath, true)).toEqual([[createPathLabel("parent")]]);
  });
});
