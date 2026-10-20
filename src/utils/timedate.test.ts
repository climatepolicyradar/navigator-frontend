import { formatDateShort, getYear } from "./timedate";

describe("getYear", () => {
  it("reads the year from an ISO date", () => {
    expect(getYear("2023-11-30")).toBe(2023);
  });

  it("reads the year from an ISO datetime", () => {
    expect(getYear("2019-03-14T00:00:00Z")).toBe(2019);
    expect(getYear("2019-03-14T00:00:00.123456Z")).toBe(2019);
  });

  it("reads the year from a DD/MM/YYYY date", () => {
    expect(getYear("01/01/2020")).toBe(2020);
  });

  it("does not shift the year across time zones", () => {
    expect(getYear("2020-01-01T00:00:00+05:00")).toBe(2020);
  });

  it("returns null for a missing date", () => {
    expect(getYear(null)).toBeNull();
    expect(getYear("")).toBeNull();
  });

  it("returns null for an unparsable date", () => {
    expect(getYear("not a date")).toBeNull();
    expect(getYear("2023")).toBeNull();
  });
});

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
