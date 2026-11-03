import { describe, expect, it } from "vitest";

import { IDocumentLabelRelationship, TSearchExcludeLabel } from "@/types";

import { getDirectLinkPolicy } from "./getDirectLinkPolicy";

const label = (id: string): IDocumentLabelRelationship => ({
  type: id.split("::")[0],
  value: { id, type: id.split("::")[0], value: id.split("::")[1] },
  count: null,
  timestamp: null,
});

describe("getDirectLinkPolicy", () => {
  it("returns null when no labels match", () => {
    const searchExcludeLabels: TSearchExcludeLabel[] = [{ id: "author_type::Non-Party", onDirectLink: { action: "not_found" } }];
    expect(getDirectLinkPolicy([label("category::Law")], searchExcludeLabels)).toBeNull();
  });

  it("returns the not_found policy for a matching label", () => {
    const searchExcludeLabels: TSearchExcludeLabel[] = [{ id: "author_type::Non-Party", onDirectLink: { action: "not_found" } }];
    expect(getDirectLinkPolicy([label("author_type::Non-Party")], searchExcludeLabels)).toEqual({ action: "not_found" });
  });

  it("returns the redirect policy for a matching label", () => {
    const searchExcludeLabels: TSearchExcludeLabel[] = [
      { id: "author_type::Non-Party", onDirectLink: { action: "redirect", to: "https://app.climatepolicyradar.org/document/{id}" } },
    ];

    expect(getDirectLinkPolicy([label("author_type::Non-Party")], searchExcludeLabels)).toEqual({
      action: "redirect",
      to: "https://app.climatepolicyradar.org/document/{id}",
    });
  });

  it("uses the first matching label in config order when there are multiple matches", () => {
    const searchExcludeLabels: TSearchExcludeLabel[] = [
      { id: "author_type::Non-Party", onDirectLink: { action: "not_found" } },
      { id: "category::Litigation", onDirectLink: { action: "redirect", to: "https://example.com/{id}" } },
    ];

    expect(getDirectLinkPolicy([label("author_type::Non-Party"), label("category::Litigation")], searchExcludeLabels)).toEqual({
      action: "not_found",
    });
  });
});
