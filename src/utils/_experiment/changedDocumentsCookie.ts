import { CHANGED_DOCUMENTS_COOKIE_NAME, CHANGED_DOCUMENTS_MAX_ITEMS } from "@/constants/cookies";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";

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
 * Reads the list of document IDs (slugs) that have "changed" since last view.
 * Drives the inbox notification badge.
 */
export function getChangedDocumentIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = getCookie(CHANGED_DOCUMENTS_COOKIE_NAME);
  return parseIds(raw);
}

/**
 * Appends a document ID to the changed-documents cookie (newest first),
 * dedupes and trims to max. Call when we show "title" content (repeat visit).
 */
export function addChangedDocument(documentId: string, options?: { maxItems?: number }): void {
  if (typeof window === "undefined") return;
  const id = documentId.trim();
  if (!id) return;

  const maxItems = options?.maxItems ?? CHANGED_DOCUMENTS_MAX_ITEMS;
  const existing = parseIds(getCookie(CHANGED_DOCUMENTS_COOKIE_NAME));
  const next = [id, ...existing.filter((x) => x !== id)].slice(0, maxItems);

  try {
    setCookie(CHANGED_DOCUMENTS_COOKIE_NAME, JSON.stringify(next), getDomain());
    if (typeof window !== "undefined") {
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent("shadow-search-changed-updated"));
      });
    }
  } catch {
    // Ignore cookie write failures.
  }
}

/**
 * Removes a single document ID from the changed-documents cookie.
 * Call when the user clicks that notification to go to the doc.
 */
export function removeChangedDocument(documentId: string): void {
  if (typeof window === "undefined") return;
  const id = documentId.trim();
  if (!id) return;

  const existing = parseIds(getCookie(CHANGED_DOCUMENTS_COOKIE_NAME));
  const next = existing.filter((x) => x !== id);

  try {
    setCookie(CHANGED_DOCUMENTS_COOKIE_NAME, JSON.stringify(next), getDomain());
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent("shadow-search-changed-updated"));
    });
  } catch {
    // Ignore.
  }
}

/**
 * Clears the changed-documents cookie (e.g. when user clicks "Dismiss all").
 */
export function clearChangedDocuments(): void {
  if (typeof window === "undefined") return;
  try {
    setCookie(CHANGED_DOCUMENTS_COOKIE_NAME, "[]", getDomain());
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent("shadow-search-changed-updated"));
    });
  } catch {
    // Ignore.
  }
}
