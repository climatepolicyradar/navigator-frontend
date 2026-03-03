import { useCallback, useEffect, useState } from "react";

import { COOKIE_CONSENT_NAME, SEARCH_HISTORY_COOKIE_NAME } from "@/constants/cookies";
import { SelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";
import { getCookie, setCookie, deleteCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";

const SESSION_STORAGE_KEY = "navigator-search-history";
const DEFAULT_MAX_ITEMS = 20;
// Cookie ~4KB limit: cap items and length so payload stays safe.
const COOKIE_MAX_ITEMS = 10;
const COOKIE_MAX_CHARS_PER_TERM = 80;

// One entry in search history: term plus optional filters and string-only flag.
export interface SearchHistoryItem {
  term: string;
  filters?: SelectedFilters;
  wasStringOnly?: boolean;
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return getCookie(COOKIE_CONSENT_NAME) === "true";
}

function parseHistory(raw: string | null): SearchHistoryItem[] {
  if (!raw) return [];
  try {
    // Parse legacy string[] or full SearchHistoryItem[] from JSON.
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x): SearchHistoryItem | null => {
        if (typeof x === "string") return { term: x.trim() };
        if (x && typeof x === "object" && "term" in x && typeof (x as SearchHistoryItem).term === "string") {
          const item = x as SearchHistoryItem;
          return { term: item.term.trim(), filters: item.filters, wasStringOnly: item.wasStringOnly };
        }
        return null;
      })
      .filter((x): x is SearchHistoryItem => x !== null && x.term.length > 0)
      .slice(0, DEFAULT_MAX_ITEMS);
  } catch {
    return [];
  }
}

function readPersisted(maxItems: number): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    if (hasConsent()) {
      const raw = getCookie(SEARCH_HISTORY_COOKIE_NAME);
      const items = parseHistory(raw);
      return items.slice(0, maxItems);
    }
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    const items = parseHistory(raw);
    return items.slice(0, maxItems);
  } catch {
    return [];
  }
}

function writePersisted(items: SearchHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const domain = getDomain();
    if (hasConsent()) {
      const termsOnly = items.slice(0, COOKIE_MAX_ITEMS).map((i) => i.term.slice(0, COOKIE_MAX_CHARS_PER_TERM));
      setCookie(SEARCH_HISTORY_COOKIE_NAME, JSON.stringify(termsOnly), domain);
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(items));
      deleteCookie(SEARCH_HISTORY_COOKIE_NAME, domain);
    }
  } catch {
    // ignore
  }
}

function clearPersisted(): void {
  if (typeof window === "undefined") return;
  try {
    deleteCookie(SEARCH_HISTORY_COOKIE_NAME, getDomain());
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Persists recent search terms (and optional filters): in a cookie when the user
 * has accepted cookies (terms only, for size), otherwise full items in sessionStorage.
 * Deduplicates by term (newest wins); capped at maxItems.
 */
export function useSearchHistory(maxItems: number = DEFAULT_MAX_ITEMS) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(readPersisted(maxItems));
  }, [maxItems]);

  const addToHistory = useCallback(
    (term: string, payload?: Omit<SearchHistoryItem, "term">) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setHistory((prev) => {
        const item: SearchHistoryItem = { term: trimmed, ...payload };
        const next = [item, ...prev.filter((i) => i.term !== trimmed)].slice(0, maxItems);
        writePersisted(next);
        return next;
      });
    },
    [maxItems]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    clearPersisted();
  }, []);

  return { history, addToHistory, clearHistory };
}
