import { Fragment } from "react";

import { joinNodes } from "./reactNode";

describe("joinNodes", () => {
  const plus = (index: number) => <Fragment key={`join-${index}`}>+</Fragment>;

  it("joins multiple React nodes together", () => {
    expect(joinNodes(["one", "two", "three"], "+")).toEqual(["one", plus(0), "two", plus(1), "three"]);
  });

  it("handles an empty array", () => {
    expect(joinNodes([], "+")).toEqual([]);
  });

  it("handles an array with only null or undefined", () => {
    expect(joinNodes([null, undefined], "+")).toEqual([]);
  });

  it("removes falsy values except for 0", () => {
    expect(joinNodes(["one", null, "three", undefined, "", false, 0], "+")).toEqual(["one", plus(0), "three", plus(1), 0]);
  });
});
