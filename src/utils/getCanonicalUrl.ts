import { NextRouter } from "next/router";

import { TTheme } from "@/types";
import getThemeDomain from "@/utils/getThemeDomain";

// Get the canonical URL for the current page
// This is used to tell search engines the preferred URL for the current page
export const getCanonicalUrl = (router: NextRouter, theme: TTheme): string => {
  /** We're only interested in the pathname so use an explicit placeholder url */
  const url = new URL(router.asPath, "https://placeholder");

  // The search page keeps its query string, as the query is what makes a results page distinct.
  const pathname = router.pathname === "/search" ? router.asPath : url.pathname;

  const canonicalUrl = `https://${getThemeDomain(theme)}${pathname}`;

  // Remove trailing slash to avoid duplicate content being indexed
  if (canonicalUrl.endsWith("/")) {
    return canonicalUrl.slice(0, -1);
  }

  return canonicalUrl;
};
