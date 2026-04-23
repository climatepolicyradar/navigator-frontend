import config from "./tsconfig.base.json";

describe("tsconfig.base.json", () => {
  it("should not be hardcoding the theme alias path, and should contain the wildcard", () => {
    expect(config.compilerOptions.paths["@/themes/*"]).toContain("./themes/__THEME__/*");
  });
});
