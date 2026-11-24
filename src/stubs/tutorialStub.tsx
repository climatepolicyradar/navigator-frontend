import Image from "next/image";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { TutorialButton } from "@/components/molecules/tutorials/TutorialButton";
import { TTutorial } from "@/types";

export const TUTORIAL_STUB: TTutorial = {
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
    getModalProps: ({ actions, features, name }) => ({
      title: "New improvements",
      showCloseButton: true,
      children: (
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
          {features.litigation && <p>Litigation-specific topics are coming soon.</p>}
          <div className="flex gap-2">
            <TutorialButton
              pageLink={{ href: "/faq", hash: "topics-faqs" }}
              action="dismiss"
              actions={actions}
              name={name}
              use="modal"
              text="Learn more"
              variant="solid"
            />
            <TutorialButton action="dismiss" actions={actions} name={name} use="modal" text="Dismiss" variant="ghost" />
          </div>
        </>
      ),
    }),
  },
};
