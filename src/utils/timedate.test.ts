import { formatDateShort } from "./timedate";

describe("formatDateShort", () => {
  const date = new Date("2021-09-16T00:00:00Z");

  it("by default returns a US short date", () => {
    expect(formatDateShort(date)).toBe("09/16/2021");
  });

  it("returns a GB short date", () => {
    expect(formatDateShort(date, "en-GB")).toBe("16/09/2021");
  });

  it("returns a US short date", () => {
    expect(formatDateShort(date, "en-US")).toBe("09/16/2021");
  });

  it("returns a DE short date", () => {
    expect(formatDateShort(date, "de-DE")).toBe("16.09.2021");
  });

  it("returns an empty string for invalid dates", () => {
    expect(formatDateShort(new Date("invalid"))).toBe("");
  });
});
