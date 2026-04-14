/**
 * HTML fragments for IntelliSearch label rows (escaped + optional highlight).
 */

/**
 * Escapes text for safe insertion into `dangerouslySetInnerHTML`.
 *
 * @param text - Raw label text from the API
 * @returns Escaped string
 */
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Wraps the first case-insensitive occurrence of the query in bold + underline.
 *
 * @param text - Plain text to search within
 * @param query - User query (trimmed for matching)
 * @returns HTML string with a single highlighted span, or fully escaped text
 */
function underlineFirstMatch(text: string, query: string): string {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return escapeHtml(text);
  const matchStartIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase());
  if (matchStartIndex === -1) return escapeHtml(text);
  const before = escapeHtml(text.slice(0, matchStartIndex));
  const matched = escapeHtml(text.slice(matchStartIndex, matchStartIndex + trimmedQuery.length));
  const after = escapeHtml(text.slice(matchStartIndex + trimmedQuery.length));
  return `${before}<b><u>${matched}</u></b>${after}`;
}

/**
 * Picks the shortest alternative label that contains the query (case-insensitive).
 * Ties break on first occurrence in the original array order.
 *
 * @param alternatives - Synonyms from the labels API
 * @param query - Current search string
 * @returns The chosen synonym, or null if none match
 */
function pickMatchingAlternative(alternatives: string[] | undefined, query: string): string | null {
  if (!alternatives?.length) return null;
  const queryLowercase = query.trim().toLowerCase();
  if (!queryLowercase) return null;
  const matches = alternatives.filter((alternative) => alternative.toLowerCase().includes(queryLowercase));
  if (matches.length === 0) return null;
  return [...matches].sort((first, second) => {
    if (first.length !== second.length) return first.length - second.length;
    return alternatives.indexOf(first) - alternatives.indexOf(second);
  })[0];
}

/**
 * Builds the inner HTML for a label suggestion: preferred label, and when the
 * query matches only a synonym, appends a parenthetical synonym with the match
 * underlined inside it.
 *
 * @param value - Preferred label (`result.value`)
 * @param alternativeLabels - Optional `alternative_labels` from the API
 * @param query - Current input (debounced search string)
 * @returns HTML string safe for `dangerouslySetInnerHTML`
 */
export function buildLabelSuggestionHtml(value: string, alternativeLabels: string[] | undefined, query: string): string {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return escapeHtml(value);

  if (!value.toLowerCase().includes(trimmedQuery.toLowerCase())) {
    const matchingAlternative = pickMatchingAlternative(alternativeLabels, trimmedQuery);
    if (matchingAlternative) {
      return `${escapeHtml(value)} (${underlineFirstMatch(matchingAlternative, trimmedQuery)})`;
    }
  }

  return underlineFirstMatch(value, trimmedQuery);
}

/**
 * HTML for the "Search for …" row: underlines the query within the echoed term
 * (same visual treatment as label suggestions).
 *
 * @param searchTerm - Raw input (typically trimmed for the row)
 * @returns HTML string
 */
export function buildSearchForRowHtml(searchTerm: string): string {
  const trimmedSearchTerm = searchTerm.trim();
  return `Search for ${underlineFirstMatch(trimmedSearchTerm, trimmedSearchTerm)}`;
}
