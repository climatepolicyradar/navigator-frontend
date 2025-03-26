"use client";

/**
 * Most of this is lifted from the official documentation
 * @see: https://posthog.com/tutorials/nextjs-cookie-banner
 */

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  consent?: boolean;
};

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  /** Track pageviews */
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

/**
 * Wrap this in Suspense to avoid the `useSearchParams` usage above
 * from de-opting the whole app into client-side rendering
 * @see: https://nextjs.org/docs/messages/deopted-into-client-rendering
 */
export function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

export function PostHogProvider({ children, consent }: Props) {
  /**
   * The sessionStorage is read by tag manager to not re-init posthog
   * We don't use something like posthog.__loaded as posthog isn't available on the window
   * when initialised this way.
   *
   * * The posthog keys are public
   * @see: https://posthog.com/docs/privacy#is-it-ok-for-my-api-key-to-be-exposed-and-public
   */
  useEffect(() => {
    /** If consent is granted, initialize our cookied PostHog instance */
    posthog.init("phc_zaZYaLxsAeMjCLPsU2YvFqu4oaXRJ8uAkgXY8DancyL", {
      api_host: "https://eu.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "memory",
      person_profiles: "always",
    });
    window.sessionStorage.setItem("posthogLoaded", "true");
  }, []);

  useEffect(() => {
    if (consent) {
      posthog.set_config({ persistence: "localStorage+cookie" });
    }
  }, [consent]);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
