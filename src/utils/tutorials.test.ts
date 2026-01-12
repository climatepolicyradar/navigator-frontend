import { DEFAULT_FEATURES } from "@/constants/features";
import { TFeatures, TThemeConfig, TTutorialName } from "@/types";

import { getCompletedTutorialNamesFromCookie, getIncompleteTutorialNames } from "./tutorials";

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

describe("getIncompleteTutorialNames", () => {
  const allFeaturesEnabled = Object.fromEntries(Object.keys(DEFAULT_FEATURES).map((key) => [key, true])) as TFeatures;

  it("returns no tutorials if the app has no tutorials", () => {
    const completedTutorials: TTutorialName[] = [];
    const themeConfig = { tutorials: [] } as TThemeConfig;

    expect(getIncompleteTutorialNames(completedTutorials, themeConfig, DEFAULT_FEATURES)).toEqual([]);
  });

  it("returns no tutorials if the user has completed them all", () => {
    const completedTutorials: TTutorialName[] = ["knowledgeGraph", "climateLitigationDatabase"];
    const themeConfig = { tutorials: ["knowledgeGraph", "climateLitigationDatabase"] } as TThemeConfig;

    expect(getIncompleteTutorialNames(completedTutorials, themeConfig, allFeaturesEnabled)).toEqual([]);
  });

  it("returns no tutorials if the tutorial is disabled", () => {
    const completedTutorials: TTutorialName[] = [];
    const themeConfig = {
      tutorials: ["climateLitigationDatabase"],
      features: { litigation: false },
    } as TThemeConfig;

    expect(getIncompleteTutorialNames(completedTutorials, themeConfig, DEFAULT_FEATURES)).toEqual([]);
  });

  it("returns unseen tutorials in the config defined order", () => {
    const completedTutorials: TTutorialName[] = [];
    const themeConfig = {
      tutorials: ["knowledgeGraph", "climateLitigationDatabase"],
      features: {
        knowledgeGraph: true,
        litigation: true,
      },
    } as TThemeConfig;

    expect(getIncompleteTutorialNames(completedTutorials, themeConfig, allFeaturesEnabled)).toEqual(["knowledgeGraph", "climateLitigationDatabase"]);
  });
});
