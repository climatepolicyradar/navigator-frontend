import { describe, expect, it } from "vitest";

import { findSubStringMatches } from "./findSubStringMatches";

describe("findSubStringMatches", () => {
  it("finds a single match", () => {
    expect(findSubStringMatches("Documents", "cum")).toEqual([{ start: 2, end: 5 }]);
  });

  it("finds every occurrence of the match", () => {
    const text = "Climate adaptation and climate mitigation";

    expect(findSubStringMatches(text, "climate")).toEqual([
      { start: 0, end: 7 },
      { start: 23, end: 30 },
    ]);
  });

  it("returns no matches when the text does not contain the match", () => {
    expect(findSubStringMatches("Documents", "policy")).toEqual([]);
  });

  it("returns no matches for an empty match", () => {
    expect(findSubStringMatches("Documents", "")).toEqual([]);
  });

  it("resumes the search after each hit, so matches never overlap", () => {
    expect(findSubStringMatches("aaaa", "aa")).toEqual([
      { start: 0, end: 2 },
      { start: 2, end: 4 },
    ]);
  });

  it("matches non-expanding diacritics when the search term omits them", () => {
    expect(findSubStringMatches("Seyðisfjörður", "fjor")).toEqual([{ start: 6, end: 10 }]);
  });

  it("keeps positions aligned when the text contains an expanding character (ß)", () => {
    // "Straße" searches as "strasse", so the match spans "aße" rather than the four
    // characters the searchable text would suggest
    expect(findSubStringMatches("Straße", "asse")).toEqual([{ start: 3, end: 6 }]);
  });

  it("finds matches either side of an expanding character", () => {
    const text = "Straße und Straße";

    expect(findSubStringMatches(text, "straße")).toEqual([
      { start: 0, end: 6 },
      { start: 11, end: 17 },
    ]);
  });
});
