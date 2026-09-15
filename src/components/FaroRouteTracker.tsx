"use client";

import { faro } from "@grafana/faro-web-sdk";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Buckets a pathname into a low-cardinality view name for Faro. Faro views are
 * metric/log dimensions, not event properties like PostHog's $pageview -- using
 * the raw pathname would create a new view (and metric series) per document,
 * geography, or collection ID instead of one per route type.
 */
const viewNameFromPathname = (pathname: string): string => {
  const [, firstSegment] = pathname.split("/");
  return firstSegment || "home";
};

/**
 * Reports each route change to Faro as a view, so Core Web Vitals and errors
 * can be segmented by page instead of bucketed under a single default view.
 * Mirrors the usePathname-based tracking PostHogInit.tsx already uses for
 * page views, rather than Next's routeChangeComplete router event.
 */
export const FaroRouteTracker = (): null => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && faro.api) {
      faro.api.setView({ name: viewNameFromPathname(pathname) });
    }
  }, [pathname]);

  return null;
};
