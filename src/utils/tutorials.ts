import { TUTORIALS } from "@/constants/tutorials";
import { TFeatures, TThemeConfig, TTutorialName, TUTORIAL_NAMES } from "@/types";

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
export const getIncompleteTutorialNames = (completedTutorials: TTutorialName[], themeConfig: TThemeConfig, features: TFeatures): TTutorialName[] =>
  themeConfig.tutorials.filter(
    (tutorialName) =>
      !completedTutorials.includes(tutorialName) && // Tutorial not yet completed
      features[TUTORIALS[tutorialName].featureKey] // Tutorial enabled
  );
