export type THighlightRange = {
  start: number;
  end: number;
  className: string;
};

const joinClassNames = (classNames: string[]) => classNames.join(" ");

// Adds styling to every given range of the text. Ranges are positions in the original text
// rather than replacements applied in turn, so any number of them can be highlighted at once.
// Where ranges overlap, the overlap becomes a segment of its own carrying every class that
// covers it; `resolveClassName` decides what that shared segment is styled with.
export const addHighlights = (text: string, ranges: THighlightRange[], resolveClassName: (classNames: string[]) => string = joinClassNames) => {
  const chars = Array.from(text);

  const rangesToHighlight = ranges
    .map(({ start, end, className }) => ({
      start: Math.max(0, Math.min(start, chars.length)),
      end: Math.max(0, Math.min(end, chars.length)),
      className,
    }))
    .filter(({ start, end }) => end > start);

  if (rangesToHighlight.length === 0) return text;

  // Splitting at every boundary gives each overlap its own segment, so no segment is ever
  // covered by only part of a range
  const boundaries = [...new Set([0, chars.length, ...rangesToHighlight.flatMap(({ start, end }) => [start, end])])].sort((a, b) => a - b);

  const segments = boundaries.slice(0, -1).map((from, index) => {
    const to = boundaries[index + 1];
    const segmentText = chars.slice(from, to).join("");
    const classNames = [...new Set(rangesToHighlight.filter((range) => range.start <= from && range.end >= to).map(({ className }) => className))];

    if (classNames.length === 0) return segmentText;
    return (
      <span key={from} className={resolveClassName(classNames)}>
        {segmentText}
      </span>
    );
  });

  return <>{segments}</>;
};
