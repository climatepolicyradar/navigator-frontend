import _ from "lodash";
import Image from "next/image";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { TTutorials } from "@/types";
import { isKnowledgeGraphEnabled, isLitigationEnabled } from "@/utils/features";

export const TUTORIALS: TTutorials = {
  knowledgeGraph: {
    isEnabled: isKnowledgeGraphEnabled,
    banner: {
      text: "You can now find what you're looking for faster",
      buttonPrimary: {
        text: "Learn more",
        action: "showModal",
        variant: "outlined",
      },
      buttonSecondary: {
        text: "Dismiss",
        action: "dismiss",
        variant: "ghost",
      },
    },
    card: {
      title: "New improvement",
      text: "Find mentions of topics in documents. This is more precise than standard search, but accuracy is not 100%.",
      close: true,
      buttonPrimary: {
        text: "Learn more",
        action: "showModal",
        variant: "outlined",
      },
      buttonSecondary: {
        text: "Dismiss",
        action: "dismiss",
        variant: "ghost",
      },
    },
    modal: {
      defaultOpen: false,
      title: "New improvements",
      close: true,
      content: (
        <>
          <p>We have introduced a new layer of structure to the data, automatically identifying mentions of key climate topics in documents.</p>
          <p>
            <PageLink href="/search" hash="concepts" className="underline">
              Find topics in documents
            </PageLink>
          </p>
          <Image src="/images/features/knowledge-graph.jpg" alt="A screenshot showing a list of topics" width={792} height={446} />
          <p>
            Moving beyond simple search + browse, this feature will help you quickly find where important topics (i.e. economic sectors, targets, and
            climate finance instruments) appear across the database. You will now be able to identify the primary focuses of each document faster too.
          </p>
          <p>
            This is more precise than standard search, but accuracy is not 100%. Help us to improve by{" "}
            <PageLink external href="https://eu.jotform.com/250402253775352" className="underline">
              giving us feedback
            </PageLink>
            .
          </p>
        </>
      ),
      buttonPrimary: {
        text: "Learn more",
        action: "dismiss",
        pageLink: { href: "/faq", hash: "topics-faqs" },
        variant: "solid",
      },
      buttonSecondary: {
        text: "Dismiss",
        action: "dismiss",
        variant: "ghost",
      },
    },
  },
  climateLitigationDatabase: {
    isEnabled: isLitigationEnabled,
    modal: {
      defaultOpen: true,
      headerImage: <Image src="/images/features/ccc.jpg" alt="The logo of Sabin Center for Climate Change Law" width={920} height={400} />,
      close: true,
      title: "Welcome to our new site",
      content: (
        <p>
          The Climate Litigation Database is the most comprehensive resource tracking climate change litigation worldwide. Please bear with us while
          we make some exciting new updates.
        </p>
      ),
      buttonPrimary: {
        text: "I understand",
        action: "dismiss",
        color: "mono",
        variant: "outlined",
      },
    },
  },
} as const;
