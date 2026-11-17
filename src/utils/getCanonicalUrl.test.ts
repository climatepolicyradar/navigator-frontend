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

    /** the v2 search page keeps its search params, whether visited directly or served at /search by a rewrite */
    { route: "/_search?q=flood+risk", theme: "cpr", expected: "https://app.climatepolicyradar.org/_search?q=flood+risk" },
    { route: "/_search", as: "/search?q=flood+risk", theme: "cpr", expected: "https://app.climatepolicyradar.org/search?q=flood+risk" },

    /** Themes */
    { route: "/", theme: "cpr", expected: "https://app.climatepolicyradar.org" },
    { route: "/", theme: "cclw", expected: "https://climate-laws.org" },
    { route: "/", theme: "mcf", expected: "https://climateprojectexplorer.org" },
    { route: "/", theme: "ccc", expected: "https://www.climatecasechart.com" },

    /** Pages with next router params in URL */
    { route: "/geographies/us-tn?query=oil", theme: "cpr", expected: "https://app.climatepolicyradar.org/geographies/us-tn" },
    { route: "/geographies/us-tn", theme: "cpr", expected: "https://app.climatepolicyradar.org/geographies/us-tn" },
  ] satisfies {
    route: string;
    as?: string;
    theme: TTheme;
    expected: string;
  }[];

  test.each(testCases)("$route => $expected", ({ route, as, theme, expected }) => {
    router.push(route, as);
    const canonicalUrl = getCanonicalUrl(router, theme);
    expect(canonicalUrl).toBe(expected);
  });
});
