import Link from "next/link";
import { useRef, useEffect, useState } from "react";

import { clearClickedDocumentIds, getClickedDocumentIds } from "@/utils/_experiment/clickedDocumentsCookie";

function slugToTitle(slug: string): string {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

export interface RecentlyViewedDocumentsProps {
  excludeSlug?: string;
  maxItems?: number;
  className?: string;
  variant?: "list" | "carousel";
}

const CAROUSEL_SCROLL_AMOUNT = 180;

/**
 * Lists recently viewed (clicked) documents from the cookie, as links to their result pages.
 * Client-only: reads cookie in useEffect to avoid hydration mismatch.
 */
export function RecentlyViewedDocuments({ excludeSlug, maxItems = 10, className, variant = "list" }: RecentlyViewedDocumentsProps) {
  const [ids, setIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const all = getClickedDocumentIds();
    const filtered = excludeSlug ? all.filter((id) => id !== excludeSlug) : all;
    const nextIds = filtered.slice(0, maxItems);
    // Slightly defer state update to avoid cascading renders warning.
    setTimeout(() => {
      setIds(nextIds);
    }, 0);
  }, [excludeSlug, maxItems]);

  const handleClear = () => {
    clearClickedDocumentIds();
    setIds([]);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -CAROUSEL_SCROLL_AMOUNT : CAROUSEL_SCROLL_AMOUNT;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (ids.length === 0) return null;

  if (variant === "carousel") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Recently viewed documents</p>
          <button type="button" onClick={handleClear} className="ml-2 text-[11px] text-text-tertiary underline hover:text-text-primary">
            Clear
          </button>
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border-lighter bg-white text-text-tertiary hover:bg-surface-light hover:text-text-primary"
          >
            ←
          </button>
          <div ref={scrollRef} className="flex flex-1 gap-2 overflow-x-auto py-1 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
            {ids.map((slug) => (
              <Link
                key={slug}
                href={`/_search/result/${slug}`}
                className="shrink-0 rounded border border-border-lighter bg-white px-4 py-2 text-sm font-medium text-text-primary hover:border-border-light hover:bg-surface-light"
              >
                {slugToTitle(slug)}
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border-lighter bg-white text-text-tertiary hover:bg-surface-light hover:text-text-primary"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Recently viewed documents</p>
        <button type="button" onClick={handleClear} className="text-[11px] text-text-tertiary underline hover:text-text-primary">
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {ids.map((slug) => (
          <li key={slug}>
            <Link
              href={`/_search/result/${slug}`}
              className="inline-flex rounded border border-border-lighter bg-white px-3 py-1.5 text-xs font-medium text-text-primary hover:border-border-light hover:bg-surface-light"
            >
              {slugToTitle(slug)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
