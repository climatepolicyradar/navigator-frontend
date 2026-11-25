import { describe, expect, it } from "vitest";

import { TTheme } from "@/types";

import { getCanonicalSite, getDocumentSites, getSiteDecision } from "./getDocumentSites";
import themes from "../../themes";

const noLabels: string[] = [];

describe("a category no theme serves", () => {
  const document = { categories: ["Corporate Disclosure" as const], labelIds: noLabels };

  it("is served by no site", () => {
    expect(getDocumentSites(document)).toEqual([]);
  });

  it("has a null canonical", () => {
    expect(getCanonicalSite(document)).toBeNull();
  });

  it("is not found rather than redirected to the app", () => {
    expect(getSiteDecision(document, "cclw", "/document/x")).toEqual({ action: "not_found" });
  });
});

describe("getDocumentSites against real theme configs", () => {
  it("Grantham law appears on cclw and cpr, canonical cclw", () => {
    const document = { categories: ["Law" as const], labelIds: noLabels };
    expect(getDocumentSites(document).sort()).toEqual(["cclw", "cpr"]);
    expect(getCanonicalSite(document)).toBe("cclw");
  });

  it("Sabin litigation appears on ccc only, canonical ccc", () => {
    const document = { categories: ["Litigation" as const], labelIds: noLabels };
    expect(getDocumentSites(document).sort()).toEqual(["ccc"]);
    expect(getCanonicalSite(document)).toBe("ccc");
  });

  it("an MCF project appears on mcf and cpr, canonical cpr", () => {
    const document = { categories: ["Multilateral Climate Fund project" as const], labelIds: noLabels };
    expect(getDocumentSites(document).sort()).toEqual(["cpr", "mcf"]);
    expect(getCanonicalSite(document)).toBe("cpr");
  });

  it("UNCBD submission currently appears on cclw and cpr, which is FUS-976", () => {
    const document = { categories: ["UN submission" as const], labelIds: noLabels };
    expect(getDocumentSites(document).sort()).toEqual(["cclw", "cpr"]);
    expect(getCanonicalSite(document)).toBe("cclw");
  });

  it("a Global Stocktake document is also a UN submission, which is what keeps it on cclw", () => {
    const document = { categories: ["Global Stocktake" as const, "UN submission" as const], labelIds: noLabels };
    expect(themes.cclw.searchCategories).not.toContain("Global Stocktake");
    expect(getDocumentSites(document).sort()).toEqual(["cclw", "cpr"]);
    expect(getCanonicalSite(document)).toBe("cclw");
  });

  it("excluding the convention on cclw moves the canonical to cpr, which is FUS-977", () => {
    const document = { categories: ["UN submission" as const], labelIds: ["author_type::Non-Party"] };
    expect(getDocumentSites(document).sort()).toEqual(["cpr"]);
    expect(getCanonicalSite(document)).toBe("cpr");
  });
});

describe("is searchExcludeLabels enough on its own", () => {
  const sitesByExcludesOnly = (labelIds: string[]): TTheme[] => {
    return (Object.keys(themes) as TTheme[]).filter((theme) => !themes[theme].searchExcludeLabels.some(({ id }) => labelIds.includes(id)));
  };

  it("excludes alone put every document on every site", () => {
    expect(sitesByExcludesOnly(noLabels).sort()).toEqual(["ccc", "cclw", "cpr", "mcf"]);
  });

  it("searchCategories is what actually keeps litigation off cclw and cpr", () => {
    expect(themes.cclw.searchCategories).not.toContain("Litigation");
    expect(themes.cpr.searchCategories).not.toContain("Litigation");
  });
});
