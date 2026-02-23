import { CLICKED_DOCUMENTS_COOKIE_NAME, CLICKED_DOCUMENTS_MAX_ITEMS } from "@/constants/cookies";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";

const COOKIE_MAX_ITEMS_DEFAULT = CLICKED_DOCUMENTS_MAX_ITEMS;

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    return [];
  }
}

/**
 * Reads the list of clicked document IDs (e.g. slugs) from the cookie.
 * Order is newest first. Length is at most the configured max.
 */
export function getClickedDocumentIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = getCookie(CLICKED_DOCUMENTS_COOKIE_NAME);
  return parseIds(raw);
}

/**
 * Appends a document ID to the clicked-documents cookie (newest first),
 * dedupes by id, and trims to the configured max. Does not clear the cookie.
 */
export function recordClickedDocument(documentId: string, options?: { maxItems?: number }): void {
  if (typeof window === "undefined") return;
  const id = documentId.trim();
  if (!id) return;

  const maxItems = options?.maxItems ?? COOKIE_MAX_ITEMS_DEFAULT;
  const existing = parseIds(getCookie(CLICKED_DOCUMENTS_COOKIE_NAME));
  const next = [id, ...existing.filter((x) => x !== id)].slice(0, maxItems);

  try {
    setCookie(CLICKED_DOCUMENTS_COOKIE_NAME, JSON.stringify(next), getDomain());
  } catch {
    // Ignore cookie write failures.
  }
}

/**
 * Clears all clicked document IDs from the cookie (used by "clear recently
 * viewed" UI).
 */
export function clearClickedDocumentIds(): void {
  if (typeof window === "undefined") return;
  try {
    setCookie(CLICKED_DOCUMENTS_COOKIE_NAME, JSON.stringify([]), getDomain());
  } catch {
    // Ignore cookie write failures.
  }
}
