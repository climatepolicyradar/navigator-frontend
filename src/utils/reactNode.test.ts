import { joinNodes } from "./reactNode";

describe("joinNodes", () => {
  it("joins multiple React nodes together", () => {
    expect(joinNodes(["one", "two", "three"], "+")).toEqual(["one", "+", "two", "+", "three"]);
  });

  it("handles an empty array", () => {
    expect(joinNodes([], "+")).toEqual([]);
  });

  it("handles an array with only null or undefined", () => {
    expect(joinNodes([null, undefined], "+")).toEqual([]);
  });

  it("removes falsy values except for 0", () => {
    expect(joinNodes(["one", null, "three", undefined, "", false, 0], "+")).toEqual(["one", "+", "three", "+", 0]);
  });
});
