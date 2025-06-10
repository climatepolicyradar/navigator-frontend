import _ from "lodash";
import Image from "next/image";
import { ReactNode } from "react";

import { ExternalLink } from "@/components/ExternalLink";
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
    modalContent: (
      <>
        <p>We have introduced a new layer of structure to the data, automatically identifying mentions of key climate topics in documents.</p>
        <Image src="/images/features/knowledge-graph.jpg" alt="A screenshot showing a list of topics" width={792} height={446} />
        <p>
          Moving beyond simple search + browse, this feature will help you quickly find where important topics (i.e. economic sectors, targets, and
          climate finance instruments) appear across the database. You will now be able to identify the primary focuses of each document faster too.
        </p>
        <p>
          This is more precise than standard search, but accuracy is not 100%. Help us to improve by{" "}
          <ExternalLink url="https://eu.jotform.com/250402253775352" className="underline">
            giving us feedback
          </ExternalLink>
          .
        </p>
        <p>
          <ExternalLink url="/faq" className="underline">
            Read more in the FAQs
          </ExternalLink>
        </p>
      </>
    ),
  },
];
