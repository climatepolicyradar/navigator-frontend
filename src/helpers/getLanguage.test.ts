import { describe, expect, it } from "vitest";

import { getLanguage } from "./getLanguage";

describe("getLanguage", () => {
  it("resolves common ISO 639-3 codes", () => {
    expect(getLanguage("eng")).toBe("English");
    expect(getLanguage("fra")).toBe("French");
    expect(getLanguage("spa")).toBe("Spanish");
    expect(getLanguage("por")).toBe("Portuguese");
  });

  it("prefers overrides where the CLDR name is wrong or less precise", () => {
    expect(getLanguage("hbs")).toBe("Serbo-Croatian");
    expect(getLanguage("tgl")).toBe("Tagalog");
    expect(getLanguage("cmn")).toBe("Mandarin Chinese");
    expect(getLanguage("arb")).toBe("Standard Arabic");
  });

  it("covers codes CLDR cannot resolve", () => {
    // trunk-ignore(typos)
    expect(getLanguage("aas")).toBe("Aasáx");
    expect(getLanguage("psr")).toBe("Portuguese Sign Language");
    expect(getLanguage("kbt")).toBe("Abadi");
  });

  it("passes through values that are already names", () => {
    expect(getLanguage("English")).toBe("English");
    expect(getLanguage("Modern Greek (1453-)")).toBe("Modern Greek (1453-)");
  });

  it("passes through values that are already names", () => {
    expect(getLanguage("English")).toBe("English");
    expect(getLanguage("Modern Greek (1453-)")).toBe("Modern Greek (1453-)");
  });

  it("falls back to the key when there is no name", () => {
    expect(getLanguage("")).toBe("");
    expect(getLanguage("zzz")).toBe("zzz");
    expect(getLanguage("Kalaallisut")).toBe("Kalaallisut");
  });
});
