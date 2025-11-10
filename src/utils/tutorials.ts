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

// Returns the names of any tutorials not already completed and enabled
export const getIncompleteTutorialNames = (
  completedTutorials: TTutorialName[],
  themeConfig: TThemeConfig,
  featureFlags: TFeatureFlags
): TTutorialName[] =>
  themeConfig.tutorials.filter(
    (tutorialName) => !completedTutorials.includes(tutorialName) && TUTORIALS[tutorialName].isEnabled(featureFlags, themeConfig)
  );
