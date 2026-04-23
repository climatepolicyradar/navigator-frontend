import config from "./tsconfig.base.json";

describe("tsconfig.base.json", () => {
  describe("the */themes alias", () => {
    it("should only contain one path", () => {
      expect(config.compilerOptions.paths["@/themes/*"]).toHaveLength(1);
    });
    it("should contain the wildcard", () => {
      expect(config.compilerOptions.paths["@/themes/*"]).toContain("./themes/__THEME__/*");
    });
  });
});
