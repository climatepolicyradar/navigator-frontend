import router from "next-router-mock";

import { TTheme } from "@/types";

import { getCanonicalUrl } from "./getCanonicalUrl";

describe("getCanonicalUrl", () => {
  const testCases = [
    /** maintains search params, but not params for other pages */
    { route: "/search", theme: "cpr", expected: "https://app.climatepolicyradar.org/search" },
    {
      route: "/search?cpl=principal_law%2Fcolorado+air+pollution+prevention+and+control+act",
      theme: "cpr",
      expected: "https://app.climatepolicyradar.org/search?cpl=principal_law%2Fcolorado+air+pollution+prevention+and+control+act",
    },
    {
      route: "/privacy-policy?cpl=principal_law%2Fcolorado+air+pollution+prevention+and+control+act",
      theme: "cpr",
      expected: "https://app.climatepolicyradar.org/privacy-policy",
    },

    /** Themes */
    { route: "/", theme: "cpr", expected: "https://app.climatepolicyradar.org" },
    { route: "/", theme: "cclw", expected: "https://climate-laws.org" },
    { route: "/", theme: "mcf", expected: "https://climateprojectexplorer.org" },
    { route: "/", theme: "ccc", expected: "https://www.climatecasechart.com" },

    /** Attribution overrides themes */
    {
      route: "/documents/document-123",
      theme: "cpr",
      attributionUrl: "www.climate-laws.org",
      expected: "https://www.climate-laws.org/documents/document-123",
    },
    {
      route: "/documents/document-123",
      theme: "cclw",
      attributionUrl: "app.climatepolicyradar.org",
      expected: "https://app.climatepolicyradar.org/documents/document-123",
    },
    {
      route: "/documents/document-123",
      theme: "mcf",
      attributionUrl: "app.climatepolicyradar.org",
      expected: "https://app.climatepolicyradar.org/documents/document-123",
    },
    {
      route: "/documents/document-123",
      theme: "ccc",
      attributionUrl: "app.climatepolicyradar.org",
      expected: "https://app.climatepolicyradar.org/documents/document-123",
    },

    /** Pages with next router params in URL */
    { route: "/geographies/us-tn?query=oil", theme: "cpr", expected: "https://app.climatepolicyradar.org/geographies/us-tn" },
    { route: "/geographies/us-tn", theme: "cpr", expected: "https://app.climatepolicyradar.org/geographies/us-tn" },
  ] satisfies {
    route: string;
    theme: TTheme;
    attributionUrl?: string;
    expected: string;
  }[];

  test.each(testCases)("$route => $expected", ({ route, theme, attributionUrl, expected }) => {
    router.push(route);
    const canonicalUrl = getCanonicalUrl(router, theme, attributionUrl);
    expect(canonicalUrl).toBe(expected);
  });
});
