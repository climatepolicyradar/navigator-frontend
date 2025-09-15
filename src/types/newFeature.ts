import { ReactNode } from "react";

import { TFeatureFlags } from "./features";
import { TThemeConfig } from "./themeConfig";
import { TTheme } from "./types";

export type TNewFeatureButtonAction = "dismiss" | "showModal";

export type TNewFeatureButton = {
  text: string;
  action: TNewFeatureButtonAction;
};

export type TNewFeatureCard = {
  title?: string;
  text: string;
  close: boolean;
  buttonPrimary: TNewFeatureButton;
  buttonSecondary?: TNewFeatureButton;
};

export type TNewFeatureBanner = {
  text: string;
  buttonPrimary: TNewFeatureButton;
  buttonSecondary?: TNewFeatureButton;
};

export type TNewFeatureModal = {
  defaultOpen: boolean;
  headerImage?: ReactNode;
  title?: string;
  close: boolean;
  content: ReactNode;
  buttonPrimary?: TNewFeatureButton;
  buttonSecondary?: TNewFeatureButton;
};

export type TNewFeature = {
  order: number; // TODO non-linear feature onboarding
  isEnabled: (featureFlags: TFeatureFlags, themeConfig: TThemeConfig, theme: TTheme) => boolean;
  banner?: TNewFeatureBanner;
  card?: TNewFeatureCard;
  modal?: TNewFeatureModal;
};
