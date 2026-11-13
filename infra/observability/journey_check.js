// k6 script for the Grafana Synthetic Monitoring "journey" check, uploaded by
// resources/synthetics.py. The __UPPERCASE__ tokens are substituted there --
// see render_check_script.
//
// It covers the dynamic routes (/document/[id], /geographies/[id]) that the
// static HTTP checks can't: they need real slugs, and any slug pinned here
// would rot. Instead every run reads the theme's sitemap, which is generated
// from live API data, and follows what it finds.
//
// Not scraped from /search, because search results are client-rendered
// (useSearch in src/pages/search/index.tsx) and k6 runs no JavaScript, so the
// SERP HTML contains no result links.
import http from "k6/http";
import { fail } from "k6";

const BASE = "__BASE__";
const SITEMAP = "__SITEMAP__";
const SSR_MARKER = "__SSR_MARKER__";

// How many urls to try per section before calling it an outage. The sitemap is
// now built from the theme's own default search filters, so every url in it
// should be servable and the first candidate should answer. Kept above 1 so a
// single unservable entry reads as a content bug rather than an outage.
const CANDIDATES = 8;

// The edge caches for 24h by default and keys on all query strings, so an
// un-busted request is answered by CloudFront and stays green with a dead
// origin.
function bust(url) {
  const sep = url.indexOf("?") === -1 ? "?" : "&";
  return url + sep + "__sm_cb=" + Math.random().toString(36).slice(2);
}

// Passes as soon as one page renders. All CANDIDATES failing is the outage
// signal -- a single 404 is a content problem, not a broken route.
function assertOneRenders(paths, kind) {
  if (paths.length === 0) fail("sitemap listed no " + kind + " url");

  const tried = [];
  for (let i = 0; i < paths.length && i < CANDIDATES; i++) {
    const res = http.get(bust(BASE + paths[i]));
    if (res.status === 200 && res.body.indexOf(SSR_MARKER) !== -1) return;
    tried.push(paths[i] + " -> " + res.status);
  }
  fail("no " + kind + " page rendered. Tried: " + tried.join(", "));
}

export default function () {
  // Not busted: a cached sitemap still yields live urls, and the page fetches are.
  const sitemap = http.get(SITEMAP);
  if (sitemap.status !== 200) fail("sitemap returned " + sitemap.status);

  // <loc> entries are absolute production urls. Stripping the host and
  // re-basing onto BASE is what makes the staging check exercise staging.
  const locs = sitemap.body.match(/<loc>[^<]+<\/loc>/g) || [];
  const paths = locs.map((loc) => loc.replace(/<\/?loc>/g, "")).map((url) => url.replace(/^https?:\/\/[^/]+/, ""));

  assertOneRenders(
    paths.filter((p) => p.indexOf("/document/") === 0),
    "document"
  );
  assertOneRenders(
    paths.filter((p) => p.indexOf("/geographies/") === 0),
    "geography"
  );
}
