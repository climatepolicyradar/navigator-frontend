import _ from "lodash";
import { ReactNode } from "react";

import { TConfigFeature } from "@/types";

export interface INewFeature {
  order: number;
  relatedConfigFeature?: TConfigFeature;
  bannerText: string;
  cardText: string;
  modalContent: ReactNode;
}

export const NEW_FEATURES: INewFeature[] = [
  {
    order: 0,
    relatedConfigFeature: "knowledgeGraph",
    bannerText: "You can now find what you're looking for faster",
    cardText: "Find mentions of topics in documents. This is more precise than standard search, but accuracy is not 100%.",
    modalContent: "TODO",
  },
];
