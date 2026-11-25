import { describe, expect, it } from "vitest";

import { TNestedSearchLabel } from "@/types";
import { pruneTaxonomy } from "@/utils/filters/pruneTaxonomy";

const label = (id: string, count: number, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id,
  type: id.split("::")[0],
  value: id.split("::")[1],
  alternative_labels: [],
  count,
  children,
});

describe("pruneTaxonomy", () => {
  it("keeps an uncounted parent whose descendant is counted", () => {
    const region = label("region::SSF", 0, [label("country::AGO", 12)]);
    expect(pruneTaxonomy([region, label("concept::Q1", 3)])).toEqual([region, label("concept::Q1", 3)]);
  });

  it("keeps an uncounted parent whose counted descendant is nested deeply", () => {
    const region = label("region::SSF", 0, [label("country::AGO", 0, [label("subdivision::AO-BGO", 4)])]);
    expect(pruneTaxonomy([region, label("concept::Q1", 3)])).toEqual([region, label("concept::Q1", 3)]);
  });

  it("removes a subtree nothing is counted against", () => {
    const empty = label("region::EAS", 0, [label("country::JPN", 0)]);
    expect(pruneTaxonomy([empty, label("concept::Q1", 3)])).toEqual([label("concept::Q1", 3)]);
  });

  it("removes an uncounted child from a counted parent", () => {
    const country = label("country::AGO", 12, [label("subdivision::AO-BGO", 0)]);
    expect(pruneTaxonomy([country])).toEqual([label("country::AGO", 12)]);
  });

  it("returns the labels untouched when nothing is counted at all", () => {
    const labels = [label("region::SSF", 0, [label("country::AGO", 0)])];
    expect(pruneTaxonomy(labels)).toEqual(labels);
  });

  it("treats a missing count as zero", () => {
    const countless = { ...label("group::region", 0) };
    delete countless.count;
    expect(pruneTaxonomy([countless, label("concept::Q1", 3)])).toEqual([label("concept::Q1", 3)]);
  });
});
