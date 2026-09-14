import { TButtonColor, TButtonVariant } from "@/components/atoms/button/Button";
import { IProps as IPageLinkProps } from "@/components/atoms/pageLink/PageLink";
import { IModalProps } from "@/components/molecules/modal/Modal";

import { TFeature, TFeatures } from "./features";

export const TUTORIAL_NAMES = ["knowledgeGraph", "climateLitigationDatabase", "newSearch"] as const;
export type TTutorialName = (typeof TUTORIAL_NAMES)[number];

export type TTutorialButtonAction = "dismiss" | "showModal" | null;

export interface ITutorialButton {
  text: string;
  action: TTutorialButtonAction;
  color?: TButtonColor;
  variant: TButtonVariant;
  pageLink?: Omit<IPageLinkProps, "children">;
}

export type TTutorialCard = {
  title?: string;
  text: string;
  close: boolean;
  buttonPrimary: ITutorialButton;
  buttonSecondary?: ITutorialButton;
};

export type TTutorialBanner = {
  text: string;
  buttonPrimary: ITutorialButton;
  buttonSecondary?: ITutorialButton;
};

export interface ITutorialModalButtonProps {
  action: TTutorialButtonAction;
  className?: string;
}

export type TTutorialModal = {
  defaultOpen: boolean;
  pages?: string[];
  getModalProps: (context: {
    actions: Record<TTutorialButtonAction, () => void>;
    features: TFeatures;
    name: TTutorialName;
  }) => Omit<IModalProps, "isOpen" | "onClose">;
};

type TTutorial = {
  featureKey: TFeature;
  banner?: TTutorialBanner;
  card?: TTutorialCard;
  modal?: TTutorialModal;
};

export type TTutorials = Record<TTutorialName, TTutorial>;
