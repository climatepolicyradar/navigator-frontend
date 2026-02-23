import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { RecentlyViewedDocuments } from "@/components/_experiment/typeahead/RecentlyViewedDocuments";
import { recordClickedDocument } from "@/utils/_experiment/clickedDocumentsCookie";
import { SHADOW_SEARCH_RETURNED_SLUG_KEY, getContentUpdatedIds } from "@/utils/_experiment/contentUpdatedCookie";

const LOREM_IPSUM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus.",
  "Nulla facilities. Morbi ut ligula in dolor blandit tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
];

/**
 * Slug to display title: capitalise first letter (e.g. "apple" -> "Apple").
 */
function slugToTitle(slug: string): string {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

export default function ShadowSearchResultPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const title = slugToTitle(slug);
  const [showTitleContent, setShowTitleContent] = useState<boolean | null>(null);
  const slugRef = useRef(slug);

  useEffect(() => {
    slugRef.current = slug;
  }, [slug]);

  useEffect(() => {
    if (slug) recordClickedDocument(slug);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    queueMicrotask(() => setShowTitleContent(getContentUpdatedIds().includes(slug)));
  }, [slug]);

  // On leave, set sessionStorage so shadow search can mark this slug as "returned" (content-updated).
  useEffect(() => {
    return () => {
      const leftSlug = slugRef.current;
      const alreadyUpdated = leftSlug ? getContentUpdatedIds().includes(leftSlug) : false;
      if (leftSlug && !alreadyUpdated) {
        try {
          window.sessionStorage.setItem(SHADOW_SEARCH_RETURNED_SLUG_KEY, leftSlug);
        } catch {
          // Ignore.
        }
      }
    };
  }, [slug]);

  if (!router.isReady) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{title ? `${title} | Search result` : "Search result"}</title>
      </Head>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/_search" className="mb-6 inline-block text-sm text-text-tertiary hover:text-text-brand">
          ← Back to search
        </Link>
        {title ? (
          <>
            <h1 className="mb-6 text-2xl font-semibold text-text-primary">{title}</h1>
            <div className="space-y-4 text-sm text-text-secondary">
              {showTitleContent ? <p>Content for {title}.</p> : LOREM_IPSUM.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
          </>
        ) : (
          <p className="text-text-tertiary">No result found.</p>
        )}
        <RecentlyViewedDocuments excludeSlug={slug} maxItems={10} variant="carousel" className="mt-10 border-t border-border-lighter pt-6" />
      </div>
    </>
  );
}
