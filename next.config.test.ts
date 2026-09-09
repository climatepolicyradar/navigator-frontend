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

describe("next.config.js", () => {
  const originalTheme = process.env.THEME;

  afterEach(() => {
    process.env.THEME = originalTheme;
  });

  describe("rewrites", () => {
    it.each(THEMES)("puts the %s theme's rules in beforeFiles", async (theme) => {
      const rewrites = await rewritesFor(theme);

      expect(rewrites.beforeFiles).toBeInstanceOf(Array);
      expect(rewrites).toMatchObject({ afterFiles: [], fallback: [] });
    });

    // Uncomment the following test when we're ready to deploy
    // it("serves the v2 search page at /search for cpr", async () => {
    //   const { beforeFiles } = await rewritesFor("cpr");

    //   expect(beforeFiles).toEqual([{ source: "/search", destination: "/_search" }]);
    // });

    it.each(["ccc", "cclw", "mcf"])("leaves /search on the v1 page for the %s theme", async (theme) => {
      const { beforeFiles } = await rewritesFor(theme);

      expect(beforeFiles).toEqual([]);
    });
  });
});
