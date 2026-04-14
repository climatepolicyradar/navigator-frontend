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
  const q = query.trim();
  if (!q) return escapeHtml(text);
  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return escapeHtml(text);
  const before = escapeHtml(text.slice(0, idx));
  const matched = escapeHtml(text.slice(idx, idx + q.length));
  const after = escapeHtml(text.slice(idx + q.length));
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
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const matches = alternatives.filter((a) => a.toLowerCase().includes(q));
  if (matches.length === 0) return null;
  return [...matches].sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    return alternatives.indexOf(a) - alternatives.indexOf(b);
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
  const q = query.trim();
  if (!q) return escapeHtml(value);

  const matchInPreferred = value.toLowerCase().includes(q.toLowerCase());
  if (matchInPreferred) {
    return underlineFirstMatch(value, q);
  }

  const alt = pickMatchingAlternative(alternativeLabels, q);
  if (alt) {
    return `${escapeHtml(value)} (${underlineFirstMatch(alt, q)})`;
  }

  return underlineFirstMatch(value, q);
}

/**
 * HTML for the "Search for …" row: bold echoed term only (no underline; that is
 * reserved for label suggestions).
 *
 * @param searchTerm - Raw input (typically trimmed for the row)
 * @returns HTML string
 */
export function buildSearchForRowHtml(searchTerm: string): string {
  const t = searchTerm.trim();
  return `Search for <b>${escapeHtml(t)}</b>`;
}
