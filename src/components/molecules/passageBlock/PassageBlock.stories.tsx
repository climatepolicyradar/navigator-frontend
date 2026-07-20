import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PassageBlock, TPassage } from "./PassageBlock";

const meta = {
  title: "Molecules/PassageBlock",
  component: PassageBlock,
  parameters: { layout: "centered" },
  args: { onCopyClick: () => {}, onDocumentLinkClick: () => {} },
} satisfies Meta<typeof PassageBlock>;
type TStory = StoryObj<typeof PassageBlock>;

export default meta;

const basePassage: TPassage = {
  id: "passage-1",
  document_id: "doc-1",
  idx: 12,
  content:
    "Certain ecological and other requirements for geohazards and for the areas used by cultivation or toxic waste, in particular for the destruction of grassland with high biological diversity within the meaning of Directive (EU) 2018/2001 and areas with high carbon stocks.",
  pages: [{ page_number: 16 }],
  heading_id: "heading-1",
  documentTitle: "Law for the expansion of renewable energies (Renewable Energy Sources Act - EEG 2023; consolidated version)",
  headingText: "Section 4: National Target 16. Mainstreaming Biodiversity into National Development",
};

export const Default: TStory = {
  args: {
    passage: basePassage,
  },
};

export const Clickable: TStory = {
  args: {
    passage: basePassage,
    onPassageClick: () => {},
  },
};

export const MinimalData: TStory = {
  args: {
    passage: {
      id: "passage-2",
      document_id: "doc-2",
      idx: 0,
      content: "A short passage with only a document name — no page or section heading available.",
      documentTitle: "National Climate Change Adaptation Strategy",
    },
  },
};

export const NoHeading: TStory = {
  args: {
    passage: {
      ...basePassage,
      headingText: undefined,
    },
  },
};

export const NoPage: TStory = {
  args: {
    passage: {
      ...basePassage,
      pages: undefined,
    },
  },
};
