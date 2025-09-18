import { TUTORIALS } from "@/constants/tutorials";
import { TFeatureFlags, TThemeConfig, TTutorialName, TUTORIAL_NAMES } from "@/types";

export const getCompletedTutorialNamesFromCookie = (cookie: string): TTutorialName[] => {
  try {
    const tutorialsCookie = JSON.parse(cookie);

    // Don't trust the cookie to be correctly formatted or have valid tutorial names
    if (!(tutorialsCookie instanceof Array)) return [];
    return tutorialsCookie.filter((value) => typeof value === "string" && TUTORIAL_NAMES.includes(value as TTutorialName));
  } catch {
    return [];
  }
};

// Returns the name of the first tutorial not already completed and enabled
export const getFirstIncompleteTutorialName = (
  completedTutorials: TTutorialName[],
  themeConfig: TThemeConfig,
  featureFlags: TFeatureFlags
): TTutorialName | null =>
  themeConfig.tutorials.find(
    (tutorialName) => !completedTutorials.includes(tutorialName) && TUTORIALS[tutorialName].isEnabled(featureFlags, themeConfig)
  ) || null;
