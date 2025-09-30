import { formatDateShort } from "./timedate";

describe("formatDateShort", () => {
  let languageGetter;
  const date = new Date("2021-09-16T00:00:00Z");

  beforeEach(() => {
    languageGetter = vi.spyOn(window.navigator, "language", "get");
  });

  it("returns a GB short date", () => {
    languageGetter.mockReturnValue("en-GB");
    expect(formatDateShort(date)).toBe("16/09/2021");
  });

  it("returns a US short date", () => {
    languageGetter.mockReturnValue("en-US");
    expect(formatDateShort(date)).toBe("09/16/2021");
  });

  it("returns a DE short date", () => {
    languageGetter.mockReturnValue("de-DE");
    expect(formatDateShort(date)).toBe("16.09.2021");
  });

  it("returns an empty string for invalid dates", () => {
    expect(formatDateShort(new Date("invalid"))).toBe("");
  });
});
