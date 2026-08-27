"use client";

import { getWebInstrumentations, initializeFaro, isInternalFaroOnGlobalObject } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

import { getCookie } from "@/utils/cookies";

export const FrontendObservability = (): null => {
  // skip if already initialised (faro.api is a truthy no-op stub before init, so it can't be used as the check)
  if (isInternalFaroOnGlobalObject()) return null;

  if (!process.env.NEXT_PUBLIC_FARO_URL) {
    console.error("Skipping Faro initialisation");
    return null;
  }

  try {
    if (typeof window !== "undefined") {
      initializeFaro({
        url: process.env.NEXT_PUBLIC_FARO_URL,
        app: {
          name: `${process.env.THEME}-frontend`,
          namespace: "frontend",
          // Matches the bundleId passed to scripts/upload-source-maps.sh in the Dockerfile.
          version: process.env.NEXT_PUBLIC_GITHUB_SHA ?? "local",
          environment: process.env.NEXT_PUBLIC_FARO_ENVIRONMENT ?? "local",
        },
        sessionTracking: {
          // WAF-tagged bots (is_waf_bot cookie, set by middleware.ts) send no telemetry
          sampler: () => (getCookie("is_waf_bot") === "true" ? 0 : 0.2),
        },
        instrumentations: [
          // Mandatory, omits default instrumentations otherwise.
          ...getWebInstrumentations(),

          // Tracing package to get end-to-end visibility for HTTP requests.
          new TracingInstrumentation(),
        ],
      });
    }
  } catch (error) {
    console.error(error);
    return null;
  }
  return null;
};
