import { describe, expect, it } from "vitest";

import { buildLabelSuggestionHtml, buildSearchForRowHtml } from "./intellisearchLabelHtml";

describe("buildLabelSuggestionHtml", () => {
  it("highlights within the preferred label when the query matches it", () => {
    const html = buildLabelSuggestionHtml("Marine toxins", ["algae bloom"], "marine");
    expect(html).toContain("<b><u>Marine</u></b>");
    expect(html).not.toContain("(");
  });

  it("shows a parenthetical synonym when the query matches only an alternative", () => {
    const html = buildLabelSuggestionHtml("marine risk", ["marine toxins", "algae bloom", "algal blooms"], "algae");
    expect(html).toContain("marine risk");
    expect(html).toContain("(");
    expect(html).toContain("<b><u>algae</u></b>");
    expect(html).toContain("bloom");
  });

  it("prefers the shortest matching alternative", () => {
    const html = buildLabelSuggestionHtml("x", ["algae bloom", "algae"], "algae");
    expect(html).toMatch(/\(.*<b><u>algae<\/u><\/b>\)/);
    expect(html).not.toContain("algae bloom");
  });

  it("escapes HTML metacharacters in labels", () => {
    const html = buildLabelSuggestionHtml("a & b", [], "a");
    expect(html).toContain("&amp;");
  });
});

describe("buildSearchForRowHtml", () => {
  it("bolds the echoed search term without underline", () => {
    const html = buildSearchForRowHtml("climate");
    expect(html).toBe("Search for <b>climate</b>");
  });

  it("escapes HTML in the search term", () => {
    const html = buildSearchForRowHtml("a <script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});
