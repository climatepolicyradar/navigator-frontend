import { joinTailwindClasses } from "./tailwind";

describe("joinTailwindClasses", () => {
  it("joins multiple class strings", () => {
    expect(joinTailwindClasses(["md-5"])).toBe("md-5");
    expect(joinTailwindClasses(["md-5", "bg-text-primary"])).toBe("md-5 bg-text-primary");
  });

  it("handles empty strings", () => {
    expect(joinTailwindClasses([undefined])).toBe("");
    expect(joinTailwindClasses(["", "text-md"])).toBe("text-md");
  });

  it("handles whitespace trimming", () => {
    expect(joinTailwindClasses([" underline  "])).toBe("underline");
  });
});
