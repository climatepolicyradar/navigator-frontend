import { NextRouter } from "next/router";

import { TTheme } from "@/types";

import getThemeDomain from "./getThemeDomain";

// Get the canonical URL for the current page
// This is used to tell search engines the preferred URL for the current page
export const getCanonicalUrl = (router: NextRouter, theme: TTheme, attributionUrl: string | null = null): string => {
  const themeDomain = attributionUrl ? attributionUrl : getThemeDomain(theme);
  /** We're only interested in the pathname so use an explicit placeholder url */
  const url = new URL(router.asPath, "https://placeholder");

  let pathname: string;
  if (router.pathname === "/search") {
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
