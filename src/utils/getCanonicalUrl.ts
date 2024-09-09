import { NextRouter } from "next/router";

import getThemeDomain from "./getThemeDomain";

import { TTheme } from "@types";

// Get the canonical URL for the current page
// This is used to tell search engines the preferred URL for the current page
export const getCanonicalUrl = (router: NextRouter, theme: TTheme): string => {
  const themeDomain = getThemeDomain(theme);

  // Get the length of the path slice to remove query params and hash
  // We specifically do not want to include query params or hash in the canonical URL
  // for example: https://example.com/page?query=1#hash -> https://example.com/page
  const _pathSliceLength = Math.min.apply(Math, [
    router.asPath.indexOf("?") > 0 ? router.asPath.indexOf("?") : router.asPath.length,
    router.asPath.indexOf("#") > 0 ? router.asPath.indexOf("#") : router.asPath.length,
  ]);

  const canonicalUrl = `https://${themeDomain}${router.asPath.substring(0, _pathSliceLength)}`;

  // Remove trailing slash to avoid duplicate content being indexed
  if (canonicalUrl.endsWith("/")) {
    return canonicalUrl.slice(0, -1);
  }

  return canonicalUrl;
};
