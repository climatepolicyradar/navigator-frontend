import { expect, test, vi } from "vitest";

import { handler } from "./cclw";
import kvs from "./cclw.json";

// The factory is hoisted above the imports, so `kvs` can only be touched
// inside the callbacks -- never in the factory body.
vi.mock("cloudfront", () => ({
  default: {
    kvs: vi.fn(() => ({
      exists: async (key) => kvs.redirects.some(({ Key }) => Key === key),
      get: async (key) => kvs.redirects.find(({ Key }) => Key === key)?.Value,
    })),
  },
}));

// One row per behaviour. `location: null` means the request passes through unredirected.
const CASES = [
  { case: "pattern, single segment", uri: "/geography/australia/laws", location: "/geographies/australia" },
  { case: "pattern, catch-all segments", uri: "/geography/australia/climate_targets/ndc/2030", location: "/geographies/australia" },
  { case: "pattern, catch-all in destination", uri: "/cclow/geographies/spain", location: "/geographies/spain" },
  { case: "pattern, open redirect collapsed", uri: "/cclow//evil.com", location: "/evil.com" },
  { case: "kvs, exact key", uri: "/litigation_cases", location: "http://climatecasechart.com/search-non-us/" },
  { case: "kvs, trailing slash stripped", uri: "/legislation_and_policies/", location: "/search" },
  { case: "pattern near-miss", uri: "/geography/australia", location: null },
  { case: "unknown uri", uri: "/unknown-uri/", location: null },
  { case: "homepage", uri: "/", location: null },
];

test.each(CASES)("$case: $uri", async ({ uri, location }) => {
  const response = await handler({ request: { uri } });

  if (location === null) {
    expect(response).toEqual({ uri });
    return;
  }

  expect(response).toEqual({
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: location },
      "cache-control": { value: "max-age=86400" },
      "x-redirect-reason": { value: "redirection-kvs" },
    },
  });
});
