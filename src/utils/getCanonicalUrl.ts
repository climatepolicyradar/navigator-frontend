import { NextRouter } from "next/router";

import { TTheme } from "@/types";
import getThemeDomain from "@/utils/getThemeDomain";

// Get the canonical URL for the current page
// This is used to tell search engines the preferred URL for the current page
export const getCanonicalUrl = (router: NextRouter, theme: TTheme, attributionUrl?: string): string => {
  const themeDomain = attributionUrl || getThemeDomain(theme);
  /** We're only interested in the pathname so use an explicit placeholder url */
  const url = new URL(router.asPath, "https://placeholder");

  /**
   * Both search pages keep their query string, as the query is what makes a results page distinct.
   * `/_search` is matched on the route rather than the URL because themes that have flipped serve
   * it at `/search` via a rewrite (themes/THEME/rewrites.json).
   */
  let pathname: string;
  if (router.pathname === "/search" || router.pathname === "/_search") {
    pathname = router.asPath;
  } else {
    pathname = url.pathname;
  }

  let canonicalUrl: string;
  if (themeDomain.includes("https://")) {
    canonicalUrl = `${themeDomain}${pathname}`;
  } else {
    canonicalUrl = `https://${themeDomain}${pathname}`;
  }

  // Remove trailing slash to avoid duplicate content being indexed
  if (canonicalUrl.endsWith("/")) {
    return canonicalUrl.slice(0, -1);
  }

  return canonicalUrl;
};
