"use client";

import { faro } from "@grafana/faro-web-sdk";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
      faro.api.setView({ name: pathname });
    }
  }, [pathname]);

  return null;
};
