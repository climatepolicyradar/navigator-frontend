import { TRedirect } from "@types";

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
  return redirects;
}

function getRedirectsMap() {
  return getRedirects().reduce((acc, item) => acc.set(item.source, item), new Map<string, TRedirect>());
}

export default getRedirectsMap();
