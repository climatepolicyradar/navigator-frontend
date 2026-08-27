import { addHighlights } from "@/utils/text/addHighlights";
import { findSubStringMatches } from "@/utils/text/findSubStringMatches";

// Adds styling to the first case-insensitive, diacritic-insensitive match in the given text
export const addSubStringHighlights = (text: string, match: string, className: string) => {
  const [firstMatch] = findSubStringMatches(text, match);
  if (!firstMatch) return text;

  return addHighlights(text, [{ ...firstMatch, className }]);
};
