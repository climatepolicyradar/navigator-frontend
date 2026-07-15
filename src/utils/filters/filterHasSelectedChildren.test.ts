import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

import { filterHasSelectedChildren } from "./filterHasSelectedChildren";

const createPathLabel = (value: string): TFilterPathLabel => ({
  id: `test::${value}`,
  type: "test",
  value,
});

describe("filterHasSelectedChildren", () => {
  const selfLabel: TNestedSearchLabel = {
    id: "test::self",
    type: "test",
    value: "self",
    children: [],
  };

  it("returns false with no selected filters", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [];
    const ancestorPath: TFilterPathLabel[] = [];
    expect(filterHasSelectedChildren(checkedLabelPaths, ancestorPath, selfLabel)).toBe(false);
  });

  it("returns false with only this filter selected", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("self")]];
    const ancestorPath: TFilterPathLabel[] = [];
    expect(filterHasSelectedChildren(checkedLabelPaths, ancestorPath, selfLabel)).toBe(false);
  });

  it("returns false with a peer filter selected", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("peer")]];
    const ancestorPath: TFilterPathLabel[] = [];
    expect(filterHasSelectedChildren(checkedLabelPaths, ancestorPath, selfLabel)).toBe(false);
  });

  it("returns false with a parent filter selected", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("parent")]];
    const ancestorPath: TFilterPathLabel[] = [createPathLabel("parent")];
    expect(filterHasSelectedChildren(checkedLabelPaths, ancestorPath, selfLabel)).toBe(false);
  });

  it("returns true with one child filter selected", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [[createPathLabel("child"), createPathLabel("self"), createPathLabel("parent")]];
    const ancestorPath: TFilterPathLabel[] = [createPathLabel("parent")];
    expect(filterHasSelectedChildren(checkedLabelPaths, ancestorPath, selfLabel)).toBe(true);
  });

  it("returns true with two child filters selected", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [
      [createPathLabel("child 1"), createPathLabel("self"), createPathLabel("parent")],
      [createPathLabel("child 2"), createPathLabel("self"), createPathLabel("parent")],
    ];
    const ancestorPath: TFilterPathLabel[] = [createPathLabel("parent")];
    expect(filterHasSelectedChildren(checkedLabelPaths, ancestorPath, selfLabel)).toBe(true);
  });

  it("returns true with a grandchild filter selected", () => {
    const checkedLabelPaths: TFilterPathLabel[][] = [
      [createPathLabel("grandchild"), createPathLabel("child"), createPathLabel("self"), createPathLabel("parent")],
    ];
    const ancestorPath: TFilterPathLabel[] = [createPathLabel("parent")];
    expect(filterHasSelectedChildren(checkedLabelPaths, ancestorPath, selfLabel)).toBe(true);
  });
});
