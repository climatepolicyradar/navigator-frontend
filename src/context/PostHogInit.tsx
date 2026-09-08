"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

import { getCookie } from "@/utils/cookies";
import { levelIdParamKey, searchLevelFromParams, TOPIC_PARAM_KEY } from "@/utils/search/searchLevels";

// A stable default: a fresh object each render would re-run the pageview effect and duplicate views
const NO_PAGE_VIEW_PROPS: Record<string, unknown> = {};

type TPostHogPageViewProps = {
  consent?: boolean;
  pageViewProps?: Record<string, unknown>;
};

function PostHogPageView({ consent, pageViewProps }: TPostHogPageViewProps): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      const pathParts = pathname.split("/");
      let pageType: string | undefined = undefined;
      let pageTypeSlug: string | undefined = undefined;
      let geographyType: string | undefined = undefined;

      switch (pathParts[1]) {
        case "collections":
        case "geographies":
        case "document":
        case "documents":
          pageType = pathParts[1];
          pageTypeSlug = pathParts[2];
      }

      if (pathParts[1] === "geographies") {
        const subdivisionMatcher = /^[a-z]{2}-[a-z]{2,3}$/i;
        geographyType = subdivisionMatcher.test(pathParts[2]) ? "subdivision" : "country";
      }

      const principalId = searchParams.get(levelIdParamKey("principal"));
      const documentId = searchParams.get(levelIdParamKey("document"));
      const topicId = searchParams.get(TOPIC_PARAM_KEY);

      posthog.capture("$pageview", {
        $current_url: url,
        consent,
        is_waf_bot: getCookie("is_waf_bot") === "true",
        geographyType,
        pageType,
        pageTypeSlug,
        search_level: searchLevelFromParams(pathname, searchParams),
        result_id: principalId ?? undefined,
        document_id: documentId ?? undefined,
        topic_id: topicId ?? undefined,
        ...pageViewProps,
      });
    }
  }, [pathname, searchParams, posthog, consent, pageViewProps]);

  return null;
}

type TPostHogInitProps = {
  consent?: boolean;
  pageViewProps?: Record<string, unknown>;
};

/**
 * Handles PostHog initialisation and page view tracking.
 * Dynamically imported (ssr: false) in _app.tsx so the posthog-js bundle
 * is deferred until after the initial page load.
 *
 * @see: https://posthog.com/tutorials/nextjs-cookie-banner
 */
export default function PostHogInit({ consent = false, pageViewProps = NO_PAGE_VIEW_PROPS }: TPostHogInitProps) {
  /**
   * The sessionStorage is read by tag manager to not re-init posthog.
   * We don't use posthog.__loaded as posthog isn't available on the window
   * when initialised this way.
   *
   * The posthog keys are public:
   * @see: https://posthog.com/docs/privacy#is-it-ok-for-my-api-key-to-be-exposed-and-public
   */
  useEffect(() => {
    posthog.init("phc_zaZYaLxsAeMjCLPsU2YvFqu4oaXRJ8uAkgXY8DancyL", {
      api_host: "https://eu.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      // Drawers scroll their own container. `html` keeps page scroll measured when none is open
      scroll_root_selector: ["[data-drawer-scroll]", "html"],
    });
    window.sessionStorage.setItem("posthogLoaded", "true");
  }, []);

  useEffect(() => {
    // We only set the config value based on consent
    // This approach fixes the previous issue of not persisting user data between sessions
    if (consent) {
      posthog.set_config({ persistence: "localStorage+cookie" });
    } else {
      posthog.set_config({ persistence: "memory" });
    }
    // Register after persistence is set: switching persistence clears super
    // properties, so `is_waf_bot` was being dropped for non-consented users.
    posthog.register({ is_waf_bot: getCookie("is_waf_bot") === "true" });
  }, [consent]);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView consent={consent} pageViewProps={pageViewProps} />
      </Suspense>
    </PHProvider>
  );
}
