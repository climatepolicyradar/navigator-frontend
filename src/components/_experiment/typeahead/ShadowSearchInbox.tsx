import { Inbox } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import { clearChangedDocuments, getChangedDocumentIds, removeChangedDocument } from "@/utils/_experiment/changedDocumentsCookie";

function slugToTitle(slug: string): string {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

/**
 * Inbox icon for shadow search: fixed top-right. Shows a blue notification
 * badge (count) when there are changed documents. Click opens a panel with
 * either "No notifications - up to date" or clickable rows per updated doc.
 */
export function ShadowSearchInbox() {
  const router = useRouter();
  const [changedIds, setChangedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const refresh = useCallback(() => {
    setChangedIds(getChangedDocumentIds());
  }, []);

  useEffect(() => {
    queueMicrotask(refresh);
    const onUpdated = () => refresh();
    const onFocus = () => refresh();
    window.addEventListener("shadow-search-changed-updated", onUpdated);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("shadow-search-changed-updated", onUpdated);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    const onRouteChange = () => {
      requestAnimationFrame(() => {
        refresh();
      });
    };
    router.events.on("routeChangeComplete", onRouteChange);
    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [refresh, router.events]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleButtonClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleDismissAll = useCallback(() => {
    clearChangedDocuments();
    setChangedIds([]);
    setOpen(false);
  }, []);

  const hasNotifications = changedIds.length > 0;
  const count = changedIds.length;

  return (
    <div className="fixed right-6 top-6 z-20">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        className="flex items-center justify-center rounded-md p-2 text-icon-standard hover:bg-background-hover hover:text-icon-hover"
        aria-label={hasNotifications ? `${count} document(s) updated` : "Inbox"}
        aria-expanded={open}
        aria-haspopup="true"
        title={hasNotifications ? `${count} document(s) updated` : "Inbox"}
      >
        <span className="relative inline-block">
          <Inbox size={24} strokeWidth={1.5} />
          {hasNotifications && (
            <span
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-surface-brand px-1 text-[10px] font-medium text-white"
              aria-hidden
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-1 w-72 rounded-lg border border-border-lighter bg-white py-2 shadow-lg"
          role="dialog"
          aria-label="Notifications"
        >
          {!hasNotifications ? (
            <p className="px-4 py-3 text-sm text-text-tertiary">No notifications – up to date</p>
          ) : (
            <>
              <div className="mb-2 px-4 py-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Updated documents</p>
              </div>
              <ul className="max-h-64 overflow-y-auto">
                {changedIds.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/_search/result/${slug}`}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-background-hover"
                      onClick={() => {
                        removeChangedDocument(slug);
                        setOpen(false);
                      }}
                    >
                      {slugToTitle(slug)} updated
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 border-t border-border-lighter px-4 pt-2">
                <button type="button" onClick={handleDismissAll} className="text-xs text-text-tertiary underline hover:text-text-primary">
                  Dismiss all
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
