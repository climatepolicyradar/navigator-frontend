/* eslint-disable no-console */
import { TRedirect } from "@types";

// Please note: this file is no longer being importing into the middleware

function getRedirects(): Array<TRedirect> {
  const REDIRECT_FILE = process.env.REDIRECT_FILE || `../../themes/${process.env.THEME}/redirects.json`;
  let redirects = [];
  let redirectsFromFile = null;
  try {
    redirectsFromFile = require(REDIRECT_FILE);
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
