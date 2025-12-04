import { ReactNode } from "react";

import { TButtonColor, TButtonVariant } from "@/components/atoms/button/Button";

import { TFeatureFlags } from "./features";
import { TThemeConfig } from "./themeConfig";

export const TUTORIAL_NAMES = ["knowledgeGraph", "climateLitigationDatabase"] as const;
export type TTutorialName = (typeof TUTORIAL_NAMES)[number];

export type TTutorialButtonAction = "dismiss" | "showModal";

type TTutorialButton = {
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

type TTutorial = {
  isEnabled: (featureFlags: TFeatureFlags, themeConfig: TThemeConfig) => boolean;
  banner?: TTutorialBanner;
  card?: TTutorialCard;
  modal?: TTutorialModal;
};

export type TTutorials = Record<TTutorialName, TTutorial>;
