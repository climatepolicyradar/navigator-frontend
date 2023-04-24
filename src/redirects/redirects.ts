import { TRedirect } from "@types";

// for pages that are not in cclw's sitemap
const cclwRedirects = [
  { source: "/cookie-policy", destination: "/", permanent: true },
  { source: "/privacy", destination: "/", permanent: true },
];

// for pages that are not in cpr's sitemap
const cprRedirects = [
  { source: "/about", destination: "/", permanent: true },
  { source: "/acknowledgements", destination: "/", permanent: true },
  { source: "/contact", destination: "/", permanent: true },
  { source: "/methodology", destination: "/", permanent: true },
  { source: "/faq", destination: "/", permanent: true },
];

const theme = process.env.THEME;

function getRedirects(): Array<TRedirect> {
  const REDIRECT_FILE = process.env.REDIRECT_FILE || "CCLW_redirects.json";
  let redirects = [];
  let redirectsFromFile = null;
  try {
    redirectsFromFile = require(`./${REDIRECT_FILE}`);
  } catch (e) {
    console.error(`Error loading redirects from ${REDIRECT_FILE}: ${e}`);
  }
  if (redirectsFromFile) {
    redirects = redirectsFromFile;
  }
  switch (theme) {
    case "cclw":
      redirects.push.apply(redirects, cclwRedirects);
      break;
    case "cpr":
      redirects.push.apply(redirects, cprRedirects);
      break;
  }
  return redirects;
}

function getRedirectsMap() {
  return getRedirects().reduce((acc, item) => acc.set(item.source, item), new Map<string, TRedirect>());
}

export default getRedirectsMap();
