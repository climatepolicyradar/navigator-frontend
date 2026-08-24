import { toSearchableText } from "@/utils/text/toSearchableText";

// Adds styling to the first case-insensitive, diacritic-insensitive match in the given text
export const addSubStringHighlights = (text: string, match: string, className: string) => {
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

  const searchableMatch = toSearchableText(match);
  const matchIndex = searchableMatch === "" ? -1 : searchableText.indexOf(searchableMatch);
  if (matchIndex === -1) return text;

  const originalStart = originalIndexForSearchableIndex[matchIndex];
  const originalEnd = originalIndexForSearchableIndex[matchIndex + searchableMatch.length - 1] + 1;

  const beforeMatch = chars.slice(0, originalStart).join("");
  const matchText = chars.slice(originalStart, originalEnd).join("");
  const afterMatch = chars.slice(originalEnd).join("");

  return (
    <>
      {beforeMatch.length > 0 && beforeMatch}
      <span className={className}>{matchText}</span>
      {afterMatch.length > 0 && afterMatch}
    </>
  );
};
