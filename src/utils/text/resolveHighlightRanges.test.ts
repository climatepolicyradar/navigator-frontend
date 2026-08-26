import { describe, expect, it } from "vitest";

import { resolveHighlightRanges } from "./resolveHighlightRanges";

// "Climate adaptation and climate mitigation"
//  0      7 8        18 19  22
const TEXT = "Climate adaptation and climate mitigation";

describe("resolveHighlightRanges", () => {
  it("leaves ranges that do not overlap alone", () => {
    const ranges = [
      { start: 0, end: 7, className: "one" },
      { start: 8, end: 18, className: "two" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual(ranges);
  });

  it("returns the ranges in the order they appear in the text", () => {
    const ranges = [
      { start: 8, end: 18, className: "two" },
      { start: 0, end: 7, className: "one" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([
      { start: 0, end: 7, className: "one" },
      { start: 8, end: 18, className: "two" },
    ]);
  });

  it("starts a later range where the one it overlaps ends", () => {
    const ranges = [
      { start: 0, end: 7, className: "first" },
      { start: 4, end: 18, className: "second" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([
      { start: 0, end: 7, className: "first" },
      { start: 7, end: 18, className: "second" },
    ]);
  });

  it("ends a later range where the one it overlaps starts", () => {
    const ranges = [
      { start: 8, end: 18, className: "first" },
      { start: 0, end: 12, className: "second" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([
      { start: 0, end: 8, className: "second" },
      { start: 8, end: 18, className: "first" },
    ]);
  });

  it("splits a later range around one that sits inside it", () => {
    const ranges = [
      { start: 8, end: 18, className: "first" },
      { start: 0, end: 22, className: "second" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([
      { start: 0, end: 8, className: "second" },
      { start: 8, end: 18, className: "first" },
      { start: 18, end: 22, className: "second" },
    ]);
  });

  it("drops a later range entirely covered by an earlier one", () => {
    const ranges = [
      { start: 0, end: 18, className: "first" },
      { start: 4, end: 12, className: "second" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([{ start: 0, end: 18, className: "first" }]);
  });

  it("resolves a run of competing ranges by priority", () => {
    const ranges = [
      { start: 4, end: 8, className: "first" },
      { start: 0, end: 12, className: "second" },
      { start: 0, end: 22, className: "third" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([
      { start: 0, end: 4, className: "second" },
      { start: 4, end: 8, className: "first" },
      { start: 8, end: 12, className: "second" },
      { start: 12, end: 22, className: "third" },
    ]);
  });

  it("joins neighbouring positions claimed by the same highlight into one range", () => {
    const ranges = [
      { start: 0, end: 7, className: "same" },
      { start: 7, end: 18, className: "same" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([{ start: 0, end: 18, className: "same" }]);
  });

  it("clamps ranges to the bounds of the text", () => {
    const ranges = [
      { start: -5, end: 7, className: "one" },
      { start: 23, end: 999, className: "two" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([
      { start: 0, end: 7, className: "one" },
      { start: 23, end: TEXT.length, className: "two" },
    ]);
  });

  it("ignores zero-length and inverted ranges", () => {
    const ranges = [
      { start: 4, end: 4, className: "one" },
      { start: 12, end: 4, className: "two" },
    ];

    expect(resolveHighlightRanges(TEXT, ranges)).toEqual([]);
  });

  it("returns nothing for no ranges", () => {
    expect(resolveHighlightRanges(TEXT, [])).toEqual([]);
  });

  it("counts positions in code points so ranges stay aligned with astral characters", () => {
    // The emoji is one code point but two UTF-16 units, so a code unit count would slide the range
    const text = "a👍bc";

    expect(resolveHighlightRanges(text, [{ start: 2, end: 4, className: "one" }])).toEqual([{ start: 2, end: 4, className: "one" }]);
  });
});
