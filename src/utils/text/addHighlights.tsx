import { ReactNode } from "react";

export type THighlightRange = {
  start: number;
  end: number;
  className: string;
};

// Adds styling to every given range of the text. Ranges are positions in the original text
// rather than replacements applied in turn, so any number of them can be highlighted at once
// Important: no overlapping highlights
export const addHighlights = (text: string, ranges: THighlightRange[]) => {
  const chars = Array.from(text);

  const rangesToHighlight = ranges
    .map(({ start, end, className }) => ({
      start: Math.max(0, Math.min(start, chars.length)),
      end: Math.max(0, Math.min(end, chars.length)),
      className,
    }))
    .filter(({ start, end }) => end > start)
    .sort((a, b) => a.start - b.start);

  if (rangesToHighlight.length === 0) return text;

  const segments: ReactNode[] = [];
  let cursor = 0;

  rangesToHighlight.forEach(({ start, end, className }) => {
    // Starting from the cursor keeps the text intact even if a caller passes overlapping ranges
    const from = Math.max(start, cursor);
    if (from >= end) return;

    if (from > cursor) segments.push(chars.slice(cursor, from).join(""));
    segments.push(
      <span key={from} className={className}>
        {chars.slice(from, end).join("")}
      </span>
    );
    cursor = end;
  });

  if (cursor < chars.length) segments.push(chars.slice(cursor).join(""));

  return <>{segments}</>;
};
