import { ReactNode } from "react";

import { TButtonColor, TButtonVariant } from "@/components/atoms/button/Button";

import { TFeatureFlags } from "./features";
import { TThemeConfig } from "./themeConfig";
import { TTheme } from "./types";

export type TTutorialButtonAction = "dismiss" | "showModal";

export type TTutorialButton = {
  text: string;
  action: TTutorialButtonAction;
  color?: TButtonColor;
  variant?: TButtonVariant;
};

export type TTutorialCard = {
  title?: string;
  text: string;
  close: boolean;
  buttonPrimary: TTutorialButton;
  buttonSecondary?: TTutorialButton;
};

export type TTutorialBanner = {
  text: string;
  buttonPrimary: TTutorialButton;
  buttonSecondary?: TTutorialButton;
};

export type TTutorialModal = {
  defaultOpen: boolean;
  headerImage?: ReactNode;
  title?: string;
  close: boolean;
  content: ReactNode;
  buttonPrimary?: TTutorialButton;
  buttonSecondary?: TTutorialButton;
};

export type TTutorial = {
  order: number; // TODO non-linear feature onboarding
  isEnabled: (featureFlags: TFeatureFlags, themeConfig: TThemeConfig, theme: TTheme) => boolean;
  banner?: TTutorialBanner;
  card?: TTutorialCard;
  modal?: TTutorialModal;
};
