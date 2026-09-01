import { THighlightRange } from "@/utils/text/addHighlights";

// Highlights cannot overlap
// Any highlight with a range that overlaps another will highlight only a distinct range
export const resolveHighlightRanges = (text: string, ranges: THighlightRange[]): THighlightRange[] => {
  const length = Array.from(text).length;
  const claimedBy: (string | null)[] = new Array(length).fill(null);

  // 1. Identify which highlight claims each character
  // This is more optimal than handling the 5 cases of overlaps
  // (no overlap, overlaps the front, sits entirely inside, overlaps the back, entirely swallows)
  ranges.forEach(({ start, end, className }) => {
    for (let index = Math.max(0, start); index < Math.min(end, length); index++) {
      if (claimedBy[index] === null) claimedBy[index] = className;
    }
  });

  // 2. Resolve the claimed characters into distinct ranges
  const resolved: THighlightRange[] = [];
  claimedBy.forEach((className, index) => {
    if (className === null) return;

    const previous = resolved.at(-1);
    if (previous?.className === className && previous.end === index) previous.end = index + 1;
    else resolved.push({ start: index, end: index + 1, className });
  });

  return resolved;
};
