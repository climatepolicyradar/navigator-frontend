import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TTopic } from "@/types";

import { EmptyPassages } from "./EmptyPassages";

const meta = {
  title: "Molecules/EmptyPassages",
  component: EmptyPassages,
  parameters: { layout: "centered" },
  args: { onClearClick: () => {}, onConceptClick: () => {} },
  argTypes: {
    onClearClick: { control: false },
    onConceptClick: { control: false },
  },
} satisfies Meta<typeof EmptyPassages>;
type TStory = StoryObj<typeof EmptyPassages>;

export default meta;

const concepts: Partial<TTopic>[] = [
  { preferred_label: "extreme weather", wikibase_id: "Q374" },
  { preferred_label: "air pollution", wikibase_id: "Q412" },
  { preferred_label: "marine risk", wikibase_id: "Q368" },
  { preferred_label: "terrestrial risk", wikibase_id: "Q404" },
];

export const NoQuery: TStory = {
  args: {
    concepts: concepts as TTopic[],
    hasQuery: false,
  },
};

export const NoResults: TStory = {
  args: {
    concepts: concepts as TTopic[],
    hasQuery: true,
  },
};

export const NoConcepts: TStory = {
  args: {
    concepts: [],
    hasQuery: false,
  },
};

export const NoResultsWithoutConcepts: TStory = {
  args: {
    concepts: [],
    hasQuery: true,
  },
};
