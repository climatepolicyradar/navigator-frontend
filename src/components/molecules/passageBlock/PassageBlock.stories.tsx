import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { IPassageLabel } from "@/types";

import { PassageBlock, TPassage } from "./PassageBlock";

const meta = {
  title: "Molecules/PassageBlock",
  component: PassageBlock,
  parameters: { layout: "centered" },
  args: { onCopyClick: () => {}, onDocumentLinkClick: () => {} },
} satisfies Meta<typeof PassageBlock>;
type TStory = StoryObj<typeof PassageBlock>;

export default meta;

const makeLabel = (value: string): IPassageLabel => ({
  classifier_id: `classifier-${value}`,
  end_index: 0,
  labelled_text: value,
  labellers: ["classifier"],
  start_index: 0,
  value: { id: `concept-${value}`, type: "concept", value },
});

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

export const MultiplePages: TStory = {
  args: {
    passage: {
      ...basePassage,
      pages: [{ page_number: 15 }, { page_number: 16 }, { page_number: 17 }],
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

export const WithTopic: TStory = {
  args: {
    passage: {
      ...basePassage,
      labels: [makeLabel("Biodiversity")],
    },
  },
};

export const WithMultipleTopics: TStory = {
  args: {
    passage: {
      ...basePassage,
      labels: [makeLabel("Biodiversity"), makeLabel("Renewable energy"), makeLabel("Land use")],
    },
  },
};

// `makeLabel` leaves the span indices at zero, which is enough for the topic list but not
// for the highlighting, so this label is positioned against the base content
const makeSpanLabel = (value: string, startIndex: number, endIndex: number): IPassageLabel => ({
  ...makeLabel(value),
  start_index: startIndex,
  end_index: endIndex,
});

// Shows all three fills at once: the "Land use" span is topic-only, the second "high" is
// query-only, and the first "high" sits inside the "Biodiversity" span so it is both
export const WithHighlights: TStory = {
  args: {
    passage: {
      ...basePassage,
      labels: [makeSpanLabel("Biodiversity", 163, 188), makeSpanLabel("Land use", 8, 18), makeLabel("Renewable energy")],
    },
    query: "high",
    // "Renewable energy" is left out, so the topics list shows an active and an inactive topic
    activeTopicsIds: ["concept-Biodiversity", "concept-Land use"],
  },
};

export const ClickableWithTopics: TStory = {
  args: {
    passage: {
      ...basePassage,
      labels: [makeLabel("Biodiversity"), makeLabel("Renewable energy")],
    },
    onPassageClick: () => {},
  },
};
