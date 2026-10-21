import config from "./next.config.js";

const THEMES = ["ccc", "cclw", "cpr", "mcf"];

/**
 * A bare array is read as afterFiles, which Next only reaches after checking the filesystem, so a
 * rule shadowing a real page (/search -> /_search) would silently never fire. Guard the shape.
 */
const rewritesFor = async (theme: string) => {
  process.env.THEME = theme;
  const rewrites = await config.rewrites();

  if (Array.isArray(rewrites)) throw new Error("rewrites() returned a bare array, so Next will read the rules as afterFiles");

  return rewrites;
};

type TRedirectRule = { source: string; destination: string; permanent: boolean; has?: unknown[]; missing?: unknown[] };

const redirectsFor = async (theme: string) => {
  process.env.THEME = theme;
  return (await config.redirects()) as TRedirectRule[];
};

/**
 * Only static, unconditional rules are checked for cycles: `has`/`missing`
 * conditions and `:param` sources need real request matching (header values,
 * path segments) that a plain string graph can't simulate. Those are instead
 * exercised live by scripts/check-redirects.mjs against a running environment.
 */
const isStaticRedirect = (rule: TRedirectRule) => !rule.has && !rule.missing && !rule.source.includes(":");

// Iterative DFS with a 3-colour visited map, so each node is only ever
// fully explored once: O(n) overall rather than re-walking shared tails
// from every starting node.
const findCyclicalPaths = (rules: TRedirectRule[]): string[] | null => {
  const destinationBySource = new Map(rules.map((rule) => [rule.source, rule.destination]));
  const state = new Map<string, "visiting" | "done">();

  for (const start of destinationBySource.keys()) {
    if (state.get(start) === "done") continue;

    const path: string[] = [];
    let current = start;

    while (destinationBySource.has(current) && state.get(current) !== "done") {
      if (state.get(current) === "visiting") {
        return path.slice(path.indexOf(current)).concat(current);
      }
      state.set(current, "visiting");
      path.push(current);
      current = destinationBySource.get(current)!;
    }

    path.forEach((node) => state.set(node, "done"));
  }

  return null;
};

describe("next.config.js", () => {
  const originalTheme = process.env.THEME;

  afterEach(() => {
    process.env.THEME = originalTheme;
  });

  describe("redirects", () => {
    it.each(THEMES)("has no cyclical static redirects for %s", async (theme) => {
      const rules = await redirectsFor(theme);

      expect(findCyclicalPaths(rules.filter(isStaticRedirect))).toBeNull();
    });
  });

  describe("rewrites", () => {
    it.each(THEMES)("puts the %s theme's rules in beforeFiles", async (theme) => {
      const rewrites = await rewritesFor(theme);

      expect(rewrites.beforeFiles).toBeInstanceOf(Array);
      expect(rewrites).toMatchObject({ afterFiles: [], fallback: [] });
    });

    it("serves the v2 search page at /search for cpr", async () => {
      const { beforeFiles } = await rewritesFor("cpr");

      expect(beforeFiles).toEqual([{ source: "/search", destination: "/_search" }]);
    });

    it.each(["ccc", "cclw", "mcf"])("leaves /search on the v1 page for the %s theme", async (theme) => {
      const { beforeFiles } = await rewritesFor(theme);

      expect(beforeFiles).toEqual([]);
    });
  });
});
