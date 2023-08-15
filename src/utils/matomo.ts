// This code is not being used, but it is kept here for future reference.
// See the CookieConsent component for the current implementation.
import { default as Router } from "next/router";

import { QUERY_PARAMS } from "@constants/queryParams";

interface IDimensions {
  dimension1?: string;
  dimension2?: string;
  dimension3?: string;
  dimension4?: string;
  dimension5?: string;
  dimension6?: string;
  dimension7?: string;
  dimension8?: string;
  dimension9?: string;
  dimension10?: string;
  dimension12?: string;
  dimension13?: string;
  dimension14?: string;
  dimension15?: string;
}

// IMPORTANT: The index of the custom dimensions must match the index of the custom dimension in Matomo
const customDimensions: IDimensions = {
  dimension1: QUERY_PARAMS.exact_match,
  dimension2: QUERY_PARAMS.region,
  dimension3: QUERY_PARAMS.country,
  dimension4: QUERY_PARAMS.year_range,
  dimension5: QUERY_PARAMS.sort_field,
  dimension6: QUERY_PARAMS.sort_order,
  dimension7: QUERY_PARAMS.offset,
};

export function push(args: (IDimensions | number[] | string[] | number | string | boolean | null | undefined)[]): void {
  if (!window._paq) {
    window._paq = [];
  }
  window._paq.push(args);
}

const startsWith = (str: string, needle: string) => {
  return str.substring(0, needle.length) === needle;
};

const getKeyByValue = (object: Object, value: string | number) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const buildCustomDimensions = (query: { [key: string]: string | string[] }): IDimensions => {
  const dimensions: IDimensions = {};
  // Only push the query params that are custom dimensions
  Object.keys(query).forEach((key) => {
    if (Object.values(QUERY_PARAMS).includes(key)) {
      const dimensionIndex = getKeyByValue(customDimensions, key);
      if (dimensionIndex) {
        dimensions[`${dimensionIndex}`] = query[key];
      }
    }
  });
  return dimensions;
};

const pushCustomDimensions = (query: { [key: string]: string | string[] }): void => {
  // Only push the query params that are custom dimensions
  Object.keys(query).forEach((key) => {
    if (Object.values(QUERY_PARAMS).includes(key)) {
      const dimensionIndex = getKeyByValue(customDimensions, key);
      if (dimensionIndex) {
        push(["setCustomVariable", dimensionIndex, query[key]]);
      }
    }
  });
};

const Matomo = () => {
  push(["trackPageView", document.title, buildCustomDimensions(Router.query)]);

  const defaultOnRouteChangeStart = (path: string): void => {
    // We use only the part of the url without the querystring to ensure piwik is happy
    // It seems that piwik doesn't track well page with querystring
    const [pathname] = path.split("?");

    push(["setCustomUrl", pathname]);
    push(["deleteCustomVariables", "page"]);
  };
  Router.events.on("routeChangeStart", defaultOnRouteChangeStart);

  const defaultOnRouteChangeComplete = (path: string): void => {
    // In order to ensure that the page title had been updated,
    // we delayed pushing the tracking to the next tick.
    const dimensions = buildCustomDimensions(Router.query);
    setTimeout(() => {
      if (startsWith(path, "/search")) {
        const { q, c } = Router.query;
        push(["trackSiteSearch", q ?? "", c ?? "", false, dimensions]);
      } else {
        push(["trackPageView", document.title, dimensions]);
      }
    }, 0);
  };
  Router.events.on("routeChangeComplete", defaultOnRouteChangeComplete);
};

export default Matomo;
