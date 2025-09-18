import { featureFlagKeys, TFeatureFlags, TThemeConfig, TTutorialName, TUTORIAL_NAMES } from "@/types";

import { getCompletedTutorialNamesFromCookie, getFirstIncompleteTutorialName } from "./tutorials";

describe("getCompletedTutorialNamesFromCookie", () => {
  it("returns no tutorials for invalid JSON", () => {
    expect(getCompletedTutorialNamesFromCookie("invalid")).toEqual([]);
  });

  it("returns no tutorials for a JSON object", () => {
    expect(getCompletedTutorialNamesFromCookie('{"foo":"bar"}')).toEqual([]);
  });

  it("returns no tutorials for an empty JSON array", () => {
    expect(getCompletedTutorialNamesFromCookie("[]")).toEqual([]);
  });

  it("returns returns only valid tutorial names", () => {
    expect(getCompletedTutorialNamesFromCookie(`["invalid","knowledgeGraph"]`)).toEqual(["knowledgeGraph"]);
  });
});

describe("getFirstIncompleteTutorialName", () => {
  const allFeatureFlagsEnabled = Object.fromEntries(featureFlagKeys.map((key) => [key, true])) as TFeatureFlags;

  it("returns no tutorial if the app has no tutorials", () => {
    const completedTutorials: TTutorialName[] = [];
    const themeConfig = { tutorials: [] } as TThemeConfig;
    const featureFlags = {} as TFeatureFlags;

    expect(getFirstIncompleteTutorialName(completedTutorials, themeConfig, featureFlags)).toBe(null);
  });

  it("returns no tutorial if the user has completed them all", () => {
    const completedTutorials: TTutorialName[] = ["knowledgeGraph", "climateLitigationDatabase"];
    const themeConfig = { tutorials: ["knowledgeGraph", "climateLitigationDatabase"] } as TThemeConfig;

    expect(getFirstIncompleteTutorialName(completedTutorials, themeConfig, allFeatureFlagsEnabled)).toBe(null);
  });

  it("returns no tutorial if the next tutorial is disabled", () => {
    const completedTutorials: TTutorialName[] = [];
    const themeConfig = {
      tutorials: ["climateLitigationDatabase"],
      features: { litigation: false },
    } as TThemeConfig;
    const featureFlags = { litigation: false } as TFeatureFlags;

    expect(getFirstIncompleteTutorialName(completedTutorials, themeConfig, featureFlags)).toBe(null);
  });

  it("returns the next unseen tutorial in the config defined order", () => {
    const completedTutorials: TTutorialName[] = [];
    const themeConfig = {
      tutorials: ["knowledgeGraph", "climateLitigationDatabase"],
      features: {
        knowledgeGraph: true,
        litigation: true,
      },
    } as TThemeConfig;

    expect(getFirstIncompleteTutorialName(completedTutorials, themeConfig, allFeatureFlagsEnabled)).toEqual("knowledgeGraph");
  });
});
