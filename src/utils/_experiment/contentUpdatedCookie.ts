import { CONTENT_UPDATED_COOKIE_NAME, CONTENT_UPDATED_MAX_ITEMS } from "@/constants/cookies";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";

// sessionStorage key: slug just returned from (set by result page on leave).
export const SHADOW_SEARCH_RETURNED_SLUG_KEY = "shadow-search-returned-slug";

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
 * Reads the list of document IDs (slugs) for which we show "Content for X"
 * (only after the user has returned to the shadow search page once).
 */
export function getContentUpdatedIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = getCookie(CONTENT_UPDATED_COOKIE_NAME);
  return parseIds(raw);
}

/**
 * Appends a slug to the content-updated cookie. Call when user has returned
 * to shadow search from a result page they had already viewed.
 */
export function addContentUpdatedDocument(documentId: string, options?: { maxItems?: number }): void {
  if (typeof window === "undefined") return;
  const id = documentId.trim();
  if (!id) return;

  const maxItems = options?.maxItems ?? CONTENT_UPDATED_MAX_ITEMS;
  const existing = parseIds(getCookie(CONTENT_UPDATED_COOKIE_NAME));
  const next = [id, ...existing.filter((x) => x !== id)].slice(0, maxItems);

  try {
    setCookie(CONTENT_UPDATED_COOKIE_NAME, JSON.stringify(next), getDomain());
  } catch {
    // Ignore cookie write failures.
  }
}
