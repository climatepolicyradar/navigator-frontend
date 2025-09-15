import { Meta, StoryObj } from "@storybook/nextjs";

import { NEW_FEATURES } from "@/constants/newFeatures";

import { NewFeatureModal } from "./NewFeatureModal";

const meta = {
  title: "Molecules/New Features/NewFeatureModal",
  component: NewFeatureModal,
  argTypes: {},
} satisfies Meta<typeof NewFeatureModal>;
type TStory = StoryObj<typeof NewFeatureModal>;

export default meta;

export const KnowledgeGraph: TStory = {
  args: {
    modal: {
      ...NEW_FEATURES[0].modal,
      defaultOpen: true,
    },
    order: NEW_FEATURES[0].order,
  },
};

export const Litigation: TStory = {
  args: {
    modal: NEW_FEATURES[1].modal,
    order: NEW_FEATURES[1].order,
  },
};
