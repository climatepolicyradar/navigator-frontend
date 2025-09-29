import { getLanguage } from "./getLanguage";

describe("getLanguage", () => {
  it('returns "en-US" when header is undefined', () => {
    expect(getLanguage(undefined)).toBe("en-US");
  });

  it("returns the first language when header is a simple string", () => {
    expect(getLanguage("fr-CA,fr;q=0.9,en;q=0.8")).toBe("fr-CA");
  });

  it("returns the first language when header is a single language", () => {
    expect(getLanguage("de-DE")).toBe("de-DE");
  });

  it("trims whitespace from the language code", () => {
    expect(getLanguage("  it-IT ,it;q=0.9")).toBe("it-IT");
  });

  it('returns "en-US" when header is an empty string', () => {
    expect(getLanguage("")).toBe("en-US");
  });

  it("returns the first language even if q-values are present", () => {
    expect(getLanguage("nl-NL;q=0.7,en-US;q=0.3")).toBe("nl-NL;q=0.7");
  });
});
