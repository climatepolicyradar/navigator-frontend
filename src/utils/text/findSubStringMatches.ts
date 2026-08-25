import { toSearchableText } from "@/utils/text/toSearchableText";

export type TSubStringMatch = {
  start: number;
  end: number;
};

// Finds every case-insensitive, diacritic-insensitive occurrence of the match in the given
// text. Positions are code point indices into the original text, so they line up with the
// character offsets the passage API reports for its labels.
export const findSubStringMatches = (text: string, match: string): TSubStringMatch[] => {
  const searchableMatch = toSearchableText(match);
  if (searchableMatch === "") return [];

  const chars = Array.from(text);

  // Some replacements (e.g. ß -> ss) change the character count, so track which original
  // character each searchable character came from to keep highlight boundaries aligned
  let searchableText = "";
  const originalIndexForSearchableIndex: number[] = [];
  chars.forEach((char, originalIndex) => {
    const searchableChar = toSearchableText(char);
    searchableText += searchableChar;
    for (let i = 0; i < searchableChar.length; i++) originalIndexForSearchableIndex.push(originalIndex);
  });

  const matches: TSubStringMatch[] = [];
  let searchFrom = 0;

  while (searchFrom <= searchableText.length) {
    const matchIndex = searchableText.indexOf(searchableMatch, searchFrom);
    if (matchIndex === -1) break;

    matches.push({
      start: originalIndexForSearchableIndex[matchIndex],
      end: originalIndexForSearchableIndex[matchIndex + searchableMatch.length - 1] + 1,
    });
    // Resuming after the hit rather than inside it keeps the matches non-overlapping
    searchFrom = matchIndex + searchableMatch.length;
  }

  return matches;
};
