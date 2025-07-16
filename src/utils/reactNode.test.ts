import { joinNodes } from "./reactNode";

describe("joinNodes", () => {
  it("joins multiple React nodes together", () => {
    expect(joinNodes(["one", "two", "three"], "+")).toEqual(["one", "+", "two", "+", "three"]);
  });

  it("handles an empty array", () => {
    expect(joinNodes([], "+")).toEqual([]);
  });
});
