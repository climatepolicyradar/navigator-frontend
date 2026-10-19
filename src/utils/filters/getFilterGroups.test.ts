import { TFeatures, TTheme } from "@/types";

import { getFilterGroups } from "./getFilterGroups";

const THEMES_ENABLED: TFeatures = {
  themes: true,
} as TFeatures;

describe("getFilterGroups", () => {
  it.each<[TTheme, boolean]>([
    ["cpr", true],
    ["ccc", false],
    ["cclw", false],
    ["mcf", false],
  ])("%s theme shows domain (theme) filters: Should be %s", (theme, expected) => {
    const groups = getFilterGroups({ features: THEMES_ENABLED, getAppText: () => "", theme });
    expect(groups.some((f) => f.title === "Theme")).toBe(expected);
  });
});
